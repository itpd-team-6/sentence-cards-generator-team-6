# Week 3 validation meeting transcript

- **Date:** 2026-10-17
- **Participants:** nataliamotand, AbdelrahmanAbdel-Aal, Customer

The Customer gave permission to record the meeting, to publish the sanitized transcript in this repository and to share the recording privately with the instructors; this was asked before the recording started, so the answers are not on it.
The transcript was produced with an AI transcription tool from the recording, and the team then corrected it (see `ai-usage.md`).
The tool did not mark who was speaking, so the speaker of each turn was assigned from the content and from the speaker names in the video-call service's own transcript; a turn that starts or ends a few words away from the stamped time can be off by a few seconds.
Filler words and false starts were removed, punctuation was added, and words the tool misheard were corrected from context; German words the tool spelled as English words are written as it spelled them.
`[inaudible]` marks speech that could not be made out.
The call dropped several times (about 00:07:30 to 00:09:25, and about 01:56:50 to 02:05:40), so there is no speech at those points.
Each line carries the start time of the sentence it belongs to.

[00:00:02] nataliamotand: Okay, so I'm going to go through the action points we decided in Week 2.

[00:00:09] nataliamotand: We carried out three of them, so we updated the context diagram.

[00:00:15] nataliamotand: I'll share my screen so you can see it. Can you see my screen?

[00:00:35] nataliamotand: Sorry, I had trouble with my internet connection.

[00:00:40] Customer: You are connected now. Okay, no problem.

[00:00:45] Customer: I think we can proceed. I reconnected, so I see the screen.

[00:00:59] nataliamotand: So this is the context diagram that we updated.

[00:01:02] nataliamotand: Last week we did not have the audio source drawn here, and we added it, as we said we would.

[00:01:12] nataliamotand: As you can see now, below the product we have the audio source.

[00:01:15] nataliamotand: The external system is not chosen yet.

[00:01:19] nataliamotand: We also prepared an example for the study queue, which we will show later in the meeting; that was the other action point.

[00:01:26] nataliamotand: About the third action point, the Anki repositioning measurement: I finished it just before this meeting.

[00:01:38] nataliamotand: If you read the script, you will see that when I wrote it, it was not yet done, but I will add it to the meeting report after we finish here.

[00:01:52] nataliamotand: The result was almost 21 seconds for the repositioning.

[00:01:55] nataliamotand: The first time we timed it, it was about 55 seconds to grade the cards, and we did the run with the same cards we used.

[00:02:05] nataliamotand: The fourth action point that we mentioned the previous week, we did not carry out for this meeting, and we will postpone it.

[00:02:12] nataliamotand: That is, we have not decided yet where the audio will come from, and this action point will come back as next week's.

[00:02:25] nataliamotand: Last meeting you told us that the product was self-hosted, so that no data is sent anywhere, and the audio is the same question.

[00:02:41] nataliamotand: I was wondering if the audio has to come from an outside source: is it okay if it comes from an online service, or must it run on the learner's own machine?

[00:02:53] nataliamotand: Do you have an answer for that?

[00:03:03] Customer: Yes, so it may come from a new source, be it a self-hosted LLM, sorry, not an LLM, a text-to-speech model, or be it an online service.

[00:03:19] Customer: Anyway, it's outside of the application.

[00:03:21] Customer: The application should just be configured in a way to connect to that source and request audio for a sentence or for a word.

[00:03:39] nataliamotand: Okay, thanks for the answer, and we'll put this as a decision for the project.

[00:03:48] nataliamotand: I think we can move forward with the first story from last week.

[00:03:54] nataliamotand: User story one was "I get a sentence and a translation for each word I mark in a text".

[00:04:03] nataliamotand: I will show the three acceptance criteria that we put for this story, one at a time.

[00:04:07] nataliamotand: This is the initial view of the product, and here we can select the language that the text is going to have.

[00:04:24] nataliamotand: I don't know if you saw it, but the application does not allow the language that we input to be the same as the output language, the translation, so it is blocked here.

[00:04:38] nataliamotand: I don't know if you can see it.

[00:04:46] nataliamotand: This is the text that I got to test, and as soon as we paste the text here, we have an option to mark the words that we do not know.

[00:04:56] Customer: Okay, how do you mark them?

[00:05:05] nataliamotand: You can just select them here, but first I'd like to show you what happens if we don't mark any word and ask for sentences.

[00:05:18] nataliamotand: We are notified that there are no words selected, and therefore the LLM is not called to make any translations.

[00:05:25] nataliamotand: The application only allows us to move forward if we have selected words.

[00:05:33] nataliamotand: Now I'll select some. I won't say the words in German because my German is not so good, but I'll pick a few as examples and ask for sentences.

[00:05:52] nataliamotand: Here we have a notification that the translations are being worked on, and as soon as the LLM responds, the cards appear.

[00:06:02] Customer: [inaudible] indicates the colors that you decided to use. Why did you decide to use such red colors?

[00:06:11] nataliamotand: I tested a few options, such as purple, yellow and green, and I also tried some combinations of them.

[00:06:26] nataliamotand: I chose red mainly because I wanted a single color, so we could have a unique visual identity for the application.

[00:06:36] nataliamotand: This color is changeable, and we can also use different ones for checks that are successful, or for errors.

[00:06:54] nataliamotand: I guess you are free to express what feels best for you, and I understand why red might feel like an error color.

[00:07:03] nataliamotand: It's good that you brought this up, because it's important for us that you share your opinion about the website.

[00:07:09] Customer: Right now I can't suggest a color that feels best.

[00:07:16] Customer: Maybe your choice was also influenced by the night theme that you used.

[00:07:27] Customer: You see the background is dark, and maybe only such a reddish color had enough contrast on this background. Was this a consideration?

[00:07:43] nataliamotand: About the contrast, yes, it was important for me that it had a good contrast and followed UX/UI principles.

[00:07:51] nataliamotand: I think if we try the contrasts it will be okay, but you are right that it might not be the best option, because they are both night colors; they are dark visually.

[00:08:10] nataliamotand: Maybe we could try something a little bit different for the application.

[00:08:17] nataliamotand: I'll take this into consideration and come up with a few options, so we can choose among them in the next meeting. Is that okay with you?

[00:08:24] Customer: Yeah, sure, thank you.

[00:08:31] nataliamotand: Thank you. Let's proceed, then.

[00:08:36] nataliamotand: So we have some cards, and I'll talk to you about acceptance criterion three, the one where the model does not answer.

[00:08:53] nataliamotand: It didn't happen here: all the words that we selected have different sentences.

[00:09:01] nataliamotand: But when I was trying with the Russian language earlier, the model didn't respond right away for one of the words I selected.

[00:09:10] nataliamotand: One of the words got created as a card, but for the other one, the word appeared but neither the sentence nor the translation did.

[00:09:25] nataliamotand: So the card was created with no sentence and no translation, but with the button options.

[00:09:33] nataliamotand: What happens in this acceptance criterion is that you are notified that the LLM may have a problem responding, and after a few seconds you can click the new sentence button to ask again for a sentence and its translation.

[00:09:51] nataliamotand: It will work, at least that's what happens to me. I can also show you in the terminal.

[00:10:07] nataliamotand: It might take a while, and I don't know if the intention of this meeting is that you see my code.

[00:10:14] nataliamotand: I was wondering if this is what you would expect to happen in this scenario specifically, and I can rephrase the question.

[00:10:32] Customer: I think, to me it also happened that some words didn't receive sentences.

[00:10:48] Customer: To be fair, the LLM always generated a sentence for a card, but that sentence might not satisfy the acceptance criteria that I said.

[00:10:58] Customer: Therefore, such a sentence could be wiped out and regenerated.

[00:11:07] Customer: If the LLM that you use does not produce a valid sentence, then a request should be issued automatically to ask for another sentence.

[00:11:32] Customer: If you notice that the LLM consistently can't produce a sentence for a word, then probably you can set a limit on the number of attempts to generate a sentence.

[00:11:49] Customer: These attempts should be done automatically, until you either get a valid sentence or the problematic responses keep arriving.

[00:12:01] nataliamotand: Let me make sure I understood.

[00:12:16] nataliamotand: If the user clicks the button "ask for sentences" and it shows the card created without a sentence, the user should not have to click the "new sentence" button.

[00:12:31] nataliamotand: The request to the LLM to generate the sentence should happen automatically, without any other user input. Right?

[00:12:42] Customer: Yes, this is correct.

[00:12:54] Customer: Another comment is that it may require an indefinite number of attempts to generate a sentence, so probably you need to limit the number of attempts, so the user does not wait indefinitely.

[00:13:10] nataliamotand: And in that case, if the limit is reached and the sentence still cannot be generated, should we not create the card at all and notify the user, or should we create the card and leave the space blank, so the user can later try the new sentence button?

[00:13:27] Customer: Good question. Either we should somehow visually mark that card, or keep it blank.

[00:13:48] Customer: I think blank will be all right.

[00:13:56] nataliamotand: Blank, you mean like this, right? Not faded, but blank: the sentence for that card contains nothing.

[00:14:11] Customer: Blank text. Such cards will be noticeable and discoverable, because they are blank compared to other cards which have something.

[00:14:33] Customer: And the user, I guess, will recognize that they need to ask for sentences again or type the sentences themselves.

[00:14:38] Customer: And regarding the flag for such cards.

[00:14:45] nataliamotand: Sorry, can you repeat the question? Was that a question?

[00:14:55] Customer: No, no. My opinion is that we should allow blank cards, cards having no text, and the user may regenerate them later.

[00:15:17] Customer: But should we help the user with such cards? Should we help them select such cards automatically, or should we let them sort the list so that such cards appear higher in the list, and the user can request new sentences for them?

[00:15:53] Customer: I'm not sure which is better.

[00:16:00] Customer: Maybe it's already covered. What does "ask for sentences" do with such cards? If they have blank text, so the sentence does not exist and the translation does not exist, what happens to such a card when you click "ask for sentences"?

[00:16:22] nataliamotand: We click "ask for sentences" only when we are selecting the words for the first time.

[00:16:29] nataliamotand: So in the case that the LLM doesn't respond, the word will be created, but the sentence and the translation will be blank.

[00:16:46] nataliamotand: This is how it happens right now.

[00:16:50] nataliamotand: As you mentioned, I'll make the request for other sentences automatic.

[00:16:56] nataliamotand: Right now, you can request again from the LLM by clicking the "new sentence" button, not "ask for sentences"; it is this button on the card.

[00:17:08] Customer: Okay. If I have, say, 300 cards, and I need to regenerate some of them, maybe because they have bad sentences, or maybe they are blank, which is also bad, what do I do?

[00:17:36] nataliamotand: Right now, as the MVP is built, you would have to click the "new sentence" button on each of the lines that you think are not satisfactory.

