# Week 3 validation meeting transcript

- **Date:** 2026-10-17
- **Participants:** nataliamotand, AbdelrahmanAbdel-Aal, emapfff, Customer

The permission questions were asked before the recording started, so they are not on it; the Customer permitted recording the meeting and publishing a sanitized transcript.
emapfff attended as the observer and did not speak.
The call dropped twice for nataliamotand, around 01:07:30 and from about 01:57:00 to 02:05:40; nothing was said in those gaps.
The transcript was produced with AI speech recognition and speaker separation from the recording, and then cleaned for readability; nobody has listened to the whole recording again, and words that could not be recovered are marked `[inaudible]` (see `ai-usage.md`).
Each line carries the start time of the turn it belongs to.

[00:00:03] nataliamotand: Okay, so I'm going to go through the action points we decided in Week 2.

[00:00:03] nataliamotand: We carried out three of them, so we updated the context diagram.

[00:00:03] nataliamotand: I'll share my screen so you can see it.

[00:00:34] nataliamotand: Can you see the screen?

[00:00:39] Customer: Sorry, I had trouble with my internet connection.

[00:00:39] Customer: I reconnected now.

[00:00:44] nataliamotand: Okay, no problem, I can wait.

[00:00:50] Customer: Okay, I think we can proceed, I reconnected.

[00:00:50] Customer: I see the screen.

[00:00:59] nataliamotand: So this is the context diagram that we updated.

[00:00:59] nataliamotand: Last week we didn't have the audio source here, and we added it as we said we would.

[00:00:59] nataliamotand: As you can see, below the product we now have the audio source.

[00:00:59] nataliamotand: The external system is not chosen yet.

[00:00:59] nataliamotand: We also prepared an example of the study queue, which we will show later in the meeting; that was the other action point.

[00:00:59] nataliamotand: About the third action point, the Anki "Reposition" measurement: AbdelrahmanAbdel-Aal finished it just before this meeting.

[00:00:59] nataliamotand: If you read the script, you saw that when I wrote it, it was not done yet, but I'll add it to the meeting report after we finish here.

[00:00:59] nataliamotand: The result was almost 21 seconds for the repositioning.

[00:00:59] nataliamotand: The first time we timed it, it was about 55 seconds to create the cards.

[00:00:59] nataliamotand: And we did the run with the same cards we used.

[00:00:59] nataliamotand: The fourth action point from the previous week we did not carry out for this meeting, and we'll carry it forward.

[00:00:59] nataliamotand: That is, we haven't decided yet where the audio will come from, and this action point will come back next week.

[00:00:59] nataliamotand: Last meeting you told us that the product should be self-hosted, so that no data is sent anywhere.

[00:00:59] nataliamotand: The audio raises the same question.

[00:00:59] nataliamotand: I was wondering, since the audio has to come from an outside source: is it okay if it comes from an online service, or must it run on the learner's own machine?

[00:00:59] nataliamotand: Do you have an answer for that?

[00:02:57] Customer: Yes.

[00:02:57] Customer: It may come from any source, be it a self-hosted text-to-speech model or an online service.

[00:02:57] Customer: Anyway, it's outside of the application.

[00:02:57] Customer: The application should just be configured to connect to that source and request audio for a sentence or for a word.

[00:03:44] nataliamotand: Okay, thanks for the answer.

[00:03:44] nataliamotand: We'll put this as a decision for the project.

[00:03:44] nataliamotand: I think we can move forward with the first story from last week.

[00:03:44] nataliamotand: User story one was "I get a sentence and a translation for each word I mark in a text", and I will show its three acceptance criteria one at a time.

[00:03:44] nataliamotand: So this is the initial view of the product.

[00:03:44] nataliamotand: Here we can select the language of the text.

[00:03:44] nataliamotand: I don't know if you saw it, but the application doesn't allow the input language to be the same as the language of the translation, so it's blocked here.

[00:04:42] Customer: Yeah, I see.

[00:04:44] nataliamotand: So this is the text that I used to test.

[00:04:44] nataliamotand: As soon as we paste the text here, we have an option to mark the words that we do not know.

[00:05:01] Customer: Okay, how do you mark them?

[00:05:06] nataliamotand: You can just select them here.

[00:05:13] nataliamotand: But first I'd like to show you what happens if we don't mark any word and ask for sentences.

[00:05:13] nataliamotand: We are notified that no words are selected, so the language model is not called to make any translations.

[00:05:13] nataliamotand: The application only lets us move forward if we have selected words.

[00:05:38] nataliamotand: So I'll click [inaudible] and a few others.

[00:05:38] nataliamotand: I won't say the words in German because my German is not so good, but I'll take a few as examples and ask for sentences.

[00:05:38] nataliamotand: Here we have a notification that the sentences are being worked on.

[00:05:59] Customer: Why did you decide to use such red colors?

[00:05:59] Customer: They're a little associated with errors.

[00:06:16] nataliamotand: I thought so too.

[00:06:16] nataliamotand: I tested a few options, such as purple, yellow and green, and I also tried some combinations of them.

[00:06:16] nataliamotand: I chose red mainly because I wanted a single color, so that the application has a unique visual identity, but the color is changeable, and we can also use different ones for checks that are successful or for errors.

[00:06:16] nataliamotand: You are free to say what feels best for you, and I understand why red might feel like an error color.

[00:06:16] nataliamotand: It's good that you brought this up, because it's important for us that you share your opinion about the website.

[00:07:13] Customer: Right now I can't suggest a color that fits best.

[00:07:13] Customer: Maybe your choice was also influenced by the dark theme that you used.

[00:07:13] Customer: The background is dark, and maybe only such a reddish color had enough contrast on it.

[00:07:13] Customer: Was this a consideration?

[00:07:44] nataliamotand: Yes, it was important for me that it had good contrast and followed UX and UI principles, and I think if we check the contrast, it will be okay.

[00:07:44] nataliamotand: But you are right that it might not be the best option, because they are both dark colors.

[00:07:44] nataliamotand: So maybe we could try something a little different for the application.

[00:07:44] nataliamotand: I'll take this into consideration and come up with a few options, so you can choose one in the next meeting.

[00:07:44] nataliamotand: Is that okay with you?

[00:08:29] Customer: Yeah, sure, thank you.

[00:08:34] Customer: Let's proceed then; so there are some cards.

[00:08:42] nataliamotand: Yes, we have some cards, and I'll talk about acceptance criterion three, which is when the model does not answer.

[00:08:42] nataliamotand: It didn't happen here: all the words that we selected have their own sentences.

[00:08:42] nataliamotand: But when I was trying with Russian earlier, the language model didn't respond right away for one of the words I selected.

[00:08:42] nataliamotand: What happened was that the card for that word was created, but neither the sentence nor the translation appeared.

[00:08:42] nataliamotand: So there was a card with no sentence and no translation, only the buttons.

[00:08:42] nataliamotand: What the acceptance criterion says is that you are notified that the language model may have a problem responding, and after a few seconds you can click the "New sentence" button to ask again for a sentence and its translation, and it will work; at least that is what happens for me.

[00:08:42] nataliamotand: I can also show you in the terminal, it might just take a while, but I don't know if the intention in this meeting is that you see my VS Code.

[00:08:42] nataliamotand: So I was wondering if this is what you would expect to happen in this scenario specifically.

[00:08:42] nataliamotand: If you didn't understand what I meant, I can rephrase it.

[00:10:28] Customer: To me it also happened that some words didn't receive sentences.

[00:10:28] Customer: To be fair, the language model always generated a sentence for a card, but that sentence might not satisfy the criteria that I set, so such a sentence could be wiped out and regenerated.

[00:10:28] Customer: If the language model that you use does not produce a valid sentence, then a request should be issued automatically to ask for another sentence.

[00:10:28] Customer: If you notice that the language model consistently can't produce a sentence for a word, then you can set a limit on the number of attempts to generate a sentence.

[00:10:28] Customer: These attempts should be made automatically until you either get a valid sentence or the problematic responses keep arriving.

[00:12:12] nataliamotand: Let me make sure I understood.

[00:12:12] nataliamotand: If the user clicks "Ask for sentences" and the card is created without a sentence, the user should not have to click "New sentence": the request to the language model should happen automatically, without any other user input, right?

[00:12:43] Customer: Yeah, this is correct.

[00:12:48] Customer: My other comment is that it may take an indefinite number of attempts to generate a sentence, so you probably need to limit the number of attempts, so that the user does not wait indefinitely.

[00:13:08] nataliamotand: Okay.

[00:13:08] nataliamotand: In that case, if we reach the limit and the sentence still cannot be generated, should we not create the card at all and notify the user?

[00:13:08] nataliamotand: Or should we create it and leave the space blank, so the user can try the "New sentence" button later?

[00:13:36] Customer: Good question.

[00:13:36] Customer: Either we should somehow mark that card visually, or keep it blank.

[00:13:50] Customer: I think blank will be all right.

[00:14:00] nataliamotand: Okay, by blank you mean like these rows, a little faded?

[00:14:03] Customer: Not faded, but blank: the sentence for that card contains nothing, blank text.

[00:14:13] Customer: Such cards will be noticeable, discoverable, because they are blank compared to the other cards, which have something.

[00:14:13] Customer: And the user, I guess, will recognize that they need to ask for sentences again, or type the sentences themselves.

[00:14:13] Customer: And regarding the flag for such cards...

[00:14:55] nataliamotand: Sorry, can you repeat the question?

[00:14:55] nataliamotand: Was that a question?

[00:14:58] Customer: Okay, my opinion is that we should allow blank cards, so cards having no text, and the user may regenerate them later.

[00:15:23] Customer: Should we help the user with such cards?

[00:15:23] Customer: Should we help them select such cards automatically, or let them sort the list so that such cards appear higher, and then request new sentences for them?

[00:15:23] Customer: I'm not sure which UX is better.

[00:15:23] Customer: Maybe it's already covered.

[00:15:23] Customer: What does "Ask for sentences" do with such cards?

[00:15:23] Customer: If a card has blank text, so the sentence and the translation do not exist, what happens to it when you click "Ask for sentences"?

[00:16:22] nataliamotand: We click "Ask for sentences" only when we select the words for the first time.

[00:16:22] nataliamotand: In the case that the language model doesn't respond, the card for the word is created, but the sentence and the translation are blank.

[00:16:22] nataliamotand: Then the user has to ask again; this is how it works right now.

[00:16:22] nataliamotand: As you said, we'll make the request for the other sentences automatic.

[00:16:22] nataliamotand: But right now you ask the language model again by clicking the "New sentence" button on the card, not "Ask for sentences".

[00:17:10] Customer: Okay, so if I have three hundred cards and I need to regenerate some of them, because they have bad sentences or they are blank, and a blank sentence is also bad, what do I do?

[00:17:33] nataliamotand: Right now, as the MVP is built, you would have to click "New sentence" on each row that you think is not satisfactory.

[00:17:33] nataliamotand: Three hundred cards is a good example.

[00:17:33] nataliamotand: Maybe what we could do is add a checkbox in the first column of the cards table, so you could select cards and regenerate a new sentence for each of the selected ones, without clicking them separately.

[00:17:33] nataliamotand: Is that aligned with your thinking?

[00:18:22] Customer: Yes, something like this might work.

[00:18:22] Customer: But then I wonder why you need the flag button.

[00:18:22] Customer: What does it do, and does it flag sentences for regeneration?

[00:18:42] nataliamotand: Right now the flag is only there so the user can see that something in that card might not be adequate.

[00:18:42] nataliamotand: This is my own assumption from the previous meetings, but I had the impression that the flag would be used by the user to ask the teacher for a revision of the sentence or the translation, or for a card that they don't want to appear in their deck yet and want to correct.

[00:18:42] nataliamotand: That was the initial idea, but if you have a different one, please share it with us so we can adjust it.

[00:19:30] Customer: There are two approaches here, with some considerations connected to them.

[00:19:30] Customer: We could use the flag both to mark cards for regeneration and for later review by the teacher.

[00:19:30] Customer: Or we can have separate buttons: one for regeneration and one for flagging for the teacher.

[00:19:30] Customer: We need a flag for regeneration, because the student may want to regenerate without asking the teacher.

[00:20:27] Customer: Without waiting for them; maybe they don't even have a teacher.

[00:20:27] Customer: And maybe they are not sure whether some cards are bad or good, and they don't regenerate them immediately; such cards they may flag for a teacher, and the teacher may review them later.

[00:20:27] Customer: But we should also keep in mind that the student cannot discover all problematic cards.

[00:20:27] Customer: So the teacher should see not only the cards marked for them, but also the other cards, because those may also have problems.

