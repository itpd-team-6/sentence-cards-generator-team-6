# Kickoff meeting script

## Context

Our problem-space sentence: language learners (and their teachers) who study Russian, English or German from real texts want to turn the words they choose into flashcards with example sentences, translations and pronunciation, and review them with spaced repetition, without building each card by hand.

We believe the gap is that no product lets the learner pick words in their own text and get a new, clear example sentence for each one: LingQ (ALT-02) lets the learner pick words but only shows the sentence from the text, and songs2anki (ALT-01) writes new sentences but does not let the learner pick the words.

This meeting has to settle two things: whether this is the right core for the product, and which of the other catalog features (teacher review, re-prioritizing words, three languages, working with Anki) matter first.
A good answer lets us fix the Week 2 scope around one core flow instead of the whole catalog.

Questions marked ★ are the ones that would change the project most; we ask them even if time runs short.

## Questions

**Business goals**

1. _(open)_ You built songs2anki for your own German deck. What made you build it instead of using an existing app?
2. _(open)_ When you studied with that deck, what was different from how you learned words before?

**End users**

3. _(open)_ Besides you, has anyone else used songs2anki or a deck made with it? Who were they, and how did it go?
4. _(open)_ The catalog mentions learners and teachers. In your experience, what does a teacher actually do with a student's vocabulary cards?

**Current workflow**

5. ★ _(open)_ Walk us through the last time you added new words to your deck. What did you do, step by step, and which step took the most time?
6. _(open)_ How did you produce the audio in the demo deck? We couldn't find it in the scripts.
7. _(open)_ Your README says `deck.csv` has words without cards, and we counted about 1,500 of the 4,700. For example, "die Krone" is there with no sentence, yet when we sent it to ChatGPT with your prompt, it got a valid sentence on the first try. Why didn't these words get a sentence, and was that a problem for your learning?

**Pain points and constraints**

8. _(open)_ When you reviewed your cards in Anki, what annoyed you most about them? Can you remember a specific card?
9. _(closed)_ The catalog says the product runs on a VPS or local host. Is that a fixed requirement? What is the reason behind it?
10. _(closed)_ songs2anki uses a paid OpenAI model. For this project, is it fine to depend on a paid AI service, or should the product work with a free model?

**Scope**

11. ★ _(open)_ If by the end of the course the product could do only one thing really well, what should it be?
12. _(closed)_ The catalog lists teacher review, re-prioritizing words, and three interface languages. If one of them had to wait until after the course, which one would you drop first?
13. ★ _(closed)_ The catalog describes the problem as updating an Anki collection. Should the product add cards to the learner's existing Anki, or can the review happen only inside our app?

## Roles

nataliamotand asks, AbdelrahmanAbdel-Aal takes notes, and emapfff observes and records what we did not ask and what the customer did not say.
emapfff may not be able to attend; if so, AbdelrahmanAbdel-Aal takes notes and observes.

## Key improvements

**"Who matters more for this product: the student or the teacher?" -> "The catalog mentions learners and teachers. In your experience, what does a teacher actually do with a student's vocabulary cards?"**

The original asked for an opinion about our product, which the customer would answer with a preference.
The rewrite asks about what teachers actually do, so the answer is a fact from the customer's experience (Mom Test: specifics from their life, not opinions about our idea).

**"Should the product have its own spaced repetition, or is exporting the cards to Anki enough?" -> "The catalog describes the problem as updating an Anki collection. Should the product add cards to the learner's existing Anki, or can the review happen only inside our app?"**

The original treated both options as equal and ignored that the customer's own catalog text frames the problem around an Anki collection.
The rewrite starts from the customer's words and asks about the constraint that decides the scope: whether the product must feed the learner's existing Anki.