[00:17:45] nataliamotand: The sample you brought of 300 cards is a good example.

[00:17:54] nataliamotand: Maybe something we could do is add a little checkbox in the first column of the cards table, so you could select cards and regenerate a new sentence for each of the selected ones, and you wouldn't have to click them separately.

[00:18:18] nataliamotand: Is that aligned with your thinking?

[00:18:22] Customer: Yes, something like this might work.

[00:18:27] Customer: But then I wonder why you need the flag button. What does it do? Does it flag sentences for regeneration?

[00:18:41] nataliamotand: No. The flags are only so the user can see that there's something in that word or card that might not be adequate.

[00:18:51] nataliamotand: This is an assumption of mine from the previous meetings that we had.

[00:19:01] nataliamotand: I had the impression that the flags would be used for the user to ask the teacher for a revision of the sentence or the translation, or maybe it's a card that the user doesn't want to appear yet and wants to correct something.

[00:19:14] nataliamotand: Initially the idea was this, but if you have a different one, please share it with us so we can adjust it.

[00:19:29] Customer: There are two approaches here, and some considerations are connected with them.

[00:19:36] Customer: We could use the flag to both mark cards for regeneration and for later review by the teacher, or we can have separate buttons: one for regeneration and one for flagging for the teacher.

[00:20:12] Customer: We need the flag for regeneration because the student may want to regenerate without asking the teacher, without waiting for them; maybe they don't even have a teacher.

[00:20:33] Customer: And they may be not sure about some cards, whether they are bad or good, and they don't regenerate them immediately; such cards they may mark for a teacher.

[00:21:01] Customer: Then the teacher may review them later.

[00:21:04] Customer: But we should also keep in mind that the student cannot discover all problematic cards, so the teacher should not only see the cards marked for them, but also other cards, because they may also have some problems.

[00:21:36] nataliamotand: It's important that you mentioned that, because we still haven't built the teacher's view.

[00:21:44] nataliamotand: I'll make sure that we take it into consideration, so that we can see not only the cards flagged by the students but all of them. Thanks for sharing that.

[00:22:00] Customer: I have another comment about this flag for teachers: we should decide on the purpose of this flag.

[00:22:08] Customer: Is it something the student is genuinely not sure about, and the other cards are okay? Or should the student be able to select a batch of cards, say a hundred, meaning that these are the only cards that the teacher should check?

[00:22:27] Customer: They may contain bad sentences and good sentences, but they are meant to be reviewed by the teacher, and other cards are not meant to be reviewed, because maybe they will be studied later.

[00:22:50] Customer: So there are two options: either they are not sure about some sentences and they want the teacher to check precisely them, and then the teacher should see both marked and unmarked sentences, or we should let the student select cards for review specifically. What do you think?

[00:23:26] Customer: Do you have any opinion right now?

[00:23:37] nataliamotand: I can share my initial thoughts on this, but I think it's a point we can take for further discussion.

[00:23:45] nataliamotand: Right now I think the teacher should have access to the full table of the student, as in the first option you gave, and can also see the distinction that the student made between non-flagged cards and flagged ones, the ones the student had some doubt about.

[00:24:07] nataliamotand: I think that would be the most complete option, but I can give it a little more thought and come back with a more structured answer in the next meeting.

[00:24:25] nataliamotand: If you have a preference between these two options and want to share it with me, that would also be great.

[00:24:45] Customer: I think we can generalize both approaches, and then they will converge.

[00:24:51] Customer: We can let the student mark cards for a teacher, and the teacher will see all cards, but those cards marked for the teacher will appear higher in their list, so that they know which cards the student wants the teacher's attention to be directed to first.

[00:25:19] Customer: I think this will be enough.

[00:25:23] nataliamotand: That's a good option for me also, and I will make sure that we build accordingly.

[00:25:36] nataliamotand: Okay, good. Let's proceed with the interface.

[00:25:48] Customer: This interface is for the core task, right?

[00:25:59] nataliamotand: Yes, this is for user story one: "get a sentence and translation for each word I mark in the text".

[00:26:12] nataliamotand: If you have any more opinions on this, please share them with us.

[00:26:21] nataliamotand: When you are done, I just want to register here whether this user story is accepted or rejected in the meeting. Could you please show it again?

[00:26:37] nataliamotand: The first acceptance criterion: given a text in Russian, English or German that I pasted, when I mark three words as unknown and ask for sentences, then each of the three words is shown with one sentence in the text language that contains that word, and its translation into my first language.

[00:27:08] Customer: Could you show the site?

[00:27:12] nataliamotand: Yes, of course.

[00:27:18] Customer: Okay, I see the sentence, the translation, and the word, and it appears in the sentence in the language that I learn.

[00:27:40] Customer: It seems like this is satisfied.

[00:27:48] nataliamotand: Okay, let's go to the next one.

[00:28:01] nataliamotand: Given a pasted text in which I marked no word, when I ask for sentences, then no sentence is shown and the product tells me that no word is marked.

[00:28:07] nataliamotand: This was the first thing that I showed you: I marked the words beforehand and then unmarked them, so I could show you that if we ask for sentences with no words marked, it shows a warning that it didn't generate any sentences. I don't know if you remember that.

[00:28:28] Customer: Not really. Could you please show it again?

[00:28:33] nataliamotand: Yes, of course.

[00:28:37] Customer: And your cards, what do they show now?

[00:28:50] nataliamotand: The cards show the ones that we created before, but as you can see there are only four of them and no new cards, because we hadn't selected any word.

[00:29:05] Customer: And when you select the words that you had before, what does it do?

[00:29:18] nataliamotand: Garden. It generates a new card next time; it will regenerate a new card, so this is something we can change.

[00:29:43] nataliamotand: Another thing that I also tested is that if you paste a text with the same word in different parts of the text and mark more than one of them, you only get one card per word you select in the same text.

[00:30:11] nataliamotand: But if you paste another text and want to select the same word there, that's not blocked yet. As you can see here, we have two sentences for "garden".

[00:30:21] nataliamotand: If that's not a good option, because the user might have forgotten that they already have a card for this, we can block it.

[00:30:37] Customer: I had an idea, and I shared it with another team also.

[00:30:50] Customer: We would like to generate a card where the word is used in a sentence with the same meaning as in the original context, in the original text.

[00:31:13] Customer: A word can have different meanings depending on the context, so a word plus its context, the sentence where it appears, can become a unique identifier for such a card.

[00:31:36] Customer: I don't know how to call it properly, but maybe we generate cards that have unique identifiers, so each card should have a unique combination of the word and the sentence where it appears.

[00:32:00] Customer: This way we can make the generation operation idempotent: if we ask to generate a card for a word that appears in the same sentence, then no card is generated, because we already have such a card.

[00:32:19] Customer: Do you get the idea?

[00:32:22] nataliamotand: Yeah, let me just make sure. Each card should be identified by word and meaning.

[00:32:30] nataliamotand: If there is already a card with that word and meaning, and I click that same word and meaning in a new text, the product shouldn't create a new card; it should only create one if the word has a different context. Is that okay?

[00:32:58] Customer: Thank you, that's perfect.

[00:33:00] Customer: The sentence where that word appears is a proxy for this meaning; we don't have better context.

[00:33:06] Customer: We could have asked an LLM to compress the surrounding context of the word into some meaning, but then the meaning may change from card to card, so we choose something stable, namely the sentence where the word appears.

[00:33:35] Customer: When the sentence changes, the identifier of the card, the combination of the word and its meaning, changes, and so a new card can be generated.

[00:33:51] Customer: There are corner cases: in a text, a word may appear outside of a sentence, so we need to handle this somehow, maybe store not one sentence but also the surrounding sentences.

[00:34:13] Customer: But in this case there are also corner cases, like a list of words, one word per line, for example, where you can have any sentences.

[00:34:30] Customer: So this corner case has to be handled somehow.

[00:34:30] nataliamotand: Okay, thanks for sharing. I have a couple of questions about this, if that's okay, just so I make sure I get all the parts right.

[00:34:46] nataliamotand: Right now, in this text there are two "garden" options, and when I click one of them, both of them are selected.

[00:35:09] nataliamotand: In the case where we develop the identifier as word and meaning, I was wondering if this should only happen when they have the same identifier, and if they don't have the same identifier, they shouldn't both be selected by just clicking. Did you understand my question?

[00:35:33] Customer: Yes. This situation is pretty rare; usually texts have very different sentences.

[00:35:56] Customer: [inaudible] usually when you select a word, it's not selected anywhere else, because in a normal text most of the words will be like that.

[00:36:20] Customer: In some specific text where a sentence is repeated, and you select a word inside such a sentence, that word is selected in all other such sentences.

[00:36:36] Customer: This might be confusing for a user who got accustomed to only one occurrence of a word being selected when they click a word.

[00:36:56] Customer: On the other hand, you can prevent them from doing unnecessary work: they don't need to select words with the same meaning in other sentences if they have already selected one.

[00:37:13] Customer: As a little UX feature, maybe let's support this.

[00:37:20] Customer: In the case that you showed, the second "garden" should not be selected, because it doesn't occur in the same context, it's not inside the same sentence.

[00:37:32] Customer: But if that sentence were the same, so if the last sentence was repeated, then two occurrences of "garden" should have been selected. What do you think about this approach?

[00:37:50] nataliamotand: I think it's a good approach; it's very user friendly, I would say, and we can try to implement that and show you in our next meeting.

[00:38:00] nataliamotand: I understand it.

[00:38:08] nataliamotand: My second question is also related to this context. I was wondering if the identifier shouldn't be the word and the meaning, like the context.

[00:38:17] nataliamotand: Your suggestion was that we put a few sentences so we know the context. I was wondering if it wouldn't be easier, and would attend the necessities of the user, if we just use the word and the translation. Do you think it's too different, context versus translation, in this case?

[00:38:51] Customer: Very good question. We need to consider two things here.

[00:38:59] Customer: First of all, a word can be part of an idiom, and then the translation, what should it be? It won't be a single word, maybe it will be a phrase.

[00:39:34] Customer: But then the problem is that the user has selected a word inside an idiom, and ideally we should be able to tell them that they can't get a precise translation of that word, because it has a different meaning inside the idiom.

[00:39:58] Customer: If we get rid of such a corner case, then each word has a corresponding translation to English which should capture its meaning in the sentence.

[00:40:17] Customer: But then we need some way to decide which meaning to use, and we should have several meanings available to pick from, so we need to store some dictionary with meanings and pick meanings from it. How could it technically be implemented?

[00:40:43] nataliamotand: I'm not sure how it would be implemented, but I guess the same way we would do it for a word and a sentence, so the LLM can grasp the concept; we can also do it for words and translations.

[00:41:02] nataliamotand: Maybe we could have a kind of dictionary behind it where we store these pairs of identifiers, and the LLM would consult it and check against the cards that we already have, to see if a card for that was already created.