[00:21:36] nataliamotand: Okay, it's important that you mention that, because we haven't built the teacher's view yet.

[00:21:36] nataliamotand: I'll make sure we take into consideration that the teacher sees not only the cards flagged by the student, but all of them.

[00:21:36] nataliamotand: Thanks for sharing that.

[00:21:57] Customer: I have another comment about this flag for teachers.

[00:21:57] Customer: We should decide on the purpose of this flag.

[00:22:13] Customer: Is it something the student is genuinely not sure about, while the other cards are okay?

[00:22:13] Customer: Or should the student be able to select a batch of cards, say a hundred, meaning that these are the only cards the teacher should check?

[00:22:13] Customer: Those may contain bad sentences and good sentences, but they are meant to be reviewed by the teacher, and the other cards are not, because maybe they will be studied later.

[00:22:13] Customer: So, two options.

[00:22:13] Customer: Either the student is not sure about some sentences and wants the teacher to check precisely those, and then the teacher sees both the marked and the unmarked sentences.

[00:22:13] Customer: Or we let the student select cards for review specifically.

[00:23:24] Customer: What do you think?

[00:23:24] Customer: Do you have any opinion right now?

[00:23:35] nataliamotand: I can share my initial thoughts on this, but I think it's a point we can take for further discussion.

[00:23:35] nataliamotand: Right now I think the first option you gave: the teacher has access to the full table of the student, and can also see the distinction the student made between unflagged cards and flagged ones, the ones they had some doubt about.

[00:23:35] nataliamotand: I think that would be the most complete option.

[00:23:35] nataliamotand: But I can give it more thought and come back with a more structured answer in the next meeting.

[00:23:35] nataliamotand: If you have a preference between these two options, that would also be great to hear.

[00:24:43] Customer: I think we can generalize both approaches, and then they converge.

[00:24:43] Customer: We can let the student mark cards for a teacher, and the teacher will see all cards, but the cards marked for the teacher will appear higher in their list.

[00:25:08] Customer: So that they know which cards the student wants the teacher's attention directed to first.

[00:25:19] Customer: And I think this will be enough.

[00:25:25] nataliamotand: Okay, that's a good option for me too.

[00:25:30] nataliamotand: We'll make sure that we build it accordingly.

[00:25:36] Customer: Okay, good.

[00:25:36] Customer: Let's proceed with the interface.

[00:25:36] Customer: This interface is for the core task, right?

[00:25:59] nataliamotand: Yes, this is for user story one, "Get a sentence and a translation for each word I mark in a text".

[00:25:59] nataliamotand: If you have any more opinions on this, please share them with us.

[00:25:59] nataliamotand: And when you're done, I'd like to record whether this user story is accepted or rejected in the meeting.

[00:26:32] Customer: Could you please show the criterion again?

[00:26:40] Customer: Okay, so: given a text in Russian, English or German that I pasted, when I mark three words as unknown and ask for sentences, then each of the three words is shown with one sentence in the text's language that contains that word, and its translation into my first language.

[00:26:40] Customer: Okay, could you show the site?

[00:26:40] Customer: Okay, I see the sentence and the translation.

[00:26:40] Customer: I see the word, and it appears in the sentence in the language that I learn.

[00:26:40] Customer: Okay, seems like this one is satisfied.

[00:27:53] Customer: Well, let's go on to the next criterion of the user story.

[00:28:01] Customer: AC-02: given a pasted text in which I marked no word, when I ask for sentences, then no sentence is shown, and the product tells me that no word is marked.

[00:28:13] nataliamotand: This was the first thing that I showed you.

[00:28:13] nataliamotand: I had marked the words beforehand, and then I unmarked them, so I could show you that if we ask for sentences with no words marked, it shows a warning that no sentences were generated.

[00:28:13] nataliamotand: I don't know if you remember that.

[00:28:36] Customer: Not really, could you show it again?

[00:28:39] nataliamotand: Yes, of course.

[00:28:43] Customer: And your cards, what do they show now?

[00:28:50] nataliamotand: The cards show the ones that we created before, but as you can see, there are only four of them and no new cards, because we hadn't selected any word.

[00:29:03] nataliamotand: I can select words that we hadn't selected before.

[00:29:10] Customer: And it added a new card.

[00:29:10] Customer: And when you select a word that you had before, what does it do?

[00:29:25] Customer: "Garten"; so it generates a card for that word again.

[00:29:37] nataliamotand: Yes, it will generate a new card; this is something we can change.

[00:29:37] nataliamotand: Another thing I also tested: if you paste a text with the same word in different parts of the text, when you mark one of them, all of them are marked.

[00:29:37] nataliamotand: Let me re-explain: in the same text, you only get one card per word you select.

[00:29:37] nataliamotand: But if you paste another text and select the same word, that's not blocked yet, so, as you can see here, we have two sentences for "Garten".

[00:29:37] nataliamotand: If that's not a good option, because, as you mentioned, the user might have forgotten that they already have a card for it, we can surely block it from being added.

[00:30:39] Customer: I had an idea, and I shared it with another team too.

[00:30:39] Customer: We would like to generate a card where the word is used in a sentence with the same meaning as in the original context, in the original text.

[00:31:13] Customer: A word can have different meanings depending on the context.

[00:31:13] Customer: So the word plus its context, the sentence where it appears, can become a unique identifier for such a word, for a card, for this combination; I don't know how to call it properly.

[00:31:35] Customer: I mean, we should generate cards that have unique identifiers, so each card has a unique combination of the word and the sentence where it appears.

[00:31:35] Customer: This way we can make the generation operation idempotent: if we ask to generate a card for a word that appears in the same sentence, then no card is generated, because we already have such a card.

[00:31:35] Customer: Do you get the idea?

[00:32:26] nataliamotand: Let me make sure: each card should be identified by the word and its meaning.

[00:32:26] nataliamotand: If there is already a card with that word and meaning, and I click the same word with the same meaning in a new text, it shouldn't create a new card; it should only create one if the word appears in a different context.

[00:32:26] nataliamotand: Is that okay?

[00:32:58] Customer: That's perfect.

[00:32:58] Customer: And the sentence where the word appears is a proxy for this meaning; we don't have a better context.

[00:33:17] Customer: We could ask a language model to compress the surrounding context of the word into some meaning, but then the meaning may change from card to card.

[00:33:17] Customer: Therefore we choose something stable, namely the sentence where the word appears.

[00:33:17] Customer: When the sentence changes, the identifier of the card, the combination of the word and its meaning, changes, and so a new card can be generated.

[00:33:17] Customer: There are corner cases: in a text, a word may appear outside of a sentence, so we need to handle this somehow.

[00:33:17] Customer: Maybe store not one sentence, but also the surrounding sentences.

[00:33:17] Customer: But there are corner cases here too: the text may be just a list of words, one word per line, and then you don't have any sentences.

[00:34:29] Customer: So this corner case has to be handled somehow.

[00:34:36] nataliamotand: Okay, thanks for sharing.

[00:34:36] nataliamotand: I have a couple of questions about this, if that's okay, just to make sure I get all parts of it correctly.

[00:34:55] nataliamotand: Right now, if this text has "Garten" twice and I click one of them, both of them are selected.

[00:34:55] nataliamotand: I was wondering whether, once we use the word and its meaning as the identifier, this should still happen, but only when both have the same identifier, and when they don't, they shouldn't both be selected by clicking one.

[00:34:55] nataliamotand: Did you understand my question?

[00:35:39] Customer: Yes.

[00:35:39] Customer: This situation is pretty rare; usually texts have different sentences.

[00:36:04] Customer: Usually when you select a word, it's not selected anywhere else, because in a normal text most of the words will be like that.

[00:36:04] Customer: In some specific text, a sentence is repeated, you select a word inside such a sentence, and that word is selected in all the other copies of that sentence.

[00:36:04] Customer: That might be confusing for a user who got used to only one occurrence of a word being selected when they click it.

[00:36:49] Customer: On the other hand, you can prevent them from doing unnecessary work: they don't need to select a word with the same meaning in other sentences if they have already selected it.

[00:36:49] Customer: As a little UX feature, maybe let's support this.

[00:36:49] Customer: So in the case that you have shown, the second "Garten" should not be selected, because it doesn't occur in the same context, it's not inside the same sentence.

[00:36:49] Customer: But if the last sentence were repeated, then both occurrences of "Garten" should have been selected.

[00:36:49] Customer: What do you think about this approach?

[00:37:53] nataliamotand: I think it's a good approach, it's very user-friendly, and we can try to implement it and show you in our next meeting.

[00:37:53] nataliamotand: My second question is also related to this context.

[00:37:53] nataliamotand: I was wondering if the identifier should be the word and the meaning, the context.

[00:37:53] nataliamotand: Your suggestion was that we store a few sentences so we know the context.

[00:37:53] nataliamotand: I was wondering if it wouldn't be easier, and meet the needs of the user, if we just stored the word and its translation.

[00:38:37] nataliamotand: Do you think context and translation are too different in this case?

[00:38:53] Customer: Very good question.

[00:38:53] Customer: Two considerations here.

[00:38:53] Customer: First of all, a word can be part of an idiom, and then what should the translation be?

[00:38:53] Customer: It won't be a single word; maybe it will be a phrase.

[00:39:34] Customer: The problem is that the user has selected a word inside an idiom, and ideally we should be able to tell them that they can't get a precise translation of that word, because it has a different meaning inside the idiom.

[00:39:34] Customer: If we set such a corner case aside, then each word has a corresponding English translation that captures its meaning in the sentence.

[00:39:34] Customer: But then we need some way to decide which meaning to use, and we should have several meanings available to pick from.

[00:39:34] Customer: So we need to store some dictionary of meanings and pick meanings from it; or how could it be implemented technically?

[00:40:43] nataliamotand: I'm not sure about the implementation.

[00:40:43] nataliamotand: But I guess the same way we would do it for a word and a sentence, so that the language model can grasp the concept, we can also do it for a word and its translation.

[00:40:43] nataliamotand: Maybe we could have a kind of dictionary behind it where we store these pairs of identifiers, and the language model would use it to check the cards we already have and see if a card for that word was already created.

[00:40:43] nataliamotand: I guess we could build it like that, see how it works in real life, and have a more accurate answer about this.

[00:40:43] nataliamotand: I'm not sure I answered your question.

[00:41:44] Customer: No, this is also an option.

[00:41:44] Customer: You don't need to know the meanings of all the words in the world.

[00:41:44] Customer: You can just process the text with a language model, capture the meanings of the selected words, and compose a dictionary.

[00:41:44] Customer: Then, if the user selects a new word, you can look it up in the dictionary.

[00:41:44] Customer: But who will decide which meaning to choose?

[00:41:44] Customer: [inaudible]

[00:41:44] Customer: So there should be a round before generating the cards where a language model maps each word to its proper meaning.

[00:42:43] nataliamotand: Yes, I think that's a good option, especially because I don't think the user is the most adequate person to select this manually, since they are learning a new language and might not know the meaning.

[00:42:43] nataliamotand: So a language model checking whether cards already exist is our best option right now.

[00:42:43] nataliamotand: Maybe in the future we could add a feature so the teacher can also review these kinds of problems with their expertise, also with the support of the language model.

[00:43:24] Customer: Okay, my only concern in this case is that a language model is not very precise at selecting the right meaning for the context.

[00:43:24] Customer: But I think this mapping is more compact, and can be more economical with respect to tokens.

[00:43:24] Customer: In my approach, where we captured the whole sentence to convey the word's meaning and wanted a new sentence based on that meaning, we had to send the word and its sentence, which might be long, while the meaning might be shorter than the whole sentence.

[00:43:24] Customer: This could be checked empirically.

[00:43:24] Customer: But since that approach is pursued by another team, let's go with your approach and see how it works.

[00:44:50] nataliamotand: Sure, that's okay.

[00:44:50] nataliamotand: We'll go with the word and its translation as the identifier of each card and see how that works out in practice.

[00:44:50] nataliamotand: If we encounter problems with it, we can try the other team's approach.

[00:44:50] nataliamotand: The application should work properly, and I'm sure we'll get to the best option.

[00:45:25] Customer: I think I even have another idea.

[00:45:25] Customer: We don't use a translation, but rather the same language: instead of specifying the meaning of a word, we come up with the shortest phrase that contains that word with the same meaning.

[00:45:51] Customer: Sorry, what?

[00:45:52] nataliamotand: Could you repeat that?

[00:45:52] nataliamotand: I stopped hearing you for a second.

[00:46:04] Customer: Yes, I hear you; can you hear me?

