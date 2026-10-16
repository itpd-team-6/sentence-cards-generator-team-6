"""The API call that asks the language model for a sentence."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, StringConstraints

from app.llm import Language, LlmClient, LlmError, LlmNotConfigured, get_llm_client

router = APIRouter()


class SentenceRequest(BaseModel):
    word: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    text_language: Language
    first_language: Language
    context: str | None = None
    previous_sentence: str | None = None


class SentenceResponse(BaseModel):
    sentence: str
    translation: str


@router.post("/api/sentences")
def write_sentence(request: SentenceRequest, client: Annotated[LlmClient, Depends(get_llm_client)]) -> SentenceResponse:
    """A sentence with the word and its translation. When the model fails, the status is 502 or 503."""
    try:
        result = client.write_sentence(
            request.word,
            request.text_language,
            request.first_language,
            request.context,
            request.previous_sentence,
        )
    except LlmNotConfigured as error:
        raise HTTPException(status_code=503, detail=str(error)) from None
    except LlmError as error:
        raise HTTPException(status_code=502, detail=str(error)) from None
    return SentenceResponse(sentence=result.sentence, translation=result.translation)