[00:41:27] nataliamotand: I guess we could build it like that and see how it works in real life and have a more accurate answer about this. I'm not sure I answered your question.

[00:41:44] Customer: No, this is also an option. You don't need to know the meanings of all words in the world; you can just process a text with an LLM, capture meanings for the selected words, and then compose a dictionary.

[00:42:03] Customer: Then if the user selects a new word, you can look it up in the dictionary.

[00:42:12] Customer: But who will decide which meaning to choose?

[00:42:22] Customer: [inaudible] so there should be some round before generating the cards where an LLM maps each word to a proper meaning.

[00:42:43] nataliamotand: Yes, I think that's a good option, especially because I don't think the user is the most adequate person to select this manually, because they are learning a new language and might not know the meaning of the sentence.

[00:42:59] nataliamotand: I guess the LLM searching to see if there are already cards created is our best option right now, and maybe in the future we could add a feature so the teacher can also review these kinds of problems with their expertise, with the support of the LLM.

[00:43:23] Customer: Okay. My only concern in this case is that an LLM is not very precise at selecting the right meaning for the context.

[00:43:46] Customer: But I think this mapping is more compact and can be more economical with respect to tokens.

[00:44:02] Customer: In my approach, where we captured the whole sentence to convey the word meaning and wanted a new sentence based on that meaning, we had to send the word and its sentence, which might be wasteful, but the meaning might be shorter than the whole sentence.

[00:44:28] Customer: This could be checked empirically.

[00:44:36] Customer: Since my approach is pursued by another team, let's go with your approach and see how it works.

[00:44:48] nataliamotand: Sure. That's okay, we'll go with the word and translation as the identifier of the cards and see how that works out in practice, and if we encounter problems with this, we can try the other team's approach.

[00:45:09] nataliamotand: Definitely, the application should work properly, and I'm sure we'll get to the best option.

[00:45:16] Customer: I think I even have another idea. We don't use a translation, but rather use the same language.

[00:45:36] Customer: Instead of specifying the meaning of the word, we just come up with the shortest phrase that contains that word with the same meaning.

[00:45:45] nataliamotand: Sorry, could you repeat? I stopped listening to you for a second.

[00:45:54] Customer: Sure. Yes, I hear you. Can you hear me?

[00:46:07] nataliamotand: Yes, I can hear you now, but I didn't hear what you said. You started saying something but I couldn't catch it.

[00:46:15] Customer: Okay, I'll repeat it, then.

[00:46:22] Customer: You suggested using the translation of a word to correspond to its meaning.

[00:46:28] Customer: We can also use another approach: we can generate a phrase where the word has the same meaning as in the original sentence.

[00:46:46] Customer: So we compact a large context, the whole sentence, into a short phrase where the word has the same meaning. Then we don't lose anything by translating the word to another language.

[00:47:03] nataliamotand: Okay.

[00:47:09] nataliamotand: I think this might work.

[00:47:11] Customer: In the original language, the word with that meaning can usually be used in a shorter sentence, so you don't need to come up with the whole sentence; probably a phrase will be enough, maybe three or four words.

[00:47:33] Customer: This should be explicitly stated for the LLM that will come up with such phrases, something like "write a minimal phrase that uses this word in the original meaning".

[00:47:55] nataliamotand: Okay, this is fine by me. I think it might also be best, since you have had previous experience with this.

[00:48:02] nataliamotand: Just to make sure I got this right, and sorry if I'm being repetitive, I just want to make sure that we are going in the same direction: instead of the word and the meaning, or the word and the translation, we will store the word and a three- or four-word phrase, so the LLM can grasp the meaning of that specific word. Is that correct?

[00:48:28] Customer: Yes, that's okay.

[00:48:37] Customer: And such a meaning should be editable by the user and by the teacher, if they want it to capture the original meaning precisely. If the LLM that produced that meaning did a poor job, then people should be able to fix it.

[00:49:07] Customer: So somewhere in the card editor this meaning should be displayed and be editable.

[00:49:18] nataliamotand: About this, I'd like to share my opinion. I think this is a complication, because we would have the word and sentence that actually appear in the deck for the user to review, and somehow behind it we can also access the identifier for this word.

[00:49:34] nataliamotand: I'm not exactly sure how I would build this. Maybe in this table of cards we could click the word and see its identifier in an editing view, but I don't think it's very good to build a separate page only for the pairs, the identifiers.

[00:50:09] nataliamotand: That's why I'm confused: we would have two different sentences for one word, the sentence that the user actually studies in the deck, and the sentence that is connected to the meaning of that word. I'm not entirely sure how that would work out. Do you understand my question?

[00:50:40] Customer: Yes. We could repurpose the edit button for opening a more advanced editor for a card, for example.

[00:51:04] Customer: There might be other information about the card that could be edited. For example, if a card is shared between decks, you might want to change the decks that the card belongs to, or you may want to ask the teacher some questions about that card, or you may want to generate more cards with that word in that meaning but with different sentences.

[00:51:40] Customer: So we can keep the original table that you showed, but also provide some functionality for advanced editing of cards. What do you think?

[00:52:02] nataliamotand: I would like to share my opinion with you about this, and you can correct me if you think there's a better approach. I would do as you say: I would repurpose the edit button, and instead of changing the sentence in line, I would open a kind of modal view, like a pop-up on the screen, where we have the more technical things, for example knowing which decks that word belongs to, and the identifier field, and still the editing of the sentence and the translation.

[00:52:51] nataliamotand: So I would have this modal view with more information, but I'm afraid it might be a lot of information for the user. I'm not entirely sure, but I think this is the best solution for the problems we have right now.

[00:53:06] Customer: Yes, I agree that it might be a pop-up, an overlay, I don't know how to call it properly, or a sidebar; any information that is hidden while viewing the table but can be opened when needed.

[00:53:35] Customer: I think it was nice that the user could edit the generated sentence in place after clicking the edit button. Maybe we can make the sentences and translations editable without clicking the button, so it is a quick action for a user, like double-clicking the sentence.

[00:54:07] nataliamotand: Like this? If I do this, I can edit, yes.

[00:54:15] Customer: Yes. Maybe the user can clear the translation, and then when you ask to regenerate cards, a new translation will be generated, for example.

[00:54:34] Customer: But coming back to the start of our conversation, what if some fields are blank?

[00:54:57] Customer: If the sentence is changed, then the translation should be regenerated. If the sentence is blank and the translation is not blank, then I think the whole card should be regenerated, because the translation does not constrain what should be generated, and it's bad.

[00:55:33] nataliamotand: Just to make sure we're thinking the same: you say that if the sentence is not generated, neither is the translation. The translation is connected to the sentence.

[00:55:56] nataliamotand: If I put a new word here, a new translation will be generated, adjusted to the sentence, so this column only exists linked to the sentence.

[00:56:12] Customer: Yes, so the translation column depends on the sentence column.

[00:56:20] nataliamotand: It's a live translation of what's in the sentence, so there is no option where the sentence is blank and the translation has content. If the sentence is blank, the translation is also blank.

[00:56:35] Customer: Yes, that's correct.

[00:56:57] nataliamotand: Okay, I lost you for a moment. Did you say something? I'm sorry, I interrupted you, but I want to make sure that we are on the same point, because you mentioned that maybe the sentence was blank but the translation was there, and we would want to generate new sentences. I don't think you finished what you meant, and if you want to continue, feel free; I would love to hear about it.

[00:57:28] Customer: Okay. The German sentence in this case must contain the German word.

[00:57:41] Customer: If the German sentence is blank but the translation is not blank, and we regenerate cards taking the translation into account, then the translation will constrain which German sentences we can generate. Maybe it will even be impossible to generate a German sentence that contains the word and has this translation.

[00:58:18] Customer: Therefore we should make the translation completely dependent on the sentence. Basically, this is the reasoning.

[00:58:39] nataliamotand: Some of it I didn't quite get. Could you repeat why you think the sentence and translation should be independent?

[00:58:54] Customer: Oh no, they must be dependent: the translation depends on the sentence.

[00:59:01] Customer: Right now they are independent, so you can clear the sentence and keep the translation. But if you added the translation to some unrelated sentence...

[00:59:09] Customer: By the way, can you edit the translation?

[00:59:17] nataliamotand: No. That's why I think they are dependent as they are: you can't edit the translation and adjust the sentence based on it.

[00:59:26] nataliamotand: You can just edit the sentence. The other case is when the card is generated: the sentence can be blank, but then the translation will also be blank.

[00:59:40] nataliamotand: So there is no scenario here where we have a translation and we don't have a sentence. The only constraint is that the translation can't be edited.

[00:59:59] nataliamotand: Maybe we could let the translation be edited only by the teacher, and then in the teacher view we would make it work both ways: if the teacher edits the translation, the sentence would be adjusted to mean the same. I don't know exactly how we would do this, but I think it's a point that we can discuss in the future. I don't know if you agree with me.

[01:00:27] Customer: I do agree. Let's keep it read-only for now, and dependent on the sentence.

[01:00:36] Customer: The teacher may want the student to learn a particular mapping from the German word to an English word through the sentences, and then they may want the translation to have a specific English word.

[01:01:06] Customer: But for a student, I think maybe we should trust the user. Maybe we should assume that they know what they are doing and let them edit the translation.

[01:01:34] Customer: When they regenerate the cards, the translation does not change, or it should not change until they regenerate the cards, or they should be able to protect the card from regenerating the translation. I'm not sure.

[01:02:04] Customer: Let's think about protecting the translation. Assume the user knows what they are doing, they protect the translation, and then whenever they edit the translation and ask to regenerate [inaudible].

[01:02:39] nataliamotand: Ah, so the translation is not regenerated if it's not empty, right? I'm not sure what you mean. Could you give an example?

[01:02:50] Customer: Yes, sure. What happens to the translation after you edit the sentence right now?

[01:03:06] nataliamotand: The translation is edited along with it. I put a new word here and the translation changes.

[01:03:17] Customer: So this is the live translation that you mentioned.

[01:03:27] nataliamotand: Yes.

[01:03:33] Customer: And if the sentence does not change, then the translation does not change either, right?

[01:03:41] nataliamotand: Yes.

[01:03:43] Customer: Can the user want to not change the translation but change the sentence?

[01:03:55] Customer: Like they preserve the translation: the translation of the sentence is the same, but the sentence is formulated a bit differently.

[01:04:07] nataliamotand: We can try that. For example, the order of words is different but the translation is the same.

[01:04:13] Customer: Did you see that before?

[01:04:26] nataliamotand: Well, a word was translated as "too beautiful", and as I changed the sentence, the word changed. I'm not entirely sure why that happened, but I can check that out and see how it's working.

[01:04:45] Customer: So it can change depending on the meaning.