[00:46:11] nataliamotand: Yes, I can hear you now, but I didn't hear what you said; you started saying something, but I couldn't catch it.

[00:46:19] Customer: Okay, I'll repeat it.

[00:46:19] Customer: You suggested using a translation of a word to stand for its meaning.

[00:46:19] Customer: We can also use another approach: we can generate a phrase where the word has the same meaning as in the original sentence.

[00:46:19] Customer: So we compact the large context, the whole sentence, into a short phrase where the word has the same meaning.

[00:46:57] Customer: Then we don't lose anything by translating the word into another language.

[00:47:11] Customer: I think this might work because, in the original language, the word with that meaning can almost always be used in a shorter sentence.

[00:47:11] Customer: You don't need to come up with a whole sentence; a phrase will probably be enough, maybe three or four words.

[00:47:11] Customer: And this should be stated explicitly for the language model that comes up with such phrases, like "write a minimal phrase that uses this word in its original meaning", something like this.

[00:47:55] nataliamotand: Okay, this is fine by me, and it might also be best, since you have previous experience with this.

[00:47:55] nataliamotand: Just to make sure I got this right, sorry if I'm being repetitive, I just want to make sure we are going in the same direction.

[00:47:55] nataliamotand: Instead of the word and its meaning, or the word and its translation, we'll store the word and a phrase three or four words long, so the language model can grasp the meaning of that specific word.

[00:47:55] nataliamotand: Is that correct?

[00:48:36] Customer: Yes, that's okay.

[00:48:36] Customer: Also, such a meaning should be editable by the user and by the teacher, I guess, if they want it to capture the original meaning precisely.

[00:48:36] Customer: If the language model that produced that meaning did a poor job, people should be able to fix it.

[00:49:07] Customer: So somewhere in the card editor this meaning should be displayed and be editable.

[00:49:17] nataliamotand: About this, I'd like to share my opinion.

[00:49:17] nataliamotand: I think this is a complication, because we would have the word and the sentence that actually appear in the deck for the user to review, and somehow behind them we can also access the identifier of the word.

[00:49:17] nataliamotand: I'm not exactly sure how I would build this.

[00:49:17] nataliamotand: Maybe in the table of your cards we could somehow click the word and see its identifier in an editing view.

[00:49:17] nataliamotand: I want to know your opinion, but I don't think it's very good to build a separate page only for the pairs of identifiers.

[00:49:17] nataliamotand: That's why I'm confused: we would have two different sentences for one word, the sentence the user actually studies in the deck and the phrase that is connected to the meaning of the word.

[00:49:17] nataliamotand: I'm not entirely sure how that would work out.

[00:49:17] nataliamotand: Do you understand my question?

[00:50:20] Customer: Oh, yeah.

[00:50:51] Customer: We could repurpose the edit button for opening a more advanced editor for a card.

[00:50:51] Customer: There might be other information about a card that could be edited.

[00:50:51] Customer: For example, if a card is shared between decks, you might want to change the decks that the card belongs to.

[00:50:51] Customer: Or you may want to ask a teacher some questions about that card, or generate more cards with that word in that meaning, but with different sentences.

[00:51:42] Customer: So we can keep the original table that you showed, but also provide some functionality for advanced editing of cards.

[00:51:54] Customer: What do you think?

[00:52:00] nataliamotand: I'd like to share my opinion about this, and you can correct me if you think there's a better approach.

[00:52:00] nataliamotand: I would do as you say and repurpose the edit button.

[00:52:00] nataliamotand: Instead of editing the sentence inline like this, I would open a kind of modal view, a pop-up on the screen.

[00:52:00] nataliamotand: It would hold the more technical things, for example which text the word belongs to, the identifier, and still the editing of the sentence and the translation.

[00:52:41] nataliamotand: So I would have this modal view with more information.

[00:52:41] nataliamotand: I'm afraid it might be a lot of information for the user, so I'm not entirely sure, but I think this is the best solution for the problems we have right now.

[00:53:11] Customer: Yeah, I agree that it might be a pop-up, an overlay; I don't know how to call it properly.

[00:53:11] Customer: Or a sidebar.

[00:53:11] Customer: Any information that is hidden while viewing this table, but can be opened when needed.

[00:53:45] Customer: I think it was nice that the user could edit the generated sentence in place after clicking the edit button.

[00:53:45] Customer: Maybe we can make the sentences and translations editable without clicking a button, so it's a quick action for the user.

[00:54:13] nataliamotand: Like double-clicking the sentence, and then I can edit it?

[00:54:16] Customer: Yes.

[00:54:16] Customer: And maybe clear the translation, and then you can ask to regenerate cards, and a new translation will be generated, for example.

[00:54:16] Customer: But this comes back to the start of our conversation: what if some fields are blank?

[00:54:16] Customer: If the sentence is changed, then the translation should be regenerated.

[00:54:16] Customer: If the sentence is blank but the translation is not blank, then I think the whole card should be regenerated, because the translation constrains what can be generated, and that's bad.

[00:55:32] nataliamotand: You say that if the sentence is not generated, neither is the translation.

[00:55:32] nataliamotand: Just to make sure we're on the same page: the translation is connected to the sentence.

[00:55:32] nataliamotand: If I put a new word here, a new translation is generated, adjusted to the sentence.

[00:55:32] nataliamotand: So this column only exists linked to the sentence column.

[00:56:12] nataliamotand: The translation column depends on the sentence column; it's a live translation of what's in the sentence column.

[00:56:12] nataliamotand: So there is no case where the sentence is blank and there is a translation: if the sentence is blank, so is the translation.

[00:56:41] Customer: Yes, that's correct.

[00:56:57] Customer: Okay, I lost you for a moment.

[00:56:57] Customer: Did you say something?

[00:57:03] nataliamotand: No, sorry, I interrupted you, but I wanted to make sure we are on the same page, because you mentioned that maybe the sentence was blank but the translation was there, and we would want to generate new sentences.

[00:57:03] nataliamotand: I don't think you finished what you meant, and if you want to continue, feel free, I would love to hear about it.

[00:57:33] Customer: Okay.

[00:57:33] Customer: The German sentence in this case must contain the German word.

[00:57:33] Customer: If the German sentence is blank but the translation is not blank, and we regenerate cards taking the translation into account, then the translation will constrain which German sentences we can generate.

[00:57:33] Customer: Maybe it will even be impossible to generate a German sentence that contains the word and has this translation.

[00:57:33] Customer: Therefore we should make the translation completely dependent on the sentence; basically, this is the reasoning.

[00:58:39] nataliamotand: I didn't quite get some of what you said.

[00:58:39] nataliamotand: Could you repeat why you think the sentence and the translation should be independent?

[00:58:54] Customer: No, they must be dependent: the translation depends on the sentence.

[00:59:01] Customer: Right now they are independent, so you can clear the sentence and keep the translation.

[00:59:01] Customer: But if you edit the translation into some unrelated sentence...

[00:59:01] Customer: Oh, can you edit the translation, by the way?

[00:59:19] nataliamotand: No, and that's why I think they are not independent as they are: you can't edit the translation and have the sentence adjusted to it, you can only edit the sentence.

[00:59:19] nataliamotand: The other case is that when the card is generated, the sentence can be blank, but then the translation is also blank.

[00:59:19] nataliamotand: So there's no case here where we have a translation and no sentence.

[00:59:19] nataliamotand: As they are, the only constraint is that the translation can't be edited.

[01:00:01] nataliamotand: Maybe we could let only the teacher edit the translation, and in the teacher view make it work both ways: if the teacher edits the translation, the sentence would not change if it means the same.

[01:00:01] nataliamotand: I don't know exactly how we would do this, but I think maybe this is a point we can discuss in the future.

[01:00:27] nataliamotand: I don't know if you agree with that.

[01:00:29] Customer: I do agree.

[01:00:29] Customer: Let's keep the translation read-only for now, and dependent on the sentence.

[01:00:39] Customer: I mean, the teacher may want the student to learn a particular mapping from the German word to an English word through the sentences, and then they may want the translation to have a specific English word.

[01:01:05] Customer: But for a student, would they want it?

[01:01:23] Customer: Maybe we should trust the user.

[01:01:23] Customer: Maybe we should assume that they know what they are doing and let them edit the translation.

[01:01:23] Customer: And when they regenerate the cards, the translation does not change, or they should be able to protect the card from regenerating the translation.

[01:01:23] Customer: Not sure.

[01:02:13] Customer: Okay, let's think about protecting the translation.

[01:02:13] Customer: Assume the user knows what they're doing: they protect the translation, and then whenever they edit the translation and ask to regenerate, the translation is not regenerated if it's not empty, right?

[01:02:46] nataliamotand: I'm not sure what you mean.

[01:02:46] nataliamotand: Could you give an example?

[01:02:50] Customer: Sure.

[01:03:01] Customer: So what happens to the translation after you edit the sentence, right now?

[01:03:09] nataliamotand: The translation changes along with the sentence: I put a new word here, and the translation changes too.

[01:03:20] Customer: Yes, so this is the live translation that you mentioned.

[01:03:33] Customer: And if the sentence does not change, then the translation does not change either, right?

[01:03:50] Customer: Could the user want to change the sentence but not the translation?

[01:03:50] Customer: The translation of the sentence stays the same, but the sentence is formulated a bit differently.

[01:04:07] nataliamotand: We can try that.

[01:04:07] nataliamotand: Just a second.

[01:04:13] Customer: Like, the order of the words is different, for example, but the translation is the same, kind of.

[01:04:26] nataliamotand: Did you see that before, "wunderschön" was translated as "beautiful", and when I changed the sentence, the word in the translation changed?

[01:04:26] nataliamotand: I'm not entirely sure why that happened, but I can check it and see how it works.

[01:04:40] nataliamotand: So it can change depending on the meaning.

[01:04:40] nataliamotand: What's your question about this?

[01:04:40] nataliamotand: Do you have any concerns?

[01:05:03] Customer: Yeah, I would like to give the user the freedom to choose which translation to learn, basically more control over the cards.

[01:05:03] Customer: By default we can do them a favor and generate translations for them, but if they really want a specific translation, they should be able to preserve it between regenerations.

[01:05:36] nataliamotand: Okay, but in this case we trust that the user knows what they're doing, right?

[01:05:36] nataliamotand: You don't think that if the user changes the translation, the sentence should read it and change itself?

[01:05:36] nataliamotand: I think that would be complicated.

[01:05:36] nataliamotand: I think it's okay to let the user edit the translation, but we shouldn't do a double check, because then we would have a kind of iterative translating: I would change something in the translation, the sentence would change, and then the translation would read the sentence and change itself.

[01:06:08] nataliamotand: If we do this double check, it gets complicated.

[01:06:08] nataliamotand: So I'll just assume that if the user wants to change the translation, they know what they're doing.

[01:06:08] nataliamotand: Is that okay with you?

[01:06:33] Customer: Yes.

[01:06:33] Customer: So the automatic translation flow is one way, from the sentence to the translation.

[01:06:33] Customer: But after the user has edited the translation, such an automatic regeneration of the translation should not happen.

[01:06:54] Customer: The translation should be preserved until the user edits the sentence again.

[01:07:09] nataliamotand: Very good, that's fine.

[01:07:09] nataliamotand: It's good that we came to an understanding; I'll make sure we adapt to what we've discussed here.

[01:07:09] nataliamotand: And I'd like to know how we can move forward with [inaudible]

[01:07:33] Customer: Sorry, I lost you.

[01:09:03] Customer: Seems like nataliamotand lost the connection.

[01:09:22] nataliamotand: Hello, can you hear me?

[01:09:22] nataliamotand: Did you hear what I said?

[01:09:22] nataliamotand: I had an internet problem.

[01:09:34] Customer: It's okay, I didn't hear you though.

[01:09:38] nataliamotand: Okay, I can repeat, no problem.

[01:09:38] nataliamotand: I was saying that we've reached a few minutes past one hour of meeting, and I was wondering what we should do going forward.

[01:09:38] nataliamotand: I had prepared this meeting to show you the three user stories and the criteria that we agreed on in the last meeting, and we've only gone through the first one.

[01:09:38] nataliamotand: So I was wondering what's best for you, in terms of your availability.

[01:09:38] nataliamotand: For me, the only thing I have today is to hand in Assignment 3 for this course, so whatever is best for you, I can make it work.

[01:09:38] nataliamotand: Maybe I can show the other two user stories now in a quicker, simplified way, or we could reschedule the rest if you have any problems with time.

[01:09:38] nataliamotand: So basically, how is your time, and how available are you for the other two user stories that we built?

[01:10:53] Customer: Okay, I'm available right now.

[01:10:53] Customer: Sorry for going into details, which might not be [inaudible]