[01:04:48] nataliamotand: What's your question about this? Do you have any concerns or worries?

[01:04:54] Customer: Yeah, I would like to give the user the freedom of choosing which translation to learn, basically more control over the cards.

[01:05:15] Customer: By default we can do them a favor and generate translations for them, but if they really want a specific translation, they should be able to preserve it between regenerations.

[01:05:32] nataliamotand: Okay, but in this case we will trust that the user knows what they're doing.

[01:05:43] nataliamotand: Do you think that if the user changes the translation, the sentence should be adjusted accordingly? I think that would be complicated.

[01:05:56] nataliamotand: I think it's okay if we let the translation be editable by the user, but we shouldn't do a double check, because then we would have a kind of iterative translating: I would change the translation, the sentence would change, and the translation would be altered again.

[01:06:17] nataliamotand: If we do this double check, it gets complicated, so I will just assume that if the user wants to change the translation, they know what they are doing. Is that okay with you?

[01:06:31] Customer: Yes. The automatic translation flow is one way, from the sentence to the translation.

[01:06:44] Customer: After the user has edited the translation, such an automatic regeneration of the translation should not happen; the translation should be preserved until the user edits the sentence again.

[01:07:09] nataliamotand: That's fine. It's good that we came to understand it, and I'll make sure that we adapt to what we've discussed here.

[01:07:18] nataliamotand: I want to know how we can move forward with [connection lost].

[01:07:27] Customer: Sorry, I lost you. It seems like Natalia lost the connection.

[01:09:25] nataliamotand: Hello? Hello, can you hear me? Did you hear what I said? I had an internet problem.

[01:09:34] Customer: It's okay. I didn't hear you, though.

[01:09:38] nataliamotand: Okay, I can repeat, no problem.

[01:09:41] nataliamotand: I was saying that we have reached a few minutes past one hour of meeting, and I was wondering what we should do going forward.

[01:09:52] nataliamotand: I had prepared for this meeting to show you the three user stories and their criteria that we had agreed upon in the last meeting, and we have only gone through the first one.

[01:10:07] nataliamotand: So I was wondering how it's best for you for us to move forward, in terms of your availability. For me, the only responsibility I have for today is to turn in the assignment three for this course, so whatever is best for you, I can make it work.

[01:10:27] nataliamotand: Maybe show the other two user stories in a quicker or simplified way, or we could reschedule the rest if you have any problems with time.

[01:10:42] nataliamotand: I was just wondering how is your time and how available you are for the other two user stories that we built.

[01:10:54] Customer: Okay, I'm available right now. Sorry for going into details which might be for the future, not for this particular version, although I appreciate that your version sparked deep conversations about how it should work in general.

[01:11:25] Customer: My last comment about the translation is that we probably should let the user even protect it, so maybe some lock icon, so that when clicked, the translation does not change even if the user changes the sentence and starts a regeneration, because maybe the user wants to preserve the translation.

[01:11:52] Customer: And then I think we can move forward with what you have.

[01:12:05] nataliamotand: I'll make sure that we have some kind of freeze, so the translation doesn't change.

[01:12:16] Customer: Right.

[01:12:21] nataliamotand: Just to confirm, do you have time to look at the other two user stories right now?

[01:12:32] Customer: Yes, I do have time. What about you?

[01:12:36] nataliamotand: I'm okay. As I said, the only thing I have to do today is finish the assignment three for this course, so I'm available for as much time as we need to go through all the relevant points for you.

[01:12:50] nataliamotand: What about you, Abdel? Is that okay with you? I would assume that it's okay.

[01:13:16] AbdelrahmanAbdel-Aal: I have a bad internet connection. If you can hear me, can you repeat again?

[01:13:24] Customer: Yeah, we can hear you.

[01:13:35] nataliamotand: Okay, I'll just move forward. If you have any appointments you need to go to, feel free to do what's best for you. I'll go through the other two user stories.

[01:13:46] nataliamotand: About user story one, Customer, to get it on record: do you accept it or do you reject it, based on the acceptance criteria that we mentioned?

[01:14:06] Customer: Could you please show the short acceptance criterion?

[01:14:12] nataliamotand: Okay. Given a marked word, when the language model does not answer, then that word is shown without the sentence and with the message "the sentence could not be generated", and the other words keep their sentences.

[01:14:27] nataliamotand: Now, this is what I mentioned to you previously: I tested this with a Russian text and this happens to me.

[01:14:53] nataliamotand: It's that thing that I mentioned: the card appears with the word, but the sentence and translation spaces are blank, and that doesn't change any of the other cards in the table.

[01:15:12] Customer: Yes, maybe it's not necessary to show a message for each sentence that could not be generated.

[01:15:20] Customer: Maybe one message will be enough, like "some sentences could not be generated, try again later", and then it will be okay.

[01:15:35] nataliamotand: Okay, let's proceed. I think this acceptance criterion should be adjusted, so is it okay that we don't close this user story for now?

[01:16:05] nataliamotand: If we adjust the third acceptance criterion, should we close it, or should we bring this again to the next meeting, so we decide if it should be closed or not?

[01:16:20] Customer: Let's keep it until the next meeting. Maybe the overall interface will change and something will change, so it would be nice to check this issue again.

[01:16:45] nataliamotand: Okay, so I'm moving forward now with the second user story, "check the sentence written for a word". This user story has six acceptance criteria. Would you like me to read them for you? I can try to show them while I show you the application; I think that might be more dynamic.

[01:17:10] Customer: Okay, please show me the application.

[01:17:17] nataliamotand: The acceptance criterion is that marking a word creates a card for each word without confirmation.

[01:17:26] nataliamotand: You saw that the table appeared by itself, and this was decision five. I don't know if you remember from the last meeting, but we had two options for how to create the cards: we either confirmed all of them or we just created them right away. This is the decision that you made previously: as soon as we ask for the sentences, we don't have to confirm, they just get created.

[01:17:57] nataliamotand: That's the acceptance criterion, so I guess that's okay.

[01:18:02] nataliamotand: Acceptance criterion one is that when I edit the sentence of one word and the new sentence is saved for that word only, the product translates the new sentence again so the translation always matches, and the other cards don't change; if I reload the page, the edit is still there.

[01:18:36] nataliamotand: This is the thing that I was showing you before with these two examples. Would you like me to do them again, or is that okay with you?

[01:18:50] Customer: It's okay, I witnessed that.

[01:18:50] nataliamotand: Okay. Acceptance criterion two is that I ask for a new sentence for one word and I get a different sentence for the same word, and the other words don't change.

[01:19:09] nataliamotand: I can click the button here on this word. Did you see that both the sentence and the translation changed, and all the other words kept their sentences?

[01:19:22] Customer: Yes, yes.

[01:19:24] nataliamotand: I'll also reload the page, so you can see that the sentences don't change.

[01:19:37] Customer: Yeah, I see that.

[01:19:41] nataliamotand: Great. Acceptance criterion three is about the flag: when I flag this sentence, it stays flagged until I edit it, so I can either ask for a new sentence, or edit it manually, or clear the flag.

[01:20:01] nataliamotand: Here is the flag, and I can ask for a new sentence and the flag automatically disappears, or I can edit it and it also disappears. This is the acceptance criterion; do you recognize that we did it? And if you think we should change something about this acceptance criterion, you can also comment on that.

[01:20:41] Customer: Yeah, I saw that both expected behaviors happened. When you change the sentence or regenerate it, the flag disappears.

[01:21:04] nataliamotand: Is that okay with you?

[01:21:08] Customer: Yes.

[01:21:12] nataliamotand: The acceptance criterion four is that when the model does not answer for a request for a new sentence, the current sentence stays and the failure message is shown. This is the same thing as in acceptance criterion five.

[01:21:36] nataliamotand: Since the model responded to each one of our words, I'm not quite sure how to demonstrate that to you now.

[01:21:44] Customer: Could you please clarify which scenario you're testing?

[01:21:55] nataliamotand: Do you remember when I mentioned that when we asked for a sentence, the model might fail, and one of the things that happens is that a card is created with a word but no sentence and no translation? This acceptance criterion, for this user story specifically, is not about when we ask for a sentence and the model doesn't respond; it's about when we ask for regeneration of a sentence and the model doesn't respond.

[01:22:27] nataliamotand: So the same thing happens: it's blank, we have a message that the model is not working, to retry in a few moments, and the translation keeps up with the sentence, so it's also blank.

[01:22:43] Customer: Yes. In this case you can show a message for this card specifically.

[01:22:53] Customer: For the case where multiple cards receive no valid sentence as a response, it's enough to show one message. Or maybe you have another opinion: should we show a message near such problematic cards to highlight each of them, or is one message enough?

[01:23:37] nataliamotand: My personal opinion is that if we only select one card, then the message should specify which word we are referring to, but if we multi-select more than one word, then we should just display a general message.

[01:23:56] nataliamotand: If we put multiple warning signs, I think it might not be so good for the user's view; the page may be too polluted. If we put the warning sign on top, it would have multiple warning signs, or if we put the warning sign in line with the table, there would be a lot of error messages.

[01:24:30] nataliamotand: So basically my opinion is that we should only display one warning sign saying that some of the sentences weren't able to be regenerated.

[01:24:41] Customer: Yes, I agree. Maybe for even better highlighting we can mark such rows in red, so the user knows that they need to be regenerated.

[01:25:08] Customer: Or if they forgot to write a sentence when they edited it, so they edited the sentence and kept it blank, we can also highlight such rows.

[01:25:35] nataliamotand: I have a question, more of a detail about this implementation.

[01:25:43] Customer: I'm sorry, I didn't hear you. Oh yes, please ask.

[01:25:46] nataliamotand: Okay. With the multi-select option, if we select three cards, for example, and ask for new sentences and the LLM fails, maybe the identifier that we will have for this failure will be a different one, or maybe we should use the one that we have, the flag.

[01:26:12] nataliamotand: I was wondering if the flag should be the same as the user flag, or a different kind of visual indicator. I was wondering about your opinion.

[01:26:33] Customer: Okay, so flagging means the user wants to regenerate these cards. But if they have multiple cards, like two thousand, or one thousand, and some of them may be invalid, I think we should not automatically flag them for regeneration, because we care about the user's token budget.

[01:27:07] Customer: If we mark all invalid rows for regeneration, then we have to spend tokens to regenerate these cards, but the user may not want that.

[01:27:26] nataliamotand: The LLM wouldn't be called automatically to regenerate flagged cards. The only thing that would happen in this scenario is that a word that initially wasn't flagged would be flagged because it couldn't be regenerated, so the user knows they wanted to change that sentence but it wasn't possible, for whatever reason.

[01:28:11] Customer: So validation shows problematic rows, and flagging shows which rows are subject to regeneration, right?

[01:28:22] Customer: Take validation, I mean an empty sentence, for example. In this case we don't have to regenerate the sentence for that row; we can just highlight that it's invalid or empty, so that the user knows that there is such a row.