[01:11:03] nataliamotand: No, no problem.

[01:11:05] Customer: Yeah, but not for this particular version, although I appreciate that your version sparked deep conversations about how it should work in general.

[01:11:25] Customer: Okay, my last comment about the translation is that we should probably even let the user protect it, so maybe a lock icon that, when clicked, keeps the translation from changing even if the user changes the sentence and starts a regeneration.

[01:11:25] Customer: Maybe the user wants to preserve the translation.

[01:11:25] Customer: And I think then we can move forward with what you have left.

[01:12:04] nataliamotand: So I'll make sure that we have some kind of freeze, so the translation doesn't change.

[01:12:19] nataliamotand: So, just to confirm, do you have time to look at the other two user stories right now?

[01:12:33] Customer: Yes, I do have time.

[01:12:33] Customer: What about you, do you have such time?

[01:12:36] nataliamotand: Yeah, great, I'm okay.

[01:12:36] nataliamotand: As I said, the only thing I have to do today is hand in Assignment 3 for this course, so I'm available for as much time as we need to go through all the relevant points for you.

[01:12:36] nataliamotand: What about you, AbdelrahmanAbdel-Aal, is that okay with you?

[01:13:09] Customer: I would assume that it's okay.

[01:13:16] AbdelrahmanAbdel-Aal: Oh, okay, I have a bad internet connection, if you can hear me.

[01:13:22] Customer: Yeah, we can hear you.

[01:13:35] nataliamotand: Okay, I'll just move forward, and if you have any appointments you need to go to, feel free to; we'll do the best for you.

[01:13:35] nataliamotand: So I'll go through the other two user stories.

[01:13:35] nataliamotand: About user story one, just to get it on record: do you accept it or reject it, based on the acceptance criteria that we mentioned?

[01:14:10] Customer: Could you please show the last acceptance criterion?

[01:14:10] Customer: "Given a marked word, when the language model does not answer, then that word is shown without a sentence and with the message that the sentence could not be generated, and the other words keep their sentences."

[01:14:40] nataliamotand: This is what I mentioned before: I tested it with a Russian phrase and this happened to me.

[01:14:40] nataliamotand: The card appears with the word, but the sentence and translation are blank.

[01:15:05] nataliamotand: And that doesn't change any of the other cards in the table.

[01:15:12] Customer: Yes; maybe it's not necessary to show a message for each sentence that could not be generated.

[01:15:12] Customer: Maybe one message will be enough, like "Some sentences could not be generated, try again later".

[01:15:12] Customer: Then it will be okay.

[01:15:12] Customer: So I think this acceptance criterion should be adjusted.

[01:15:12] Customer: So is it okay that we don't close this user story for now?

[01:16:05] nataliamotand: If we adjust the third acceptance criterion, should we close the story with the adjustment, or bring it again to the next meeting, so we decide then whether it should be closed?

[01:16:29] Customer: Let's keep it until the next meeting.

[01:16:29] Customer: Maybe the overall interface will change, and something will change.

[01:16:40] Customer: So it would be nice to check this issue again.

[01:16:45] nataliamotand: Okay, so I'm moving on to the second user story, "Check the sentence written for a word".

[01:16:45] nataliamotand: This user story has six acceptance criteria.

[01:16:45] nataliamotand: Would you like me to read them for you?

[01:16:45] nataliamotand: Or I can show them while I show you the application; I think that might be more dynamic.

[01:17:15] Customer: Okay, so please show me.

[01:17:19] nataliamotand: Acceptance criterion five is that marking the words creates a card for each word without confirmation.

[01:17:19] nataliamotand: You saw before that the table appeared by itself, and this was decision five.

[01:17:19] nataliamotand: I don't know if you remember from the last meeting, but we had two options for how to create the cards: either we confirm each of them, or they are just created right away.

[01:17:19] nataliamotand: The decision you made was that as soon as we ask for the sentences, we don't have to confirm, they just get created.

[01:18:05] Customer: That's the acceptance for [inaudible].

[01:18:11] nataliamotand: So I guess that's okay.

[01:18:11] nataliamotand: Acceptance criterion one is that when we edit the sentence of one word, the new sentence is shown for that word only, the product translates the new sentence again so the translation always matches, and the other cards don't change.

[01:18:11] nataliamotand: And if I reload the page, the edit is still there.

[01:18:11] nataliamotand: This is what I was showing you before with these examples.

[01:18:11] nataliamotand: Would you like me to do it again, or is that okay with you?

[01:18:51] Customer: It's okay, I witnessed that.

[01:18:55] nataliamotand: Okay.

[01:18:55] nataliamotand: Acceptance criterion two is that I ask for a new sentence for one word, I get a different sentence for the same word, and the other words don't change.

[01:18:55] nataliamotand: So I can click the button here on this word.

[01:18:55] nataliamotand: Did you see that both the sentence and the translation changed, and all the other words kept their sentences?

[01:19:27] Customer: Yes, yes.

[01:19:30] nataliamotand: I'll also reload the page so you can see that it doesn't change: the translation is "We are taking the train from [inaudible] to Berlin", and it's still here.

[01:19:42] Customer: Yeah, I see that, great.

[01:19:45] nataliamotand: Okay, the next acceptance criterion is about the flag.

[01:19:45] nataliamotand: When I flag the sentence, it stays flagged until I change it: I can ask for a new sentence, edit it manually, or clear the flag.

[01:19:45] nataliamotand: So here's the flag.

[01:19:45] nataliamotand: I can clear it, or ask for a new sentence and it disappears automatically, or I can edit the sentence and it also disappears.

[01:20:28] nataliamotand: This is the acceptance criterion; do you recognize that we did it?

[01:20:28] nataliamotand: And if you think we should change something about this criterion, you can also comment on that.

[01:20:47] Customer: Yeah, I saw that both expected behaviors happened.

[01:20:47] Customer: When you changed the sentence or regenerated it, the flag disappeared.

[01:21:08] nataliamotand: Yes.

[01:21:08] nataliamotand: Is that okay with you?

[01:21:08] Customer: Yes.

[01:21:17] nataliamotand: Acceptance criterion four is that when the model does not answer a request for a new sentence, the current sentence stays and a failure message is shown.

[01:21:17] nataliamotand: This is the same thing as with acceptance criterion three of the first story: since the model responded for each of our words, I'm not quite sure how to demonstrate it to you.

[01:21:51] Customer: Could you please clarify which scenario you're testing?

[01:21:58] nataliamotand: Do you remember when I mentioned that when we ask for sentences the model might fail, and then a card is created with the word but no sentence and no translation?

[01:21:58] nataliamotand: This acceptance criterion is not about asking for sentences when the model doesn't respond.

[01:21:58] nataliamotand: It's about asking for the regeneration of a sentence when the model doesn't respond.

[01:21:58] nataliamotand: The same thing happens: we get a message that the model is not working and to retry in a few moments, and the translation stays with the sentence.

[01:22:51] Customer: Yes.

[01:22:51] Customer: In this case you can show a message for this card specifically.

[01:23:02] Customer: For the case where multiple cards receive no valid sentence as a response, it's enough to show one message.

[01:23:02] Customer: Or maybe you have another opinion: should we show a message near such problematic cards, to highlight each of them, or is one message enough?

[01:23:37] nataliamotand: My personal opinion is that if we select only one card, the message should say which word we are referring to.

[01:23:37] nataliamotand: But if we select more than one word, we should just display a general message.

[01:23:37] nataliamotand: If we put up multiple warnings, I think it might not be good for the user's view; the page would be too cluttered, whether the warnings are at the top or inline in the table.

[01:23:37] nataliamotand: There would be a lot of error messages.

[01:23:37] nataliamotand: So basically, my opinion is that we should display only one warning that some of the sentences couldn't be regenerated.

[01:24:43] Customer: Yes, I agree.

[01:24:43] Customer: Maybe for even better highlighting we can mark such rows in red.

[01:25:02] nataliamotand: Okay, so the user knows that they need to be regenerated, right?

[01:25:02] Customer: Right, yes.

[01:25:02] Customer: Or if they forgot to write a sentence when they edited it, so they edited a sentence and left it blank, we can also highlight such rows.

[01:25:34] nataliamotand: Okay, I have a question about that; it's more of a detail about the implementation.

[01:25:48] Customer: Oh yes, please ask.

[01:25:50] nataliamotand: I was wondering about the multi-select option: if we select, say, three cards, ask for a new sentence, and the language model fails.

[01:25:50] nataliamotand: Maybe the marker for this failure should be a different one, or maybe we should use the one we have, the flag.

[01:25:50] nataliamotand: I was wondering whether that should be the same as the user's flag, or a different kind of visual marker.

[01:25:50] nataliamotand: I'd like your opinion about this.

[01:26:44] Customer: So flagging means the user wants to regenerate these cards.

[01:26:44] Customer: But they may have many cards, two thousand or one thousand, for example, and some of them may be invalid.

[01:26:44] Customer: I think we should not automatically flag them for regeneration, because we care about the user's token budget.

[01:26:44] Customer: If we mark all invalid rows for regeneration, then we have to spend tokens to regenerate these cards, and the user may not want that.

[01:27:34] nataliamotand: But the language model wouldn't be called automatically to regenerate flagged cards.

[01:27:34] nataliamotand: The only thing that would happen in this scenario is that if a card couldn't be regenerated, a word that initially wasn't flagged would be flagged, so the user knows that they wanted to change that sentence but it didn't work, for whatever reason.

[01:28:11] Customer: So validation shows the problematic rows, and flagging shows which rows are subject to regeneration, right?

[01:28:29] nataliamotand: What validation do you mean?

[01:28:32] Customer: The validation that you need to do; an empty sentence, for example.

[01:28:41] Customer: In this case we don't have to regenerate a sentence for that row.

[01:28:41] Customer: We can just highlight that it's invalid or empty, so that the user knows there is such a row.

[01:28:41] Customer: Then they can select it for regeneration, click the "New sentence" button, and sentences will be regenerated for all selected rows.

[01:28:41] Customer: But I wonder how many such rows with empty sentences there can be, and what to do if there are lots of such cards.

[01:28:41] Customer: As you mentioned, there are consistent problems with generating Russian sentences.

[01:28:41] Customer: So if the user has a thousand cards and their sentences are blank, then with my approach the user has to select each such card and then start the regeneration, manually.

[01:28:41] Customer: Selecting a thousand cards might be inconvenient.

[01:28:41] Customer: If we instead use your suggestion, to unify the flag for the case when a sentence is invalid and for when a student marked a card for regeneration, then that approach is good for the case when they have lots of invalid cards, like in the Russian sentences case that I described.

[01:28:41] Customer: But it may misfire in another case, when they have some cards with invalid sentences for which they don't want to regenerate sentences right now.

[01:31:13] Customer: Or maybe it's okay: we generate sentences for such invalid cards once, and then the user does not have to select them and regenerate.

[01:31:13] Customer: Okay, let's then drop my argument that the user may want to spare some tokens and not generate sentences for invalid cards.

[01:31:13] Customer: Let's flag them for regeneration automatically, and that's it.

[01:31:13] Customer: Then we can unify the behavior of the flag and of the validation: whenever a card is invalid, we flag it for regeneration.

[01:31:13] Customer: Sorry for this long reasoning.

[01:32:47] nataliamotand: No problem.

[01:32:47] nataliamotand: It's good that you share your concerns, because even if we don't come to a conclusion now, the more concerns you share, the bigger the chance that I can find a solution that deals with them when I'm developing later.

[01:32:47] nataliamotand: So feel free to talk as much as you want, to make sure we get the point; it's no problem at all.

[01:33:19] Customer: Okay, thanks for reassuring me.

[01:33:19] Customer: So then: validation sets the flag for invalid cards automatically, and the user can flag cards manually if they want, or flag other cards.

[01:33:19] Customer: Okay, regarding the button names, I think they can be more intuitive.

[01:33:53] nataliamotand: The action buttons, you mean?

[01:33:55] Customer: Yeah.

[01:33:55] Customer: What does "flag" mean?

[01:34:01] Customer: Either this should be explained somewhere, or a better name should be found that is intuitively understandable.

[01:34:11] nataliamotand: Maybe "Mark for review"?

[01:34:15] Customer: That's a good option.

[01:34:15] Customer: Maybe provide a little legend at the top, and use icons instead of full buttons.

[01:34:15] Customer: Then "Mark for review" might look like a real flag, and the legend, the key, will explain what this flag means.

[01:34:15] Customer: And "New sentence" may look like a reload icon.

[01:34:15] Customer: The legend will convey the meaning of each button.