[01:29:03] Customer: Then they can select it for regeneration, click the new sentences button, and for all selected rows the sentences will be regenerated.

[01:29:24] Customer: But I wonder how many such rows with empty sentences there can be, and what to do if there are lots of such cards.

[01:29:35] Customer: As you mentioned, there are consistent problems with generating sentences. If the user has a thousand cards and the sentences in these cards are blank, then using my approach the user has to select each such card and start regeneration. This will happen manually, so selecting a thousand cards might be inconvenient.

[01:30:24] Customer: If we instead use your suggestion to unify the flag for the case when a sentence is invalid and for when a student marked the card as subject for regeneration, then this approach is good for the case when they have lots of invalid cards, like in the Russian case that you provided.

[01:31:05] Customer: But it may misfire in another case, when they have some cards with invalid sentences for which they don't want to regenerate sentences right now.

[01:31:22] Customer: Or maybe it's okay: we generate sentences for such invalid cards once, and then we do not flag them as invalid, and then the user does not have to select them and regenerate.

[01:31:52] Customer: Well, let me refute my argument that the user may want to spare some tokens and not generate sentences for invalid cards. Let's flag them for regeneration automatically, and then we can unify this behavior of the flag and of the validation: whenever a card is invalid, we flag it for regeneration.

[01:32:32] Customer: Sorry for this long reasoning.

[01:32:41] nataliamotand: No problem, it's good that you share your concerns, because even if we don't come to a conclusion now, the more concerns you show, the bigger the chance that I can find a solution that deals with your concerns when I'm developing later. So feel free to talk as much as you want to make sure we get the points; it's no problem at all.

[01:33:14] Customer: Okay, thanks for reassuring me.

[01:33:23] Customer: So, validation sets the flag for invalid cards automatically, and the user can flag them manually if they want, or flag other cards if they want.

[01:33:36] Customer: Regarding the button names, I think they can be more intuitive.

[01:33:44] nataliamotand: The action buttons, you mean?

[01:33:47] Customer: Yeah. What does "flag" mean? Either this should be explained somewhere, or a better name should be found that is intuitively understandable. Maybe "mark for review" is a good option.

[01:34:09] Customer: Maybe we could provide a little legend at the top and use icons instead of full buttons. "Mark for review" might look like a real flag, and the legend, the key, will explain what this flag means. "New sentence" may look like a reload button, a reload icon, and the legend will convey the meaning of that button.

[01:35:01] Customer: What do you think about making more compact buttons?

[01:35:08] nataliamotand: I think it's a good idea that we have some icons that are universal, like the regenerating one with the circular arrow. I think we can adjust that so it's more user friendly.

[01:35:24] nataliamotand: About the flagging, I also think that we should have a different name, but I'm not sure about the icon; maybe we should still have some text. Another idea, maybe an improvement: we could have two kinds of flags, flag to review and flag to regenerate, but we can discuss this further during the development of the project.

[01:35:52] nataliamotand: I'm sure it's good to simplify as much as we can, but still keep the user's comprehension of what every icon and button means. I think it's good that you brought this up, and I'll make sure that we correct that for the next meeting.

[01:36:27] Customer: Also, I'm not sure how it works now, but if the meaning of the buttons is explained above the table, the table should be scrollable without moving the whole page, so that the legend is always visible and the user understands what the buttons mean.

[01:37:01] nataliamotand: Okay, we can do that, the scroll and the legend, maybe in the same place at the beginning of the table, so the user can see it.

[01:37:18] Customer: On desktop it can be in the upper right corner; the table stays where it is and it's scrollable. On mobile, maybe between the edited-sentence and flagged items and the table itself, but still visible at all times. Maybe the user should be able to hide it on mobile to save space; I'm not sure, it can be discussed later.

[01:37:52] nataliamotand: Okay, we can make this work. We don't have the mobile view just yet, but for future meetings I think we can bring it so you can check if everything is according to your wishes.

[01:38:18] nataliamotand: For now, what I will do is put the legend in the top right corner with some more description and adjust the scroll so that this box also has it. Those are the two things you mentioned. Is there anything else?

[01:38:35] Customer: No, I think that's it about the table.

[01:38:44] nataliamotand: Should we proceed to the other criteria? Okay, we can move forward. The final acceptance criterion is the delete button: when I delete a card, it is removed from the table and from the study, and the other cards don't change.

[01:39:00] nataliamotand: I just deleted the card for this word, and you can see it didn't move the other cards, and it doesn't appear anymore in the cards to be reviewed. That's the final acceptance criterion.

[01:39:24] Customer: Okay, I agree that it works. But I think there should be not only the delete button but also a hide or archive button, where you don't delete the card permanently, but just exclude it from reviews.

[01:39:45] nataliamotand: Okay. To confirm, for the delete button: when I click it, it should delete right away, without any confirmation notice. Is that okay?

[01:40:07] Customer: That's a good question. It depends on the scenario. Can there be a scenario where they want to delete multiple cards, and should this process be quick?

[01:40:34] Customer: Maybe they should be able to select a bunch of cards and then click delete, and then you can ask for a confirmation. So it will be quick selection plus a confirmation, and they don't delete each individual card.

[01:41:07] nataliamotand: Okay. And the second confirmation is about the hide button. If I delete, the card is excluded from history, from the deck, from study and review, everything. But if I hide, the card should still appear in the table with some visual identification that it's hidden, so it won't appear in the study decks. The only reason for the hide button is so that the card doesn't appear in the study deck, is that correct?

[01:41:37] Customer: Yes, that's correct. The card should still appear on your cards page. I think it should even appear at the same place where it was before being hidden.

[01:42:00] nataliamotand: Okay, this can be an eye icon, or something understandable.

[01:42:13] nataliamotand: Yes, it will not appear in the reviews. Oh, by the way, the user may want to learn cards in a specific order, so they should be able to order the cards. I'm not sure if we talked about that; I think we mentioned it but didn't go into much detail.

[01:42:42] nataliamotand: I know that it's important that we have some kind of reprioritization of the cards, but I'm not sure how it will be done, and whether automatically or manually. Maybe we can have a scroll here so we can change the order of the cards, because right now it's configured so that if I put a new card here, it shows up on top. That's the only prioritization that we have.

[01:43:19] nataliamotand: Do you think this table should be in the order that the cards will appear, or should this order and the reprioritization be done elsewhere?

[01:43:37] Customer: Just to confirm, is reprioritization recorded in your user stories?

[01:43:53] nataliamotand: I'm not sure if I put it in. I know that it's not in the three user stories that we built the MVP on, but I can take a look at the others.

[01:44:05] Customer: From what I see, it's not yet in the user stories. But it's mentioned in the decisions, if I'm not mistaken.

[01:44:14] nataliamotand: It's here, but this one specifically is not about the cards. There is a study queue, I believe I showed it to you in the last meeting, and this study queue is where you can choose which words you want to learn first, but they don't choose the words particularly; they choose from the text that the words were created from. Do you understand?

[01:44:48] nataliamotand: Maybe we can adjust that so that the reprioritization can be done on the word specifically and not just the text. This would be the user story that we would refine and change. What do you think the reprioritization should be?

[01:45:11] Customer: I'm not sure that the reprioritization should be so granular, at the word level, but I think it might be useful.

[01:45:25] Customer: How we can go about it: for each card we can store the origin, the text where it comes from, and then on the cards page you can select the text, and all cards created for the words from the text will be selected, and then you can move them at once, or unselect some of them and move them.

[01:46:24] Customer: Without selecting a text you should still be able to select some cards and move them to the top of the table. What goes at the top of the table is studied first.

[01:46:45] Customer: Maybe we can add a button in the table to show the reverse order of cards, but I'm not sure it's necessary for now. Let's keep the cards in the order in which they are studied, so the user can see in which order they study the cards. This corresponds to your study queue, as far as I understand.

[01:47:18] nataliamotand: Yes.

[01:47:18] Customer: In this case the user will be able to reorder that queue as they want; we're just adding helpers that help them identify cards belonging to a particular text.

[01:47:38] nataliamotand: Okay, I think that will be it.

[01:47:55] nataliamotand: We've gone through all the acceptance criteria in user story two. I was wondering if you accept or reject it, and if you have any other considerations.

[01:48:12] Customer: Let me check again. The problem is that it seems I didn't specify well in the assignment the process for dealing with user stories. Right now, when the user accepts the user story, you can close it. But if you dramatically change the UI of your product, should you reopen that user story and review the acceptance criteria? This is not specified, but it's enough to just specify that reopening a user story is okay.

[01:49:03] Customer: So if I approve all of the acceptance criteria for this current version, then it's fine; if you change something dramatically, you can reopen later and reconfirm.

[01:49:20] nataliamotand: Okay. Given the cards review table, when it is not studied, then I can check the sentence written for a word.

[01:49:35] Customer: Yeah, I think an archive button here is not necessary. So the card exists for each word.

[01:50:01] Customer: Yeah, so I think this user story can be considered as done, as completed as it is. Further user stories may specify other behaviors, and further acceptance criteria.

[01:50:19] nataliamotand: Okay. I was going to close this issue, but I'll read it again after the meeting and then close it. Thanks for accepting it.

[01:50:27] nataliamotand: We can move forward with the third user story. I hope there is no problem with my internet and you can hear me fine.

[01:50:41] Customer: Sure, you're fine.

[01:50:48] nataliamotand: Okay. The third story is "I study my cards inside the product". This one has four acceptance criteria. I'll delete some cards so that I have three, which is the scenario that we placed in the acceptance criteria. I will read to you what I have and show it in the product, and then we can verify it.

[01:51:21] nataliamotand: Acceptance criterion three says that I answer a due card as remembered, it does not come back in this session, and the product tells me its next date, which is after today.

[01:51:42] nataliamotand: For example, I started a new session, I have the sentence, and I can click "show the translation". If I select "remembered", this card will not come back in this session; it will be rescheduled for another session.

[01:52:11] nataliamotand: So you remember the word and it says the date that it will be shown again. This is acceptance criterion three. Is that okay? Do you have any considerations?

[01:52:27] Customer: Yes. In Anki there are four types of response, something like easy, medium, hard and again, which signal to the FSRS spaced repetition algorithm when to show the card next.

[01:52:54] Customer: For example, "again" shows the card in ten minutes, as far as I know, and this value is adjustable. "Easy" shows it in double the span of the previous one, or something like this.

[01:53:17] Customer: So there should be not two buttons but four buttons, like in Anki.

[01:53:28] Customer: And also the card should not look like this, I guess. Let's see how the card looks again. This is a study session and I see the front of the card, right?

[01:53:53] nataliamotand: Yes, this is the front. I think it's not very intuitive, because this text regarding the first card is appearing on the second card, so I'll do a more intuitive thing for this, so people understand what is appearing.

[01:54:17] nataliamotand: What is appearing right now is a new card, so the word is "gross". You have here how it's pronounced, the sentence, and this kind of orientation for the user, so they try to remember what it means. When you have your little moment to try to remember the word, you click the button "show translation", and you have the translation of the sentence specifically.

[01:54:49] nataliamotand: This is the back of the card, and the one I showed previously is the front.

[01:54:56] Customer: Got it. Does GitHub work for you? Maybe we can have a look at an example of a card in the proof of concept repository, songs2anki. Do you want me to open it?

[01:55:29] nataliamotand: Let me see if I have it, but I don't know if it's quick to access. I'm just opening Anki, so we can go through it. Just a second.

[01:55:37] nataliamotand: Let me re-share my screen. Do you see my screen?

[01:56:13] Customer: Yep. Oh, that's even better, you've got Anki itself. There is the German word at the top and then the sentence, and then when you click [inaudible].

[01:56:45] nataliamotand: It's in Portuguese, I'm sorry.

[01:56:50] Customer: I can't read Portuguese, sorry. Can you hear me?

[02:05:46] nataliamotand: Thank God. I don't know what happens, my laptop keeps disconnecting from the internet. I don't know why this happens, but sorry for the wait and thank you for your understanding.

[02:06:03] nataliamotand: I'll share the Anki screen again so you can tell me what you meant.

[02:06:13] Customer: Great, I see the screen. This is the front of the card, and this is the back.

[02:07:23] Customer: On the front, the user sees the German word, or the English word, it depends on the direction of the card, and then they see the sentence. They can listen to both the word and the sentence, and by default the sound of the sentence is played.

[02:07:59] Customer: At the bottom you can see four buttons in the middle: easy, medium, hard and again. I think these four buttons should be in the interface that we built. What do you think?

[02:08:28] nataliamotand: I think it's good. We're going to have to change the logic of the scheduler for the revision a bit, but I think it's adjustable and fits the users' needs better, so it's a good improvement for us to have in the first version of this module.

[02:08:54] nataliamotand: About the front and the back of the card: you said that you don't like the version we have right now. Did you mean that we should show them both at the same time, or was it something else?

[02:09:10] Customer: Not showing both at the same time. You should not show both at the same time; the whole purpose of the front and the back is that you don't see the answer. The first thing that you see is only the front.

[02:09:30] nataliamotand: When you click the button, should the back show only the back, or should we have a shared view between front and back when you click the button?

[02:09:48] Customer: I think they should see something like this. It provides a visual divide between back and front. You don't show the translation in the front; you don't show German and English in the same line, you show them separately, so that it's clear where the answer is and where the question is.

[02:10:34] Customer: And the audio should be playable for both sides.

[02:10:40] Customer: What I was a bit confused about in your interface are the hints for the user about what to do next. This interface assumes the user knows what they are doing: they can click some button at the bottom, or click a replay button, or click the spoiler button, the triangle, and see some information. In your interface you tell them what to do. Could you please show it?

[02:11:20] nataliamotand: Yes. Let me share again. Do you see my screen?

[02:11:28] Customer: Yes.

[02:11:45] nataliamotand: This is the front of the card, and I think how we have it right now is pretty intuitive and also orients the user: there is only one button to click on the front of the card, and when you are on the back, you have an answer and two options, you either remember what the word means or you don't know.

[02:12:12] nataliamotand: The only thing that isn't specifically explained to the user is what happens if you click "remembered" or "forgotten". In Anki we have the time stated on each of the buttons, to show when the card will appear again. We don't have that here.

[02:12:38] Customer: Yes, that's a good point. If you switch to the Anki screen, there are explicit buttons, and you can also show the scheduler's forecast about when the card will be shown next.

[02:13:03] Customer: Also, in Anki there is a translation of the word specifically, not only of the sentence. Maybe it can also be shown somewhere here.

[02:13:18] Customer: You mentioned something about the first word on the card. Here it is "garden": does it show how the word is pronounced, or is it just the word?

[02:13:53] nataliamotand: It's only the word, my mistake. It's just that on the other card it was different; I'm not quite sure why, but I'll check that and make sure it's fixed by the next meeting.

[02:14:08] nataliamotand: It's not the pronunciation, I think, mainly because we're going to have a user story that adds the audio to each card. Maybe it's good because the person can read the pronunciation and try to guess what it says, but I think there's no point, since there will be an audio that the user can listen to anyway. What's your opinion on this?

[02:14:36] Customer: My opinion is that the sound is enough, and the person does not need the pronunciation written using symbols. But they should have buttons here to play the word and the sentence.

[02:15:20] Customer: Also, for German it's important how words are written. For example, nouns are capitalized wherever they appear and other words are not, except for names. So here you should not capitalize all the letters of a word; you should give it with the same capitalization as it appears on the deck page, basically.

[02:15:54] nataliamotand: You can correct me if I'm mistaken, and please do, but I thought that nouns in German have capital letters, like "Garten" and "Haus", and since adjectives like "schön" are not nouns, they don't. Do you think there's a mistake here? Maybe we should explicitly tell the LLM which words should be capitalized.

[02:16:22] Customer: No, I meant the "garden" above the sentence, it's in all capital letters.

[02:16:33] nataliamotand: Ah, okay, I got it. But if the word were shown, then it would not be all in capital letters; it should have been in lowercase.

[02:16:54] nataliamotand: Yes. So "forgotten", "gross", it comes back. After you mentioned that this will be more intuitive, that will probably be gone.

[02:17:06] Customer: Could you please show the front of the card again?

[02:17:11] nataliamotand: Of course. This is the front.

[02:17:14] Customer: Do you think this instruction about showing the translation is really necessary? Aren't the buttons self-obvious?

[02:17:31] nataliamotand: Yes, you have a point. Then it can be removed.

[02:17:52] Customer: It's nice that you highlight the word in the sentence. Maybe for nouns in German it might be tricky because we have articles there, and words can fuse with prepositions, like "in dem" becoming "im", and I'm not sure what to do in this case. Maybe it's enough to highlight just the word itself, without any articles.

[02:18:26] Customer: Let's decide on this right now. What about phrases? What if the person wants to learn a phrase? Should we let them do that, or should we only let them learn single words?

[02:19:00] nataliamotand: My opinion on this is that it's not that we don't let the user learn the full sentence; it's that each card focuses on a specific word. Maybe if the user doesn't know what "Zimmer" means, they can have a card specifically for that, but we make sure that each card focuses only on one word, and the sentences help as a kind of support. Maybe if the person doesn't know what "gross" is, they might remember what "Zimmer" is and get it from the context.

[02:19:43] nataliamotand: That's my main take on this, but you don't have to give me your opinion, or you can tell me if it is really important that a card is able to focus on the whole sentence instead of just one word.

[02:20:04] Customer: As it is now, we support a workaround for learning phrases instead of words: we can let the user pick a word from that phrase, then edit the sentence and the translation we generate for them, and then on the card they can learn exactly that phrase.

[02:20:39] nataliamotand: Yes, because the whole product now is built on top of words, so the cards are mainly focused on one word. If we changed it to sentences, we would have to redo the logic of the application, and I'm not sure which logic suits the users' needs best. That's my main concern.

[02:21:06] nataliamotand: We can think more about this and try to decide the focus of the application: whether we keep it as it is, or adjust it to include sentences. Either way, the translation shows the translation of the whole sentence.

[02:21:29] nataliamotand: I guess the focus of the card is mainly on one word, but you can still grasp other vocabulary from it.

[02:21:39] Customer: Right.

[02:21:51] Customer: But in this workaround, only one word will be highlighted, the one that they intend to learn, so it will really look like a workaround, not some native functionality.

[02:22:15] Customer: I wonder what would be affected if we allowed learning combinations of words, not whole sentences probably, but idioms, or words that are composed of two words, and maybe some names. I think not much changes, really. The highlighting should span the whole phrase instead of a single word, but everything else stays the same: we show something above the sentence, the sentence itself, the translations and so on.

[02:23:08] Customer: For the logic, if we use identifiers for cards, unique identifiers, the logic still holds. If we allow not a single word but, for example, two or three words as one part of the identifier, we can still get the meaning of that idiom or combination of words, and so we can still get the same kind of unique identifier. So it seems like it will not be broken.

[02:24:02] Customer: Why did I bring it up? German nouns are usually studied together with their articles, and so we should support not only the noun but also its article.

[02:24:30] Customer: Could you please go to the page where there is a text and the table with cards?

[02:24:43] Customer: Yep. So here the word is not "garden" but "der Garten": first goes the article, then "Garten" capitalized, so two words. And if there are more than two words, like three or four words, it seems like it will still work. What do you think?

[02:25:09] nataliamotand: I think it's good, but this only happens on nouns, right? We can implement a rule that every time the selected word is a noun, it has to have an article as part of it.

[02:25:33] nataliamotand: I think it's important because it's a specific German-learning thing, and I think it's necessary that we add it. I tried learning German for a while, but I'm not entirely sure, so I just want to confirm with you that only nouns have articles, and no other grammatical category does. Right?

[02:26:10] Customer: Yes. All other words just surround nouns. Other words can appear between an article and the noun, like adjectives, but they don't have their own articles.

[02:26:38] nataliamotand: Okay, so I guess that's a good thing that you mentioned, and we can adjust it.

[02:26:48] Customer: Great. I recalled another complication that this will introduce. If you scroll to the top of the page, to the text, ah, okay.

[02:27:00] Customer: If we had a text and the user wanted to learn not a single word but several consecutive words, this is one of two cases in which we can get a card that has more than one word in it.

[02:27:38] Customer: For a noun there will be two words, maybe we get the article from somewhere, like I did in my proof of concept, but in the text only a single word is selected. Or the user has edited the card, added some more words in the word column, and this is the way they got more than one word there.

[02:28:15] Customer: Letting them select several words in a text as a single word, or word combination rather, is the second way they can get more than one word in the word column.

[02:28:41] Customer: This is how we solved it with another team last year. They suggested that when the user selects a word in the text, they get suggestions about what they actually want to select: this word, or this word with some surrounding words.

[02:29:12] Customer: The suggestions were based on the structure of the sentence. Basically the sentence was parsed into a tree of interconnected structures; for example, there was a node that combined the article and the noun, even if something appeared between the article and the noun. For example, in "the long bus" in English, "the" is the article, "long" is an adjective, "bus" is a noun, so the user could select "the bus" without "long".

[02:30:11] Customer: The technical complexity was that it had to be performed using Python and some natural language processing, but it was doable. I'm not sure if we should do this in this case, but I think we should somehow let the user select several words for a card.