[01:35:01] Customer: What do you think about making the buttons more compact?

[01:35:09] nataliamotand: I think it's a good idea to have icons that are universal, like the regenerate one with the circular arrow; I think we can adjust that so it's more user-friendly.

[01:35:09] nataliamotand: About the flag, I also think it should have a different name, but I'm not sure about the icon; maybe we should still have some text.

[01:35:09] nataliamotand: Another idea, maybe an improvement: we could have two kinds of flags, "flag to review" and "flag to regenerate", but we can discuss this further during the development of the project.

[01:35:09] nataliamotand: I'm sure it's good to simplify as much as we can, while the user still understands what every icon and button means.

[01:35:09] nataliamotand: So it's good that you brought this up, and I'll make sure we correct it for the next meeting, so you can see whether we got what you meant.

[01:36:24] Customer: Great.

[01:36:24] Customer: I'm also not sure how it works now, but if the buttons' meaning is explained above the table, then the table should be scrollable without moving the whole page, scrollable within the card list, so that the legend is always visible and the user understands what the buttons mean.

[01:36:59] nataliamotand: Okay, we can do that: the scroll, and the legend in the same place at the beginning of the table, so the user can see it.

[01:37:18] Customer: On desktop the legend can be in the upper right corner; it stays where it is, and the table is scrollable.

[01:37:33] Customer: On mobile, maybe between the line "Sentence edited" or "Flagged" and the table itself, but still visible at all times.

[01:37:48] Customer: Maybe the user should be able to hide it on mobile to save space; I'm not sure.

[01:37:48] Customer: Can we discuss it later?

[01:37:59] nataliamotand: Okay, we can make this work.

[01:37:59] nataliamotand: We don't have a mobile view yet, but in future meetings I think we can bring one, so you can check whether everything is according to your wishes.

[01:37:59] nataliamotand: For now, I'll put the legend in the top right corner with some more description, and adjust the scroll of this box.

[01:37:59] nataliamotand: Those are the two things that you mentioned.

[01:37:59] nataliamotand: Is there anything else?

[01:38:36] Customer: No, I think that's it about the table.

[01:38:43] Customer: Should we proceed to the other acceptance criteria?

[01:38:49] nataliamotand: Okay, we can move forward.

[01:38:49] nataliamotand: The final acceptance criterion is about the delete button.

[01:38:49] nataliamotand: Acceptance criterion six is that when I delete a card, it is removed from the table and from the study session, and the other cards don't change.

[01:38:49] nataliamotand: So I just deleted the duplicate "Garten" card.

[01:39:16] nataliamotand: The other cards didn't move, and it doesn't appear any more in the cards to be reviewed.

[01:39:16] nataliamotand: So that's the final acceptance criterion.

[01:39:26] Customer: Okay, I agree that it works.

[01:39:26] Customer: But I think there should be not only the delete button, but also a hide or archive button, where you don't delete the card permanently, but just exclude it from reviews.

[01:39:52] nataliamotand: Okay, so two confirmations.

[01:39:52] nataliamotand: When I click the delete button, it should delete right away, without any confirmation notice; is that okay?

[01:40:08] Customer: Well, that's a good question.

[01:40:22] Customer: It depends on the scenario.

[01:40:22] Customer: Can there be a scenario where they want to delete multiple cards, and should this process be quick?

[01:40:39] Customer: Maybe they should be able to select a bunch of cards and then click delete, and then you can ask for a confirmation.

[01:40:39] Customer: So it will be a quick selection plus a confirmation.

[01:41:00] Customer: And they don't delete each individual card.

[01:41:06] nataliamotand: Okay.

[01:41:06] nataliamotand: The second confirmation is about the hide button.

[01:41:06] nataliamotand: If I delete a card, it is excluded from the history, from the deck, from the study session, from everything.

[01:41:06] nataliamotand: But if I hide it, the card should still appear in the table, with some visual marker that it's hidden, so it won't appear in study sessions.

[01:41:06] nataliamotand: The only purpose of the hide button is that the card doesn't appear in study sessions; is that correct?

[01:41:41] Customer: Yes, that's correct.

[01:41:44] nataliamotand: So the card should still appear in your cards.

[01:41:51] Customer: Yes.

[01:41:51] Customer: I think it should even appear in the same place where it was before being hidden.

[01:42:05] Customer: This can be an eye icon, or something intuitive, understandable.

[01:42:16] Customer: Yes, it will not appear in the reviews.

[01:42:16] Customer: Oh, by the way, the user may want to learn cards in a specific order, so they should be able to reorder the cards.

[01:42:16] Customer: I'm not sure if we talked about that.

[01:42:39] nataliamotand: I think we mentioned it, but we didn't go much into detail.

[01:42:39] nataliamotand: I know it's important that we have some kind of reprioritization of the cards, but I'm not sure how it will be done, or whether it will be automatic or manual.

[01:42:39] nataliamotand: Maybe we can have a drag handle here to change the order of the cards.

[01:42:39] nataliamotand: Right now this table of your cards is configured so that if I add a new card, it shows up on top.

[01:43:15] nataliamotand: That's the only prioritization we have.

[01:43:15] nataliamotand: Do you think this table should be in the order in which the cards will appear, or should the order and the reprioritization be handled elsewhere?

[01:43:40] Customer: Right; just to confirm, reprioritization is recorded in your user stories, I guess?

[01:43:56] nataliamotand: I know it's not in the three user stories that we built the MVP on, but I can take a look at the others.

[01:44:10] nataliamotand: From what I see, it's not in the user stories yet.

[01:44:18] nataliamotand: But it is mentioned in the decisions, if I'm not mistaken.

[01:44:18] nataliamotand: There is the study queue; I believe I showed it to you in the last meeting.

[01:44:18] nataliamotand: The study queue is where you can choose which words you want to learn first.

[01:44:18] nataliamotand: But the learner doesn't choose particular words; they choose by the text the cards were created from.

[01:44:18] nataliamotand: Do you understand?

[01:44:18] nataliamotand: Maybe we can adjust it so that the reprioritization can be done for a specific word and not just for a text.

[01:44:18] nataliamotand: This would be the user story that we would refine and change, based on what you think the reprioritization should be.

[01:45:16] Customer: Yes; I'm not sure whether the reprioritization should be that granular, at the word level, but I think it might be useful.

[01:45:16] Customer: So how we can go about it: for each card we can store its origin, the text it comes from.

[01:45:16] Customer: Then on the cards page you can select the text, and all cards created for the words from that text will be selected.

[01:45:16] Customer: Then you can move them at once, or unselect some of them and move the rest.

[01:46:26] Customer: And without selecting a text, you should still be able to select some cards and move them to the top of the table.

[01:46:26] Customer: What is at the top of the table is studied first.

[01:46:26] Customer: Maybe we can add a button in the table to show the cards in reverse order, but I'm not sure it's necessary.

[01:46:26] Customer: For now, let's keep the cards in the order in which they are studied; that seems logically sound.

[01:46:26] Customer: So the user can see in which order the cards are studied, and this corresponds to your study queue, as far as I understand.

[01:47:20] Customer: Yes.

[01:47:21] Customer: And in this case the user will be able to reorder that queue as they want, with just some helpers that help them identify the cards belonging to a particular text.

[01:47:21] Customer: Okay, so I think that will be it.

[01:47:48] nataliamotand: Okay.

[01:47:48] nataliamotand: So we've gone through all the acceptance criteria of user story two, and I was wondering whether you accept it or reject it, and whether you have any other considerations.

[01:48:12] Customer: Let me check again.

[01:48:12] Customer: The problem is that it seems I didn't specify the process for dealing with user stories well in the assignment.

[01:48:12] Customer: Right now, when the customer accepts a user story, you can close it.

[01:48:12] Customer: But if you dramatically change the UI of your product, should you reopen that user story and review the acceptance criteria?

[01:48:12] Customer: This is not specified, but it's enough to just specify that reopening a user story is okay.

[01:48:12] Customer: So if I approve all of the acceptance criteria for this current version, then it's fine; if you change something dramatically, you can reopen it later and reconfirm.

[01:48:12] Customer: "Check the sentence written for a word."

[01:49:40] Customer: I think adding an archive button here is not necessary.

[01:49:51] Customer: "Then a card exists for each word."

[01:50:02] Customer: Yeah, so I think this user story can be considered done, completed as it is.

[01:50:02] Customer: Further user stories may specify other behaviors, and further acceptance criteria.

[01:50:22] nataliamotand: Okay, I was going to close this issue, but I'll read it again after the meeting and then close it.

[01:50:22] nataliamotand: Thanks for accepting it.

[01:50:22] nataliamotand: I hope there is no problem with my internet and you can hear me fine.

[01:50:22] nataliamotand: I'll proceed with the third user story, "Study my cards inside the product".

[01:50:22] nataliamotand: This one has four acceptance criteria.

[01:50:22] nataliamotand: I'll delete some cards, so I have three, as in the scenario of the acceptance criteria.

[01:50:22] nataliamotand: I'll read to you what I have and show it in the product, and then we can verify it.

[01:50:22] nataliamotand: Acceptance criterion three says that I answer a due card as remembered, it does not come back in this session, and the product tells me its next date, which is after today.

[01:50:22] nataliamotand: So, for example, I started a new session.

[01:51:52] nataliamotand: I have the sentence, and I can click "Show translation".

[01:51:52] nataliamotand: If I select "Remembered", this card will not come back in this session; it will be rescheduled and shown to me in a later session.

[01:51:52] nataliamotand: So this is what happens here.

[01:52:15] nataliamotand: You remembered the word, and it says the date when it will be shown again.

[01:52:15] nataliamotand: This is acceptance criterion three.

[01:52:25] nataliamotand: Is that okay?

[01:52:25] nataliamotand: Do you have any considerations?

[01:52:30] Customer: Yes.

[01:52:30] Customer: In Anki there are four types of response, something like easy, medium, hard and again, which signal to FSRS, the spaced repetition algorithm, when to show the card next.

[01:52:30] Customer: For example, "Again" shows the card in ten minutes, as far as I know.

[01:53:01] Customer: And this value is adjustable.

[01:53:01] Customer: "Easy" shows it after double the previous interval, or something like this.

[01:53:01] Customer: So there should be not two buttons but four buttons, like in Anki.

[01:53:32] Customer: And also, the card should not look like this.

[01:53:32] Customer: Let's see what a card looks like again.

[01:53:32] Customer: This is a study session, and I see the front of the card, right?

[01:53:54] nataliamotand: Yes, this is the front.

[01:53:54] nataliamotand: I think it's not very intuitive, because this text is about the previous card and it appears on the next card, so I'll make it more intuitive, so people understand that what's appearing right now is a new card.

[01:53:54] nataliamotand: So there is the word, how it's pronounced, the sentence, and this hint for the user to try to remember what it means.

[01:54:35] nataliamotand: You have a moment to try to remember the word, then you click the "Show translation" button, and you get the translation of this sentence specifically.

[01:54:35] nataliamotand: So this is the back of the card, and the one I showed before is the front.

[01:54:58] Customer: Got it.

[01:54:58] Customer: Does GitHub work for you?

[01:54:58] Customer: Maybe we can have a look at an example of a card in the proof-of-concept repository.

[01:55:26] nataliamotand: songs2anki?

[01:55:26] nataliamotand: Do you want me to open it?

[01:55:26] nataliamotand: I have it, but I don't know if it's quick to access; I'm just opening Anki so we can go through it.

[01:55:41] nataliamotand: Just a second.

[01:55:48] nataliamotand: Okay, let me reshare my screen.

[01:56:13] Customer: Oh, that's even better, you've got Anki itself.

[01:56:30] Customer: So there is the German word at the top, and then the sentence, and then when you click "Mostrar resposta"...

[01:56:44] nataliamotand: Yeah, it's in Portuguese, sorry.

[01:56:48] Customer: I can't read Portuguese, sorry; okay, then...

[02:05:44] nataliamotand: Hello, can you hear me?

[02:05:46] Customer: Yeah.

[02:05:48] nataliamotand: Thank God.

[02:05:48] nataliamotand: I don't know what happens, my laptop keeps disconnecting from the internet.

[02:05:48] nataliamotand: Sorry for the wait, and thank you for understanding.

[02:05:48] nataliamotand: I'll share the Anki screen again, so you can tell me what you meant about the review; just a second.

[02:07:14] Customer: Great, I'll share the screen.

[02:07:14] Customer: Okay, this is the front of the card.

[02:07:29] Customer: And this is the back.

[02:07:29] Customer: On the front, the user sees the German word, or the English word; it depends on the direction of the card.

[02:07:43] Customer: Then they see the sentence.