[02:30:37] nataliamotand: I might have a few ideas about this. I need to sit and try to do it, because I haven't done that much work on it yet. Right now we can select, and they have these kinds of divisions, but maybe if we could hold the button and move it through the words, it would save them as one phrase and show a visualization of them together, and we could unmark an adjective, or the word in the middle, with the right mouse button, and have a different display for that. I don't know if that's doable, but I'll take a look and get back to you at the next meeting, and hopefully it will work.

[02:31:44] nataliamotand: I get the idea of what you meant, and I'll do my best to integrate it into our application. I guess that's it.

[02:31:52] Customer: Great. I can suggest an approach that I think the other team came up with. It might be selection with another mouse button, or holding a key on the keyboard and then selecting words, so there should be a way to signal to the service that you select these words together.

[02:32:36] Customer: After you have selected these words, you can show the connections between them, like maybe some arcs between these words, but then you will introduce quite a lot of noise into the text view. The arcs may overlap, or they will take lots of space, or if the words are not on the same line, then you will have to draw very long arcs, which will not be very convenient.

[02:33:17] Customer: Another approach is to just show, after selection and on hover, which combination of words was actually selected. So you don't always show it, you show it on demand. For example, you selected "one and a half", then "two", and you hover "one and a half", and the tooltip shows "one and a half then two". What do you think about this approach?

[02:33:54] nataliamotand: I think it's a good approach. It's another option we can try next week. I'll do these two tests, because visualization is the main point here.

[02:34:15] nataliamotand: I also have a question. I was wondering if we can communicate outside the client meetings, maybe in the group chat, for me to show you different options for the application and you can decide on them, or should we just keep decisions to the meetings?

[02:34:43] Customer: Decisions can be made anywhere, but they usually should be recorded. This is the main requirement about decisions. If you think you will get enough feedback in the chat, then okay, we can discuss some things there. If you feel that you need another meeting, you can either wait for the sprint review meeting or schedule another meeting, if more thorough feedback is needed. But otherwise I feel comfortable answering in the chat if you send something there.

[02:35:37] nataliamotand: Okay, sure, thanks. I'll try both of these options next week and show you. Since the visualization is the main point here, I was thinking about taking screenshots of both options and asking which one you would prefer, or if the option we choose to go forward with is okay visually for the user. So I guess it's okay.

[02:36:12] Customer: Great. Well, such a long meeting.

[02:36:25] nataliamotand: Okay, and I think we have one user story to review, from the final acceptance criteria. Do you want to end the meeting here, or maybe I should go...

[02:36:45] Customer: No, no, let's finish it. I mean, let's complete what you planned, and then finish it. I was just complaining, sorry.

[02:37:01] nataliamotand: No problem. I'm sorry that the meeting has to be done on a Saturday. I'll make sure I do my best so that doesn't happen again, and I understand that's a lot of time I'm taking from you on a Saturday, but thanks for staying either way. I'll go as quickly as I can.

[02:37:23] nataliamotand: The first acceptance criterion that I mentioned is that if you click that the card is remembered, it doesn't come back in this session and it shows the date when it will come back again. So that's done.

[02:37:54] nataliamotand: The third acceptance criterion is that when I have cards and some of them are due today, if I start a new session, only the ones that are due today will be shown. In the beginning we had three cards left, and one of them we said we remembered, so I could show you the previous acceptance criterion. As you can see, if I load the page again it doesn't show; it doesn't come back on the same date that it said it was remembered, so we only have two cards left in the session.

[02:38:32] nataliamotand: Finally, acceptance criterion two is that a card that I answer as forgotten comes back later in the same session. If I say that I forgot, here you can see that when I go to the other card that we had, it comes back. So in the same session, if I forget, it comes back.

[02:39:09] nataliamotand: And acceptance criterion four is that when no cards are due today or earlier, the product says that nothing is due. If I remember both cards and try to start another session, I don't have cards left that I need to review, so it says that there is no option to start a new session because no cards are due today.

[02:39:42] Customer: Yes, this was a problem in Anki for me. When I wanted to review the cards but I didn't have any cards scheduled for today, due to the scheduler, but I still had some time to review, I couldn't force it to give me more cards. I think we should have a way to request more cards, even if you will review them ahead of the schedule.

[02:40:25] Customer: That is one thing. Another thing is that there should be limits on how many cards you review today, per session or per day. It is the same in Anki: there is a review session, but the limits are set per day, I guess. You can work on this session the whole day, therefore it doesn't make sense to set separate limits. You set limits for a day; therefore, if you want to learn more cards during the day, then you need to increase the limit of cards that you can learn.

[02:41:46] Customer: But if zero new cards exist and only cards to review exist, you have to increase the limit on the number of cards to review. And if all of these cards to review are scheduled for another day, then there is no way to review cards today, and this was quite inconvenient.

[02:42:13] Customer: So there should be settings for the limit of cards to review today, for a day, and for the number of new cards that are suggested, and also there should be a way to request cards to review ahead of the schedule.

[02:42:48] Customer: On the review screen where you show a card, I think there were some statistics about how many cards are left for the session, right?

[02:43:00] nataliamotand: Yes. They are not going to show now because we don't have any cards left, but when we do, it shows, when you click to start a session, the number of cards you have to review, instead of this warning sign.

[02:43:25] Customer: Right. Could you switch to Anki right now? There are three numbers that are shown.

[02:43:37] nataliamotand: Let me share it. Okay. Even here you can see three numbers: "Novo", "Aprender", "Revisar". Sorry for my accent.

[02:44:21] Customer: No, it's perfect, thank you.

[02:44:34] nataliamotand: So "novo", I guess it's new cards, that's 20 new cards for today. "Aprender", I don't know, it's like learning, so I guess that's ten cards that I haven't seen yet and I have to see them. "Aprender" is learning. And "revisar", I guess, is review.

[02:45:11] Customer: Yes. Okay, "learning" cards are new cards, or cards to review, that you found difficult today. You saw a new card, you marked it as hard or again, and it goes to learning. Then it's shown again, and you review it in this session, and you review until all of these numbers are zero, basically.

[02:45:49] Customer: So I think we should also use this approach, where there are three classes of cards: something really new, something that you learned previously, and something that you found difficult to learn today, something that you still need to learn today.

[02:46:15] Customer: All right. And here you can see there are several decks. I don't quite remember what you showed in the first meeting, except for that table with the cards. Did you show the decks?

[02:46:37] nataliamotand: No, this page with the different decks doesn't exist yet. The only two things I showed you in the previous meeting were that table with the words and the editing and flagging buttons, and the second thing was the study queue, to define the order in which the texts would be studied. So I don't think I showed you anything about the different decks.

[02:47:09] Customer: Okay. I think a person may learn several languages at once, and so they need some way to separate their cards. Therefore they need decks.

[02:47:28] Customer: Another team asked me how decks are related to texts, and for now we decided that texts are separate from decks. But you can assign a card to several decks.

[02:48:08] nataliamotand: I think we can define the deck based on these two selects, based on the pair of languages that we choose. It creates or assigns words to a specific deck, since we can only choose one combination per text, so they would be automatically assigned to a deck. Do you understand the idea? Is it a good solution to the problem?

[02:48:39] Customer: It's a viable solution, but I think it's a bit constraining. If a person wants to learn particular topics, then they would probably prefer to have separate decks, even though they have the same combination of languages. The decks should be separate.

[02:49:22] Customer: They may combine several texts that they choose words from for a deck, so there should be no limit on the number of texts used to form a deck.

[02:49:46] Customer: The approach that I considered with another team... is it okay that I mention what I considered with another team?

[02:49:53] nataliamotand: Yeah, of course.

[02:50:05] Customer: Okay. Several texts can be used to generate cards for a particular topic, and a card may appear in several decks, and its progress should be preserved across all those decks. We know that the card has a unique identifier, the word and the meaning, so it's easy to preserve the progress of a card across the decks.

[02:50:51] Customer: But the tricky part is how to relate texts to decks. Right now we consider this option: after the card is generated from a text, it forgets about the text and only keeps what's relevant from the text, namely the sentence where it comes from. In our case it might be useful to remember the sentence too. But we also have collapsed the context into a single meaning for the unique identifier.

[02:51:40] Customer: After that, the text can be freely removed, replaced or edited, so the card forgets its original text; it only remembers the relevant part of the text and is disconnected from the text. After that, the card can belong to multiple decks, and you don't need to relate texts to decks anymore. You just create a card and then put it into the decks where you want it to be.

[02:52:12] nataliamotand: Okay. Do you want this assignment to a deck to be made by each word specifically, or for the whole text? When I click "ask for sentences", all words that I put here would be assigned to one or more specific decks. If that's the case, I could have a multi-select option here in the first box that allows the user to choose from different decks the ones they would like to add all of these words to. Is that the idea?

[02:53:03] Customer: Yes, that's the idea. The languages are just settings for the LLM, so that it knows in which language to produce the sentences. They can also be meta information for the decks.

[02:53:31] Customer: By the way, they can be used for filtering the decks where you can add the cards. If you specify that the deck is for English and German, and here you select Russian and German, then you won't show such a deck in this multi-select. In this multi-select you would have multiple decks.

[02:54:08] Customer: So, text language, your first language. Maybe this pair of languages should be disconnected from the text. Let me think a bit.

[02:54:59] Customer: Should you specify the languages before you input the text, or should you specify the languages near "ask for sentences", somewhere below the text?

[02:55:11] nataliamotand: I think it's independent right now. As you said, this is only for the LLM to know which language the text is in. So I guess the order of the steps doesn't matter so much, since the user will fill in all of the information in these first blocks. I'm not sure the order in which they appear matters so much.

[02:55:50] Customer: Right, okay, those are just settings.

[02:56:02] Customer: Your text: there can be multiple texts to generate cards from. They should be stored somewhere. There should be a list of texts, like a gallery, where you can select which one to generate sentences for.

[02:56:33] nataliamotand: I think we can keep this interface that you presented, for a single text.

[02:56:48] Customer: Yes. Just, for each text, you will be able to generate sentences again. Maybe after generating, should you be able to generate sentences for another language when you use this text? If you use this text to generate German and English cards, you should be able to use this same text to generate German and Russian cards.

[02:57:37] nataliamotand: Maybe yes, but then you should show another view of cards. For each combination of languages you should show their own view of cards, their own table. For Russian-English, this table should not be used, but an empty one.

[02:58:18] Customer: Yeah, and you should also show in the multi-select the decks that are compatible with this pair of languages.

[02:58:26] nataliamotand: Just to make sure I understand: your cards table should be related to the combination of both of these selects plus the decks? Or just the languages?

[02:58:46] Customer: Just the languages. This table depends on the text and the languages selected for this text.

[02:58:55] nataliamotand: Okay, yeah, something like this.

[02:59:09] Customer: And for a card, you should be able to assign it to several decks. I'm not sure if we discussed that, but yes. And if a card was assigned to a deck that does not satisfy this combination, for example Russian-English or German-English, then it's not shown in this table, because it does not belong to this table; it becomes like a separate card.

[02:59:47] Customer: Oh no, I think I said the wrong thing. If you have a card that was generated for a German-English deck, then it can only be added to other German-English decks. It cannot be added to a Russian-English deck, for example.

[03:00:27] Customer: So basically the idea is that you can add cards to multiple decks, but all of them must be compatible with each other with respect to the pair of languages.

[03:00:41] nataliamotand: Okay, I understood that. That's okay. I think we can work out logic that satisfies that.

[03:00:56] nataliamotand: I guess that's it for the user stories; we went through all of them. I have a few follow-up questions. I wanted to ask really quickly about the orientation of the project for the next few weeks.

[03:01:15] nataliamotand: I can read the questions to you, I think it will be better. About the next stories, I was wondering which one we should build first: user story four, which is about moving a text to the front of the study queue, or user story seven, which implements audio for each card, or user story five, the teacher view, which lets a teacher correct the student's sentences. So basically the options are four, five or maybe seven.

[03:02:00] Customer: I would order them as four, seven, and then five, because the teacher requires accounts and can be postponed and implemented later.

[03:02:20] Customer: Regarding four, I guess we discussed that: you don't move the words of the text by moving the text somewhere, but you can pick a text, and then words from the text will be selected, and then you can do something with these words.

[03:02:53] Customer: And user story six can even come after user story five.

[03:03:10] nataliamotand: Okay. From what I'm reading in the script, that's all we had to discuss today.

[03:03:20] nataliamotand: Just to make sure that we have a full vision of the product we have right now: all three stories are built, so no stories leave the candidate we have right now, unless you say so. And with these three stories, in your opinion, can a learner go from introducing a text to studying the cards that come from it without getting stuck in any part of the process? And if not, where do you think they would most likely get stuck?

[03:03:56] Customer: I think they don't get stuck in this process, unless they choose the Russian-English pair of languages, for example, and, as you mentioned, they receive only blank sentences. But for German and English it worked okay. You demonstrated how to input a text, select the words, generate cards for them, edit them, and then review. So I think the core task is completed.

[03:04:51] Customer: The three user stories are covered as far as it goes with respect to the acceptance criteria. Maybe something should be adjusted, as mentioned before already, but overall they are completed, and you can complete the core task without getting frustrated.

[03:05:16] nataliamotand: Okay. There's also another thing that I'm supposed to show you to wrap up the meeting. It's about the study queue that I mentioned at the beginning of the meeting. I made an example here, but I'm not sure if we should go through it right now or present it at the next meeting. Since we are doing the user stories next, I could bring you an example to see if you agree with it and maybe change it if you don't, or we could discuss this example now, so you tell me what you want from the study queue.

[03:06:10] nataliamotand: We are not in the time box of the meeting anymore, so I don't need your opinion right now. I can also share it with you, and you can read it offline and share your opinion about this example, if that's okay. I don't know which one you would prefer.

[03:06:44] Customer: I think I would prefer to discuss it now, if you are okay with that. It's fine by me.

[03:06:55] nataliamotand: Okay, so we can move forward with it. You can see my screen, right? The GitHub study queue example. This is an example for the study queue I showed you as a Week 2 action point. It is a made-up example, so it's not data from an actual learner.

[03:07:14] nataliamotand: In this scenario, the learner has three texts, A, B and C, and today the queue is A1, A2, B1, B2, C1, C2, C3, as you can see here. If the learner wants to study text C first, while the words are fresh, there are two readings of how we can move this text C to the front.

[03:07:44] nataliamotand: The first reading is that every card of C moves, including C3, which is already studied, and the queue becomes as stated here. The second reading is that only the new cards from C move, so C becomes C1 and C2, which are not reviewed yet, and C3, which is already studied, stays at the bottom of the queue. What's your vision on that? And if you have any other considerations about the queue, feel free to share them with me.

[03:08:29] Customer: Yes. Okay, that's a bit tricky. The study queue is a table, and what we discussed before was that this table can be reordered. It should be possible to select all cards belonging to a text and reorder them.

[03:09:11] Customer: But we also discussed that texts might probably be deleted. Maybe we should not delete texts, so that we can reorder the queue.

[03:09:29] Customer: And also, "every card of C moves": as we discussed before, it's not necessary that every card moves, only the cards that the user wants to move in the study queue.

[03:09:56] Customer: I mentioned that the higher the cards are in that table, the closer to the top of the table, the sooner they will be learned. That was my assumption. But then I recollected that each card has a separate progress, and so cards that are due earlier might be lower in the table than cards that are due later or that are completely new. So how do we signal to the scheduler that it should not take cards that are due earlier, because there are cards that are higher in the study queue? I'm not sure if I formulated the question clearly.

[03:11:04] nataliamotand: Could you please explain what you understood? Could you repeat the question again, the last part of it?

[03:11:13] Customer: Sure. Let me ask the first question: what does the study queue mean? The order of cards, what does it mean?

[03:11:24] nataliamotand: The thing that you mentioned is the prioritization of the cards. You said that the higher the cards are in the table, the earlier they will be learned. So when you start a new session, you learn card one, then two, then three, four, and so on.

[03:11:47] Customer: Okay. In your table we have card B2, for example, and we move it before A2, and the limit of cards for today is only two. Then today you learn only A1 and B2, but don't learn A2. Is that right?

[03:12:48] nataliamotand: If a card is due today, independently of the order they're in, you will learn it in the study session. We haven't limited the number of cards that you have to learn today, but since it's an option you brought up, maybe we should think about that. Or maybe the exception to the rule of the maximum number of cards you can learn in a day is cards that were never studied before: if you create the cards, they are studied today.

[03:13:27] nataliamotand: So I guess we can make an exception to the rule of the maximum number of cards you can review in a day, and this way you would not have the problem that if B2 was in the fourth position, it wouldn't be studied. I guess we can introduce this new rule.

[03:13:52] nataliamotand: The main thing we need to decide here are the rules that the prioritization will work on. Is it more important that you study a new card, as in this example, so we would have an exception, or is it best for the user to reprioritize based on which text they want to learn first? That's the main point we have to decide today: what's most important to you, when the card was last reviewed, or which text it belongs to?

[03:14:30] Customer: Yes, that's the right question. I think we should not look at when the card was last reviewed, but rather prioritize by default the cards by when they are due next. Cards that are due sooner, earlier, will go higher in the table.

[03:15:07] Customer: After that we should think about moving the cards inside the queue, based on the text they come from, or any other approach.

[03:15:21] Customer: In the queue I assume we can select an arbitrary subset of cards and then move them together, drag and move this group higher in the table or lower in the table, and in that group the cards will be placed consecutively, one after another. They may initially be in random parts of the table, but after moving them they go consecutively, one after the other.

[03:16:09] Customer: I'm not sure if it's possible in Excel: you select several rows and then drag one of them, and then all of the rows are moved. Do they become consecutive, or do they stay with offsets between them?

[03:16:30] nataliamotand: I'm not sure I'm right about Excel. You can drag the lines, but only if there is space available in the place you want to drag them to. If there's no space available, the option it gives you is to replace the lines. So I guess it is consecutive: if you drag, you kind of put them all together and delete the lines that were beyond, but you can also add new lines and just push everything downwards.

[03:17:10] Customer: All right, yeah, I was just trying to find an analogy to describe the interface. Maybe I should return to this table. I select B1 and B3 and then drag B3 below C1, for example. Then I will get C1, B1, B3. B1 and B3 were not consecutive before, but now they are consecutive, below C1.

[03:17:47] Customer: This dragging should not break the prioritization, the sorting invariant, that cards are sorted by the time when they are due. Therefore I guess we should make B1 and B3 due after C1 but before C2, so we should choose such a moment, maybe a middle one, and assign B1 and B3 this moment, so we override their due time, so that the sorting invariant stays the same.

[03:19:00] Customer: We could have chosen cards from different texts, B2 and C1 for example, and moved them below C2, and then their due time would also be overridden. What do you think about this approach? It's a little bit more complex.

[03:19:31] nataliamotand: I just want to make sure what's more important to you. It's more important to have the due date on which the cards should be reviewed, but you also want to break the rule in case you want to manually drag the cards in the table. Is that it?

[03:19:56] Customer: Yes, I don't know if I understood it correctly. Basically my initial need was to learn cards depending on the order of texts, but now I see that I might want to learn some words from one text and some words from another one earlier. Therefore I need to be able to freely move cards, to reschedule them.

[03:20:27] Customer: Selecting all cards that belong to a single text lets me select the cards that I want from this text. Selecting all cards, or some cards, from another text lets me select cards from that text. And so I can drag them together to where I want them to be studied in today's queue.

[03:20:58] Customer: But the queue is prioritized based on the due date. Therefore, to keep this prioritization but still have cards at the position where I want them to be, I need to change their due date so that they are allowed to stay in that position. What I suggest is to choose such a due date, or such a due time rather, which allows them to stay in that position.

[03:21:38] nataliamotand: Ah, okay, so that makes more sense to me. If you want, you should be able to manually change the queue time. The table has to have a clear priority about how to order it, either ascending or descending, so if we follow this main guideline, the option that you gave is the best one.

[03:22:10] nataliamotand: I think it should be possible to manually move cards depending on the text, but with this constraint: if you move them, you have to change the due date so that the table always follows the same rule of ordering. You know what I mean?

[03:22:30] Customer: Yeah, that's right, that's what I meant.

[03:22:38] nataliamotand: I guess that's a perfect solution, and we can implement it and see if it works for your objectives.

[03:22:47] Customer: So yes, we can do this. That answers the question.

[03:22:59] nataliamotand: Great, thank you for bringing this up.

[03:23:03] nataliamotand: What else is there to clarify? I took three hours of your Saturday, and I am officially finishing the meeting for today. I went through everything we had planned for the meeting, and I'd like to thank you for giving me your opinion on multiple different visions for the project.

[03:23:43] nataliamotand: Since we got so many adjustments to make, I will consolidate them in a message and send it to you, so you can just give an okay on everything and make sure I got everything right. I'm not sure that I'll be able to turn in assignment three on schedule this afternoon, but surely by tomorrow it will be in. [inaudible]

[03:24:19] Customer: Yes, officially, yes.

[03:24:31] nataliamotand: Okay. I'll send you the action points from this meeting, and thanks again for all the patience and the time dedicated to this.

[03:24:47] Customer: Thank you too for working on this project and immersing yourself so deeply in the development. You are very attentive to details, and I value that. Thank you.

[03:25:07] nataliamotand: Thanks, and thank you for your patience.

[03:25:12] Customer: Good luck with the assignment. Have a nice weekend.

[03:25:14] nataliamotand: You too, have a great Sunday. We'll be in touch. See you, goodbye.