[02:07:43] Customer: They can also listen to both the word and the sentence, and by default the audio of the sentence is played.

[02:08:02] Customer: At the bottom you can see four buttons in the middle: easy, medium, hard and again.

[02:08:02] Customer: I think these four buttons should be in the site that you built.

[02:08:29] Customer: What do you think?

[02:08:29] nataliamotand: I think it's good.

[02:08:29] nataliamotand: We're going to have to change the logic of the review scheduler a bit, but I think it's doable and fits the user's needs better.

[02:08:29] nataliamotand: So I think it's a good improvement for us to have in the first version.

[02:08:29] nataliamotand: About the front and the back of the card: you said you don't like the view we have right now.

[02:08:29] nataliamotand: Did you mean that we should show them both at the same time, or something else?

[02:09:12] Customer: No, you should not show both at the same time.

[02:09:12] Customer: The whole purpose of the front and the back is that you don't see the answer.

[02:09:30] nataliamotand: Yes, but up front, the first thing you see is only the front.

[02:09:30] nataliamotand: When you click the button, should it show only the back, or a shared view of the front and the back?

[02:09:51] Customer: I think they should see something like this, which gives a visual difference between the back and the front.

[02:10:13] Customer: You don't insert the translation into the front, so you don't show the word and its translation in the same line.

[02:10:13] Customer: You show the translation separately, so that it's clear where the answer is and where the question is.

[02:10:37] Customer: And the audio should be playable on both sides.

[02:10:37] Customer: What confused me a bit in your interface are the hints for the user about what to do next.

[02:10:37] Customer: This interface assumes the user knows what they are doing: they can click a button at the bottom, or the replay button, or the spoiler triangle to see some information.

[02:10:37] Customer: But in your interface you tell them what to do.

[02:10:37] Customer: Could you please show it?

[02:11:22] nataliamotand: Yes, let me share again.

[02:11:40] nataliamotand: Do you see my screen?

[02:11:40] Customer: Yes.

[02:11:45] nataliamotand: So this is the front of the card, and I think the way we have it right now is pretty intuitive and also guides the user.

[02:11:45] nataliamotand: There's only one button to click on the front of the card.

[02:11:45] nataliamotand: On the back you have the answer, and two options: either you remember what the word means, or you don't.

[02:12:08] nataliamotand: I think the only thing that isn't said to the user is what happens if you click "Remembered" or "Forgot".

[02:12:08] nataliamotand: In Anki, each button states when the card will appear again, and we don't have that here.

[02:12:39] Customer: Yes, that's a good point.

[02:12:39] Customer: If you switch to the four explicit buttons, you can also show the scheduler's forecast of when the card will be shown next time.

[02:13:06] Customer: Also, in Anki there is a translation of the word itself, not only of the sentence.

[02:13:06] Customer: Maybe it can also be shown somewhere here.

[02:13:27] Customer: You also mentioned something about the first word on the card.

[02:13:27] Customer: So here is "Garten": does it show how the word is pronounced, or is it just the word?

[02:13:49] nataliamotand: Here it's only the word; my mistake, it's just that on the other card it was different.

[02:13:49] nataliamotand: I'm not quite sure why, but I'll check it and make sure it's fixed by the next meeting.

[02:13:49] nataliamotand: So it's not the pronunciation, mainly because we're going to have a user story that adds audio to each card.

[02:14:19] nataliamotand: Maybe it's good, because the person can read the pronunciation and try to guess how it sounds.

[02:14:19] nataliamotand: But I think there's no point, since there will be audio, and the user can listen to how the word is pronounced either way.

[02:14:19] nataliamotand: What's your opinion on this?

[02:14:39] Customer: My opinion is that the sound is enough, and the person does not need to see the...

[02:14:59] Customer: I forgot what this is called: the pronunciation of the word written using symbols.

[02:15:12] Customer: But they should have buttons here to play the word and the sentence.

[02:15:12] Customer: Also, for German it's important how words are written.

[02:15:12] Customer: For example, nouns are capitalized wherever they appear, and other words are not, except for names.

[02:15:12] Customer: So here you should not capitalize all the letters of a word; you should show it with the same capitalization as it appears on the deck page, basically.

[02:15:57] nataliamotand: You can correct me if I'm mistaken, and please do, but I thought that nouns in German start with capital letters, like "Garten" and "Haus", and "schön" and "wunderschön", since they are adjectives, don't.

[02:15:57] nataliamotand: Do you think there's a mistake here?

[02:15:57] nataliamotand: Maybe we should explicitly tell the language model which words to capitalize.

[02:16:27] Customer: No, I meant the "Garten" above the sentence: it's in all capital letters.

[02:16:37] nataliamotand: Okay, I got it.

[02:16:40] Customer: If the word were shown as it is, it would not be all in capital letters.

[02:16:59] Customer: About "Forgot": the card comes back, and you mentioned that this will be more intuitive.

[02:16:59] Customer: Could you please show the front of the card again?

[02:17:14] nataliamotand: Of course, this is the front.

[02:17:26] Customer: Do you think this instruction about showing the translation is really necessary?

[02:17:26] Customer: Isn't the button self-explanatory?

[02:17:38] nataliamotand: Yes, you have a point.

[02:17:47] Customer: Then it can be removed.

[02:17:47] Customer: It's nice that you highlight the word in the sentence.

[02:17:47] Customer: For nouns in German it might be tricky, because there are articles, "der", "die", "das", and they can also fuse with prepositions, like "an dem" becomes "am", and I'm not sure what to do in this case.

[02:17:47] Customer: Maybe it's enough to highlight just the word itself, without any articles.

[02:18:28] Customer: Well, let's [inaudible] decide on this right now.

[02:18:42] Customer: What about phrases?

[02:18:42] Customer: What if the person wants to learn a phrase?

[02:18:42] Customer: Should we let them do that, or should we only let them learn single words?

[02:19:00] nataliamotand: My opinion is that it's not that we don't let the user learn the full sentence; it's that each card focuses on a specific word.

[02:19:00] nataliamotand: Maybe if they don't know what "Zimmer" means, they can have a card specifically for that.

[02:19:00] nataliamotand: We make sure that each card focuses on only one word, and the sentence helps as a kind of support.

[02:19:00] nataliamotand: So if the person doesn't know what "groß" is, they might remember what "Zimmer" is and get it from the context.

[02:19:00] nataliamotand: That's my main take on this, but please give me your opinion, and tell me if it's really important that a card can focus on the whole sentence instead of just one word.

[02:20:09] Customer: As it is now, we support a workaround for learning phrases instead of words.

[02:20:09] Customer: We can let the user pick a word from that phrase, then edit the sentence and the translation that we generate for them, and then on the card they can learn exactly that phrase.

[02:20:39] nataliamotand: Yes, because the whole product is now built on top of words; the cards are focused on one word.

[02:20:39] nataliamotand: If we changed it to sentences, we would have to redo the logic of the application, and I'm not sure which logic suits the user's needs best; that's my main concern.

[02:20:39] nataliamotand: We can think more about this and decide whether we keep the application's focus as it is, or adjust it so that phrases are included.

[02:20:39] nataliamotand: Either way, the card shows the translation of the whole sentence.

[02:21:32] nataliamotand: So the card focuses on one word, but you can still pick up other vocabulary from it.

[02:21:47] Customer: Right.

[02:21:47] Customer: But in this workaround only one word will be highlighted, not the phrase they intend to learn, so it will really look like a workaround, not a major feature.

[02:21:47] Customer: I wonder what would be affected if we allowed learning combinations of words; not whole sentences, probably, but idioms, or words that are composed of two words, or maybe some names.

[02:22:45] Customer: I think not much really changes.

[02:22:45] Customer: Here the highlighting should span the whole phrase instead of a single word, but everything else stays the same: you show the sentence, the translations, and so on.

[02:22:45] Customer: And for the logic, if we use unique identifiers for cards, the logic still holds.

[02:22:45] Customer: If we allow not a single word but, for example, two or three words as one part of the identifier, we can still get the meaning of that idiom or that combination of words.

[02:22:45] Customer: So we can still get the same kind of unique identifier, and it seems it will not be broken.

[02:24:02] Customer: Why did I bring it up?

[02:24:02] Customer: German nouns are usually studied together with their articles, so we should support not only the noun but also its article on the deck page.

[02:24:02] Customer: Could you please go to that page, where there is the text and the table with the cards?

[02:24:41] nataliamotand: Yes.

[02:24:42] Customer: So here the word is not "Garten" but "der Garten": first the article, then "Garten" capitalized, so two words.

[02:24:42] Customer: And if there are more than two words, three or four, it seems it will still work.

[02:24:42] Customer: What do you think?

[02:25:12] nataliamotand: I think it's good.

[02:25:12] nataliamotand: But this only happens with nouns, right?

[02:25:12] nataliamotand: We can implement a rule that every time the selected word is a noun, it has to have its article as part of it.

[02:25:12] nataliamotand: I think it's important, because it's specific to learning German, and it's necessary that we add it.

[02:25:12] nataliamotand: I tried learning German for a while, but I'm not entirely sure, so I just wanted to confirm with you: only nouns have articles, and no other part of speech does, right?

[02:26:08] Customer: Yes, and yes.

[02:26:08] Customer: Articles just go with nouns.

[02:26:08] Customer: Other words can appear between an article and the noun, like adjectives, but they don't have their own articles.

[02:26:39] nataliamotand: Okay, it's good that you mentioned it, and we can adjust it.

[02:26:44] Customer: Great.

[02:26:44] Customer: I recall another complication that this will introduce.

[02:26:44] Customer: Could you please scroll to the top of the page, to the text?

[02:26:44] Customer: Say the user wanted to learn not a single word but several consecutive words.

[02:26:44] Customer: There are two ways we can get a card that has more than one word in it.

[02:26:44] Customer: For a noun there will be two words; maybe we get the article from somewhere, but in the text only a single word is selected.

[02:27:51] Customer: Or the user has edited the word inside the card and added some more words, and that is how they got more than one word in the word column.

[02:28:21] Customer: And letting them select several words in a text as a single word, or rather a word combination, is the shortcut for getting three words into the word column.

[02:28:39] Customer: Here is how we solved this with another team last year.

[02:28:39] Customer: They suggested that when a user selects a word in the text, they get suggestions about what they actually want to select: this word, or this word with some surrounding words.

[02:28:39] Customer: The suggestions were based on the structure of the sentence: the sentence was parsed into a tree of interconnected structures.

[02:28:39] Customer: For example, there was a node that combined the article and the noun, even if something appeared between them.

[02:28:39] Customer: For example, "the long bus" in English: "the" is the article, "long" is an adjective, and "bus" is a noun, so the user could select "the bus" without "long".

[02:28:39] Customer: Something like this.

[02:28:39] Customer: The technical complexity was that it had to be done in Python with some natural language processing, but it was doable.

[02:28:39] Customer: I'm not sure if we should do this in this case.

[02:30:33] Customer: But I think we should somehow let the user select several words for a card.

[02:30:42] nataliamotand: Okay, I might have a few ideas about this; I need to sit down and try it, but I have an idea that might work.

[02:30:42] nataliamotand: Right now we can select words, and they have these divisions.

[02:30:42] nataliamotand: Maybe if we could hold the button and drag across the words, it would save them as one phrase and show them together visually.

[02:30:42] nataliamotand: And we could unmark an adjective, or the word in the middle, with the right mouse button, and show it differently.

[02:31:30] nataliamotand: I don't know if that's doable, but I'll take a look and get back to you on this in the next meeting, and hopefully it will work.

[02:31:30] nataliamotand: I get the idea of what you meant, and I'll do my best to integrate it into our application.

[02:31:56] nataliamotand: I guess that's it.

[02:31:56] Customer: Great.

[02:31:56] Customer: I can suggest an approach that I think the other team came up with.

[02:31:56] Customer: It might be selection with another mouse button, or holding a key on the keyboard and then selecting words.

[02:31:56] Customer: There should be a way to signal to the service that you select these words together.

[02:31:56] Customer: After you have selected these words, you can show the connections between them, maybe some arcs between the words.

[02:31:56] Customer: But if you do that, you will introduce quite a lot of noise into the text view: the arcs may overlap or take lots of space, and if the words are not on the same line, you will have to draw very long arcs, and it will not be very convenient.

[02:33:17] Customer: So another approach is, after the selection, to show only on hover which combination of words was actually selected.

[02:33:17] Customer: So you don't always show it, only on demand.

[02:33:17] Customer: For example, you selected "Bahnhof" and then "Zug", and then you hover over "Bahnhof", and the tooltip shows the whole combination.

[02:33:50] Customer: Something like this.

[02:33:50] Customer: What do you think about this approach?

[02:33:55] nataliamotand: I think it's a good approach; it's another option we can try next week, and I think it might be best for the visualization, as you said.

[02:33:55] nataliamotand: I'll do these two tests.

[02:33:55] nataliamotand: I also have a question.

[02:33:55] nataliamotand: Can we communicate only in the customer meetings, or can the group chat also be used for me to show you different options for the application so you can decide, or should we keep decisions to the meetings?

[02:34:39] Customer: Well, decisions can be made anywhere, but they should ideally be recorded; this is the main requirement about decisions.

[02:34:39] Customer: If you think you will get enough feedback in the chat, then okay, we can discuss some things there.

[02:34:39] Customer: If you feel that you need another meeting, you can either wait for the sprint review meeting, or schedule another meeting if more feedback is needed.

[02:34:39] Customer: Otherwise, I feel comfortable answering in the chat if you send something there.

[02:35:41] nataliamotand: Sure, thanks.

[02:35:41] nataliamotand: I'll try both of these options next week and show you.

[02:35:41] nataliamotand: Since the visualization is the main point here, I was thinking of taking screenshots of both options and asking which one you prefer, or whether the option we choose is okay visually for the user.

[02:36:19] Customer: Great.

[02:36:19] Customer: Wow, such a long meeting.

[02:36:19] Customer: I think we have one more user story to review, or do we?

[02:36:30] nataliamotand: We're at the final acceptance criteria.

[02:36:41] nataliamotand: Do you want to end the meeting here, or should I go on?

[02:36:50] Customer: No, let's finish it.

[02:36:50] Customer: I mean, let's complete what you planned and then finish.

[02:36:50] Customer: I was just complaining, sorry.

[02:37:03] nataliamotand: No problem.

[02:37:03] nataliamotand: I'm just sorry that the meeting has to be on a Saturday; I'll do my best so that it doesn't happen again.

[02:37:03] nataliamotand: I understand it's a lot of your time on a Saturday, so thanks for staying either way, and I'll go as quickly as I can.

[02:37:03] nataliamotand: The first acceptance criterion I showed is that if you mark a card as remembered, it doesn't come back in this session, and it shows the date when it will come back, so that's done.

[02:37:58] nataliamotand: The next acceptance criterion is that when I have cards and some of them are due today and I start a new session, only the ones due today are shown.

[02:37:58] nataliamotand: In the beginning we had three cards left.

[02:37:58] nataliamotand: We said we remembered one of them, so I could show you the previous acceptance criterion, and as you can see, if I load the page again, it doesn't come back on the same day.

[02:37:58] nataliamotand: So we only have two cards left in this session.

[02:37:58] nataliamotand: This is acceptance criterion number one.

[02:38:39] nataliamotand: And finally, acceptance criterion number two is that a card I answer as forgotten comes back later in the same session.

[02:38:39] nataliamotand: If I say that I forgot here, you can see that after the other card, it comes back.

[02:38:39] nataliamotand: So within the same session, if I forget a card, it comes back; that's acceptance criterion number two.

[02:38:39] nataliamotand: Acceptance criterion number four is that when no cards are due today or earlier, the product says that nothing is due.

[02:38:39] nataliamotand: If I remember both cards and try to start another session, I have no cards left to review, so it says I can't start a new session, because no cards are due today.

[02:39:32] Customer: Exactly.

[02:39:43] Customer: This was a problem in Anki for me.

[02:39:43] Customer: I wanted to review cards, but I didn't have any cards scheduled for today because of the scheduler, and I still had some time to review, and I couldn't force it to give me more cards.

[02:39:43] Customer: I think we should have a way to request more cards, even if you review them ahead of the schedule.

[02:40:24] Customer: That is one thing.

[02:40:34] Customer: Another thing: there should be limits on how many cards you review today.

[02:40:44] nataliamotand: Per session or per day?

[02:40:50] Customer: It's the same thing as in Anki: there is a review session, but the limits are set per day, I guess.

[02:41:10] Customer: You can stay in this session the whole day, so it doesn't make sense to set separate limits.

[02:41:32] Customer: I'm not sure; no, I think you set limits per day, yes.

[02:41:32] Customer: So if you want to learn more cards during the day, you need to increase the limit of cards you can learn.

[02:41:32] Customer: And if there are really zero new cards and only cards to review, you have to increase the limit on the number of cards to review.

[02:42:07] Customer: Oh no, sorry: and if all of the cards to review are scheduled for another day, then there is no way to review cards today, and this was quite inconvenient.

[02:42:23] Customer: So there should be settings for the limit of cards to review per day and the number of new cards suggested per day.

[02:42:40] Customer: And there should be a way to request cards to review ahead of the schedule.

[02:42:40] Customer: On the review screen where I see a card, I think there were some statistics about how many cards are left in this session, right?

[02:43:06] nataliamotand: Yes.

[02:43:12] nataliamotand: They're not shown now, because we don't have any cards due.

[02:43:12] nataliamotand: But when we do, when you click to start a session, it shows the number of cards you have to review instead of this warning.

[02:43:30] Customer: Right.

[02:43:30] Customer: Could you switch to Anki?

[02:43:30] Customer: There are three numbers shown there.

[02:43:43] nataliamotand: Let me reshare it.

[02:44:19] Customer: Even here you can see three numbers: "Novos", "Aprender", "Revisar".

[02:44:19] Customer: Sorry for my accent.

[02:44:30] nataliamotand: No, it's perfect.

[02:44:33] Customer: Thank you.

[02:44:33] Customer: "Novos", I guess, is new cards, so 20 new cards for today.

[02:44:54] nataliamotand: "Aprender" is learning: cards that I have seen but still have to learn.

[02:45:06] Customer: Okay, and "Revisar", I guess, is review.

[02:45:11] nataliamotand: Yes.

[02:45:17] Customer: The "Aprender" cards are new cards or cards to review that you found difficult today.

[02:45:17] Customer: You saw a new card, marked it as hard or again, and it goes to "Aprender", and then it's shown again, and you review it in this session until all of those numbers are zero, basically.

[02:45:17] Customer: So I think we should also use this approach with three classes of cards: something really new, something you learned previously, and something you found difficult today and still need to learn today.

[02:46:21] Customer: And here you can see there are several decks.

[02:46:21] Customer: I don't quite remember what you showed in the first meeting, except for the table with the cards.

[02:46:21] Customer: Did you show the decks?

[02:46:44] nataliamotand: No, there is no page with different decks yet.

[02:46:44] nataliamotand: The only two things I showed you in the previous meeting were the table with the words and the editing and flagging buttons, and the study queue, to define the order in which the texts would be studied.

[02:46:44] nataliamotand: So I don't think I showed you anything about different decks.

[02:47:13] Customer: Okay.

[02:47:13] Customer: I think a person may learn several languages at once, so they need some way to separate their cards; therefore they need decks.

[02:47:13] Customer: Another team asked me how decks are related to texts, and for now we decided that decks are separate from texts.

[02:47:56] Customer: But you can assign a card to several decks.

[02:48:07] nataliamotand: I think we could define the deck based on these two language fields: based on the language pair we choose, the words are assigned to a specific deck.

[02:48:23] nataliamotand: Since we can choose only one combination per text that we paste here, the cards would automatically be assigned to a deck.

[02:48:23] nataliamotand: Do you understand the idea?

[02:48:23] nataliamotand: Is that a good solution to the problem?

[02:48:38] Customer: It's a viable solution, but I think it's a bit constraining.

[02:48:38] Customer: If a person wants to learn particular topics, they would probably prefer separate decks, even though they have the same combination of languages.

[02:49:19] Customer: And they may combine several texts to choose words from for one deck, so there should be no limit on the number of texts used to form a deck.

[02:49:19] Customer: And then the approach that I considered with another team; is it okay that I mention what I considered with another team?

[02:49:58] nataliamotand: Yeah, of course.

[02:50:05] Customer: Several texts can be used to generate cards for a particular topic, and a card may appear in several decks, and its progress should be preserved across all those decks.

[02:50:05] Customer: We know that a card has a unique identifier, the word and its meaning, so it's easy to preserve the progress of a card across decks.

[02:50:51] Customer: But the tricky part is how to relate texts to decks.

[02:50:51] Customer: Right now we consider this option: after the card is generated from a text, it forgets about the text and keeps only what's relevant from it, namely the sentence it comes from.

[02:50:51] Customer: In our case it might be useful to remember the sentence too, but we have also collapsed the sentence, the context, into a single meaning for the unique identifier.

[02:50:51] Customer: After that, the text can be freely removed, replaced or edited.

[02:50:51] Customer: So the card forgets its original text, remembers only the relevant part of it, and is disconnected from the text.

[02:51:57] Customer: After that, the card can belong to multiple decks, and you don't need to relate texts to decks any more.

[02:51:57] Customer: You just create a card and put it into the decks where you want it to be.

[02:52:16] nataliamotand: Do you want the assignment to decks to be made for each word specifically, or for the whole text?

[02:52:16] nataliamotand: When I click "Ask for sentences", all the words that I marked here would be assigned to one or more specific decks.

[02:52:16] nataliamotand: Because if that's the case, I could have a multi-select in this first box that lets the user choose the decks they would like to add all of these words to.

[02:53:04] nataliamotand: Is that a clear idea?

[02:53:06] Customer: Yes, that's the idea.

[02:53:06] Customer: So the languages are just settings for the language model, so that it knows in which language to produce the sentences.

[02:53:26] Customer: They can also be the meta information of the decks.

[02:53:35] Customer: By the way, they can be used for filtering the decks where you can add the cards.

[02:53:35] Customer: If you specify that a deck is for English and German, and here you select Russian and German, then you won't show that deck in this multi-select.

[02:54:05] Customer: Text language, your first language: maybe this pair of languages should be... how is it called?

[02:54:28] Customer: Disconnected from the text; I mean, the text is a separate thing from the generation, kind of.

[02:54:50] Customer: Or no, let me think a bit.

[02:54:59] Customer: Should you specify the languages before you input the text, or near "Ask for sentences", somewhere below the text?

[02:55:14] nataliamotand: I think it's independent right now.

[02:55:14] nataliamotand: As you said, this is only for the language model to know which language it translates from and into.

[02:55:14] nataliamotand: So I guess the order of the steps doesn't matter much, since the user will fill in all the information in this first box.

[02:55:46] nataliamotand: I'm not sure the order they appear in matters much.

[02:55:53] Customer: Oh, yeah, right.

[02:55:53] Customer: Those are just settings.

[02:56:16] Customer: There can be multiple texts to generate cards from, and they should be stored somewhere.

[02:56:16] Customer: There should be, not a gallery, but a list of texts, where you can select words to generate sentences.

[02:56:44] Customer: I think we can keep this interface that you present for a single text.

[02:57:00] Customer: Yes, if for each text you are able to generate sentences again.

[02:57:07] Customer: Maybe after generating, should you be able to generate sentences for another language from this text?

[02:57:07] Customer: So you use this text to generate German and English cards, and then you should be able to use the same text to generate German and Russian cards.

[02:57:37] Customer: Maybe yes.

[02:57:53] Customer: But then you should show another view of the cards.

[02:57:53] Customer: I guess for each combination of languages you should show its own view of the cards, its own table; for Russian and English, not this table but an empty one should be used.

[02:58:18] Customer: And you should also show in the multi-select the decks that are compatible with this pair of languages.

[02:58:28] nataliamotand: Just to make sure I understand: the "Your cards" table should be related to the combination of both of these selects, plus the decks?

[02:58:28] nataliamotand: Or just the languages?

[02:58:49] Customer: Just the languages.

[02:58:49] Customer: This table depends on the text and the languages selected for this text.

[02:59:06] Customer: Yeah, something like this.

[02:59:06] Customer: And you should be able to assign a card to several decks; I'm not sure if we discussed that.

[02:59:28] Customer: If a card was assigned to a deck that does not match this combination, the text with Russian and English, for example, or German and English, then it's not shown in this table, because it does not belong to it; it becomes a separate card.

[02:59:58] Customer: Oh no, I think I said the wrong thing.

[03:00:07] Customer: If you have a card that was generated for a German-English deck, then it can only be added to other German-English decks.

[03:00:07] Customer: It cannot be added to a Russian-English deck, for example.

[03:00:07] Customer: So basically, the idea is that you can add cards to multiple decks, but all of them must be compatible with each other with respect to the pair of languages.

[03:00:45] nataliamotand: Okay, I understood that; I think we can work out logic that satisfies that.

[03:00:55] nataliamotand: So I guess that's it for the user stories; we went through all of them.

[03:00:55] nataliamotand: I have a few follow-up questions I wanted to ask quickly about the direction of the project for the next few weeks.

[03:00:55] nataliamotand: About the next step: which one should we build first?

[03:00:55] nataliamotand: User story four, which is about moving a text to the front of the study queue, user story seven, which adds audio to each card, or user story five, the teacher view, which lets a teacher correct the student's sentences.

[03:00:55] nataliamotand: So basically the options are four, five or seven.

[03:02:04] Customer: I would order them as four, seven and then five.

[03:02:11] Customer: Because the teacher requires accounts, and can be postponed and implemented later.

[03:02:11] Customer: Regarding four, I guess we discussed it: you don't move the words of a text by moving the text somewhere.

[03:02:11] Customer: You pick a text, the words from that text are selected, and then you can do something with those words.

[03:03:00] Customer: And user story six can come even after user story five.

[03:03:07] nataliamotand: Okay.

[03:03:07] nataliamotand: From what I'm reading in the script, that's all we have to discuss today.

[03:03:07] nataliamotand: Just to make sure we have a full view of the product we have right now: all three stories are built, so no story leaves the candidate unless you say so.

[03:03:07] nataliamotand: With these three stories, in your opinion, can a learner go from entering a text to studying the cards that come from it without getting stuck in any part of the process?

[03:03:07] nataliamotand: And if not, where do you think they would most likely get stuck?

[03:04:07] Customer: I think they don't get stuck in this process, unless they choose the Russian and English pair of languages, for example, and, as you mentioned, receive only blank sentences.

[03:04:07] Customer: But for German and English it worked okay.

[03:04:07] Customer: You demonstrated how to input a text, select the words, generate cards for them, edit them, and then review.

[03:04:07] Customer: So I think the core task is completed, and those three user stories are covered.

[03:04:57] Customer: As far as it goes with respect to the acceptance criteria, maybe something should be adjusted, as mentioned before.

[03:04:57] Customer: But overall, they're completed, and the user can complete the core task without getting frustrated.

[03:05:19] nataliamotand: Okay.

[03:05:19] nataliamotand: There's also another thing I'm supposed to show you to wrap up the meeting: the study queue that I mentioned at the beginning.

[03:05:19] nataliamotand: I made an example, but I'm not sure whether we should go through it right now, or present it in the next meeting.

[03:05:19] nataliamotand: Since we are building user story four next, I could bring you an example to see if you agree with it, and change it if you don't, or we could discuss this example now.

[03:05:19] nataliamotand: You already told me what you want from the study queue, but we are no longer within the timebox of the meeting, so I need your opinion on how to go through with this.

[03:05:19] nataliamotand: I can also share it with you, and you can read it offline and give me your opinion.

[03:05:19] nataliamotand: I don't know which you would prefer.

[03:06:43] Customer: I think I would prefer to discuss it now, if you're okay with that.

[03:06:53] nataliamotand: It's fine by me, so we can move forward with it.

[03:06:58] nataliamotand: You can see my screen, right, the study queue example on GitHub?

[03:06:58] nataliamotand: This is an example of the study queue I showed you for the Week 2 action point.

[03:06:58] nataliamotand: It is a made-up example, so it's not data from an actual learner.

[03:06:58] nataliamotand: In this scenario the learner has three texts: A, B and C.

[03:06:58] nataliamotand: Today the queue is A1, A2, B1, B2, C1, C2, C3, as you can see here.

[03:06:58] nataliamotand: If the learner wants to study text C first, while the words are fresh, there are two readings of how we can move text C to the front.

[03:06:58] nataliamotand: The first reading is that every card of C moves, including C3, which is already studied, and the queue becomes what is stated here.

[03:08:05] nataliamotand: The second reading is that only the new cards from C move: C1 and C2, which are not reviewed yet, move, and C3, which is already studied, stays at the bottom of the queue.

[03:08:05] nataliamotand: What's your view on that?

[03:08:05] nataliamotand: And if you have any other considerations about the queue, feel free to share them with me.

[03:08:43] Customer: Okay, that's a bit tricky.

[03:08:43] Customer: The study queue is a table, and what we discussed before was that this table can be reordered: it should be possible to select all the cards belonging to a text and reorder them.

[03:08:43] Customer: But texts might also be deleted; maybe we should not delete texts, so that we can reorder the queue.

[03:09:34] Customer: And "every card of C moves": as we discussed before, it's not necessary that every card moves; only the cards that the user wants to move do move in the study queue.

[03:09:34] Customer: I mentioned that the closer the cards are to the top of the table, the sooner they will be learned; that was my assumption.

[03:09:34] Customer: But then I remembered that each card has its own progress, so cards that are due earlier might be lower in the table than cards that are due later, or that are completely new.

[03:09:34] Customer: So how do we signal to the scheduler that it should not take the cards that are due earlier, because there are cards that are higher in the study queue?

[03:10:55] Customer: I'm not sure I formulated the question clearly.

[03:11:02] Customer: Could you please explain what you understood?

[03:11:10] nataliamotand: Could you repeat the question again, the last part of it?

[03:11:14] Customer: Sure.

[03:11:19] Customer: Let me ask the first question: what does the order of cards in the study queue mean?

[03:11:31] nataliamotand: It's what you mentioned, the prioritization of the cards.

[03:11:31] nataliamotand: You said that the higher the cards are in the table, the earlier they will be learned.

[03:11:31] nataliamotand: So when you start a new session, you learn card one, then two, three, four, and so on.

[03:12:01] Customer: Okay, in this example, in your table, we have the card B2, for example, and we move it before A2.

[03:12:01] Customer: And the limit of cards for today is only two.

[03:12:01] Customer: Then today you learn only A1 and B2, but you don't learn A2; is that right?

[03:12:48] nataliamotand: If a card is due today, you will learn it in the study session regardless of its order.

[03:12:48] nataliamotand: We haven't limited the number of cards you have to learn today.

[03:12:48] nataliamotand: But since it's an option you brought up, maybe we should think about it.

[03:12:48] nataliamotand: Maybe the exception to the rule of a maximum number of cards per day is cards that have never been studied: if you create a card today, you study it today.

[03:12:48] nataliamotand: So I guess we can make an exception to the rule of the maximum number of cards you can review in a day.

[03:13:35] nataliamotand: This way you would not have the problem that if B2 were in the fourth position, it wouldn't be studied.

[03:13:48] nataliamotand: So I guess we can introduce this new rule.

[03:13:52] nataliamotand: But the main thing we need to decide here is the rules that the prioritization works by.

[03:13:52] nataliamotand: In the example I mentioned, is it more important that you study a new card, so we would have an exception, or is it better for the user to reprioritize based on which text they want to learn first?

[03:13:52] nataliamotand: I guess that's the main point we have to decide today: what's most important to you, when the card was last reviewed, or which text it belongs to?

[03:14:35] Customer: Yes, that's the right question.

[03:14:46] Customer: I think we should not look at when the card was last reviewed, but rather sort the cards by default by when they are due next, so that cards that are due sooner go higher in the table.

[03:14:46] Customer: After that, we should think about moving the cards inside the queue.

[03:15:24] nataliamotand: Based on the text they come from?

[03:15:28] Customer: Yeah.

[03:15:30] nataliamotand: Or by any other parameter?

[03:15:30] Customer: No, not exactly.

[03:15:30] Customer: In the queue, I assume we can select an arbitrary subset of cards and move them together: drag this group higher or lower in the table.

[03:15:30] Customer: In that group, the cards will be placed consecutively, one after another.

[03:15:30] Customer: They may initially be in random parts of the table, but after moving them they go one after the other.

[03:16:16] Customer: I'm not sure if it's possible in Excel: you select several rows and drag one of them, and all of the rows are moved.

[03:16:16] Customer: Do they become consecutive, or do they keep the gaps between them?

[03:16:16] Customer: I'm not sure.

[03:16:36] nataliamotand: If I'm not mistaken, in Excel you can drag rows, but only if there is space available where you want to drag them.

[03:16:36] nataliamotand: If there's no space available, the option it gives you is to replace the rows.

[03:16:36] nataliamotand: So I guess it is consecutive: if you drag, you put them all together and replace the rows that were there, but you can also insert new rows and push everything further down.

[03:17:15] Customer: All right.

[03:17:15] Customer: I was just trying to find an analogy to describe the interface.

[03:17:15] Customer: Let me return to this table.

[03:17:15] Customer: Say I selected B1 and B3 and then dragged B3 below C1.

[03:17:15] Customer: Then I will get C1, B1, B3.

[03:17:46] nataliamotand: Yes, I guess so.

[03:17:50] Customer: So C1, B1, B3: B1 and B3 were not consecutive before, but now they are consecutive below C1.

[03:17:50] Customer: And this dragging should not break the prioritization, the sorting invariant that the cards are sorted by the time when they are due.

[03:18:24] Customer: Therefore I guess we should make B1 and B3 due after C1 but before C2.

[03:18:24] Customer: So we should choose such a moment, maybe in the middle, and assign B1 and B3 to that moment.

[03:18:24] Customer: So we override their due time, so that the sorting invariant still holds.

[03:19:00] Customer: We could have chosen cards from different texts, B2 and C1 for example, and moved them below C2.

[03:19:12] Customer: Then their due time would also be overridden.

[03:19:12] Customer: What do you think about this approach?

[03:19:28] nataliamotand: It's a little more complex, and I just want to make sure what's more important to you.

[03:19:28] nataliamotand: The due date by which the cards should be reviewed is more important, but you also want to break this rule when you manually drag cards in the table; is that it?

[03:19:28] nataliamotand: I don't know if I understood it correctly.

[03:19:58] Customer: Basically, my initial need was to learn cards depending on the order of the texts.

[03:19:58] Customer: But now I see that I may want to learn some words from one text and some words from another one earlier.

[03:19:58] Customer: Therefore I need to be able to freely move cards, to reschedule them.

[03:20:35] Customer: Selecting all cards that belong to a single text lets me select the cards I want from that text.

[03:20:35] Customer: Selecting all cards or some cards from another text lets me select cards from that text.

[03:20:35] Customer: And then I can drag them together to where I want to study them in today's queue.

[03:20:35] Customer: But the queue is sorted by the due date, so to keep this sorting and still have the cards at the position where I want them, I need to change their due time so that they can stay in that position.

[03:20:35] Customer: What I suggest is to choose such a due time that allows them to stay in that position.

[03:21:41] nataliamotand: Okay, that makes more sense to me: you should be able to change the due time manually if you want.

[03:21:41] nataliamotand: I think the table has to have a clear order, either ascending or descending.

[03:22:08] nataliamotand: So I think the option you gave is the best one: it should be possible to move cards manually, by text, but with this constraint, that if you move a card, its due date changes, so that the table always follows the same ordering rule.

[03:22:08] nataliamotand: You know what I mean?

[03:22:34] Customer: Yeah, that's right, that's what I meant.

[03:22:38] nataliamotand: So I guess that's the perfect solution, and we can implement it and see if it works for your objective.

[03:22:38] nataliamotand: That answers the question.

[03:22:59] Customer: Great, thank you for bringing this up.

[03:23:07] Customer: So what else is there to clarify, if anything?

[03:23:12] nataliamotand: So, after I took three hours of your Saturday, I can officially finish the meeting for today.

[03:23:12] nataliamotand: I went through everything we had planned for the meeting, and I'd like to thank you for giving me your opinion on many different aspects of the project.

[03:23:12] nataliamotand: I don't have anything else for today.

[03:23:12] nataliamotand: Since we got so many adjustments to make, I'll consolidate them in a message and send it to you, so you can confirm everything and make sure I got everything right.

[03:23:12] nataliamotand: I'm not sure I'll be able to hand in Assignment 3 on schedule this afternoon, but surely by tomorrow it will be on Moodle, with a 10% deduction from the grade.

[03:24:25] Customer: Yes, officially yes.

[03:24:29] nataliamotand: So I'll send you the action points from this meeting.

[03:24:29] nataliamotand: Thanks again for all the patience and the time dedicated to this.

[03:24:50] Customer: Thank you too for working on this project and immersing yourself so deeply in the development.

[03:24:50] Customer: You're very attentive to details, and I value that.

[03:24:50] Customer: Thank you.

[03:25:07] nataliamotand: Thanks.

[03:25:10] Customer: And thank you for your patience; good luck with the assignment.

[03:25:16] Customer: Have a nice weekend then.

[03:25:20] nataliamotand: You too, have a great Sunday, and we'll be in touch.

[03:25:20] nataliamotand: See you.

[03:25:26] Customer: Thank you, goodbye.
