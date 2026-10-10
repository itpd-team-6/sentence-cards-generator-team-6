# Week 2 validation meeting transcript

- **Date:** 2026-10-09
- **Participants:** nataliamotand, emapfff, Customer

The recording starts at the opening of the call, so the permission questions are on it.
The recording was split in two at 00:30:00 to be transcribed, and a few words are lost at that point, marked `[inaudible]`.
The transcript was produced with an AI transcription tool from the recording; a team member listened again to the passages the tool could not make out (see `ai-usage.md`).
Each line carries the start time of the turn it belongs to.

[00:00:03] nataliamotand: I would like to say I'm sorry in advance again because I had sent this message around like 7pm in the group but it was the developers group so you couldn't receive it and as soon as I noticed my mistake I sent in the other group so I'm so sorry about that.

[00:00:30] Customer: Okay, anyway thanks for organizing this meeting in advance.

[00:00:30] Customer: I hope you can hear me well this time.

[00:00:39] nataliamotand: Yes, yes, it's a good audio.

[00:00:44] Customer: Great, yeah and I think we can start.

[00:00:50] nataliamotand: Okay, I'm just gonna ask the same questions I did last time.

[00:00:50] nataliamotand: I would like firstly to thank for your time.

[00:00:50] nataliamotand: The main idea was to try to keep this meeting in like 30 or 45 minutes so we don't take too much of your time and our colleague AbdelrahmanAbdel-Aal he couldn't join today so emapfff will take the notes and I'll be the interviewer and I'd like to ask you the questions I mentioned about the recording so may we record this meeting with the calls automatic recording and a backup one in emapfff's computer?

[00:01:33] Customer: Yes, sure.

[00:01:35] nataliamotand: And can we also publish the sanitized transcript of our repository?

[00:01:41] Customer: Yes.

[00:01:43] nataliamotand: Okay, thank you.

[00:01:43] nataliamotand: I would like to shortly update you on the three things we kind of got from last week's kickoff.

[00:01:43] nataliamotand: So the first one about sentence quality.

[00:01:43] nataliamotand: I'd like to say that we tested one free model and around like 20 common words in each of the three languages German, English, and Russian and we used an AI judge and that AI judge flagged only 4 of 60 of the generated sentences about the native aspect of the sentences.

[00:01:43] nataliamotand: If it sounds natural that was something that you mentioned previously.

[00:01:43] nataliamotand: And the second thing about the Anki repositioning.

[00:01:43] nataliamotand: So AbdelrahmanAbdel-Aal moved the words from one text to the front of an Anki deck and he timed it and took about 55 seconds in one measurement.

[00:01:43] nataliamotand: We wanted to do another one to have full evidence of it and we will share with you as soon as we get it.

[00:01:43] nataliamotand: And also third about forums.

[00:01:43] nataliamotand: So emapfff took a quick look at the learners who moved their reviews from Anki to another app and he didn't find any of them.

[00:01:43] nataliamotand: But on LingQ forums some learners dropped or cut down Anki because of the daily review load and not because they wanted to review somewhere else.

[00:01:43] nataliamotand: So this is one of the assumptions that we mentioned in our previous assignment and this is where we are on these three.

[00:01:43] nataliamotand: And I'd like also to ask you some follow-up questions about the catalogue.

[00:01:43] nataliamotand: Is that okay?

[00:01:43] nataliamotand: The first one is if the catalogue it mentions a teacher who connects with the students and review cards.

[00:01:43] nataliamotand: And I was wondering exactly what this means to you.

[00:01:43] nataliamotand: Like you would like a separate teacher review or the teacher editing the learners on cards.

[00:01:43] nataliamotand: Did you think of anything in this pipeline specifically about the connection between the teacher and the students on the app?

[00:04:19] Customer: Right.

[00:04:19] Customer: So the teacher is the judge of the cards and they may need to review multiple cards.

[00:04:19] Customer: Like maybe a couple of hundreds of cards at the same time.

[00:04:19] Customer: So I assume the teachers will usually work from their laptops, from computers, not from smartphones.

[00:04:19] Customer: So they will probably use a desktop version of the app.

[00:04:19] Customer: And I also assume that teacher's version, desktop version of the app will be very similar to the students one.

[00:04:19] Customer: And it will have it will allow quick review of the cards.

[00:04:19] Customer: So this is like the goal.

[00:04:19] Customer: To review multiple cards, to edit them, to mark them as bad, subject for regeneration.

[00:04:19] Customer: Maybe to listen to the sound.

[00:04:19] Customer: Maybe write some follow-up questions or some hints for the LLM so that it generates better cards.

[00:04:19] Customer: And all of that should be doable with at least effort.

[00:05:47] emapfff: Okay.

[00:05:47] nataliamotand: So just to make sure I got it right.

[00:05:47] nataliamotand: The main idea is for us to have two separate views.

[00:05:47] nataliamotand: One for the teacher where he can do all of this.

[00:05:47] nataliamotand: Like flagging the sentences or making comments about it.

[00:05:47] nataliamotand: About the comments.

[00:05:47] nataliamotand: It was something that we were unaware about last week.

[00:05:47] nataliamotand: But it's important for you to like make comments or observations on each sentence specifically.

[00:06:18] Customer: Yes.

[00:06:18] Customer: Maybe a better option is to let them edit the context surrounding the word.

[00:06:18] Customer: So I assume that when a card is generated, the prompt provides the sentence or like larger surrounding context for a word.

[00:06:18] Customer: So that LLM knows with which meaning to use the word in the generated sentence.

[00:06:18] Customer: So maybe we should let the teacher like edit this context.

[00:06:18] Customer: Or we, I don't know.

[00:06:18] Customer: Or maybe we should make this context read only.

[00:06:18] Customer: Because it was like it was stated in the text.

[00:06:18] Customer: Not sure about this design.

[00:06:18] Customer: But maybe if it's necessary to guide the LLM generation, if it can't, if it consistently can't generate like appropriate sentences, there should be a way to give it some hints.

[00:06:18] Customer: Either through the context surrounding the word or through an additional comment.

[00:06:18] Customer: Like use this word with this meaning.

[00:06:18] Customer: Something like this.

[00:06:18] Customer: And yeah, there is also a short way.

[00:06:18] Customer: Like just drop this word and add some text where this word is used with the right meaning.

[00:06:18] Customer: I'm not sure like which one is more UX-friendly, user-friendly.

[00:06:18] Customer: And so this is subject to discussion.

[00:08:16] nataliamotand: Okay.

[00:08:16] nataliamotand: Thanks for sharing.

[00:08:16] nataliamotand: I think that's something we can refine it so we can understand what's best vision coming in the following weeks.

[00:08:16] nataliamotand: We have put together a prototype that I will always show, also show, sorry, also showing this meeting.

[00:08:16] nataliamotand: And I think it will be a little clear.

[00:08:16] nataliamotand: The prototype doesn't cover student and teacher's views.

[00:08:16] nataliamotand: But it's for us to understand something about what you're thinking.

[00:08:16] nataliamotand: I'll just finish two more questions that I have about follow-up from the other meeting and I'll show it's the prototype to you.

[00:08:16] nataliamotand: And I believe that will be clear.

[00:08:16] nataliamotand: So following, after editor and, sorry, were you saying something?

[00:09:15] Customer: Please continue.

[00:09:15] Customer: Please continue.

[00:09:17] nataliamotand: Okay.

[00:09:17] nataliamotand: Thank you.

[00:09:17] nataliamotand: So after the editor and reprioritizing words, I was wondering which comes first to you, the teacher review or the three interface languages?

[00:09:17] nataliamotand: I can assume that after this conversation, it will be the teacher review that's most important and then the three interface languages.

[00:09:41] Customer: Yes, I agree with this order.

[00:09:46] nataliamotand: Okay.

[00:09:46] nataliamotand: So next question is about where should the product run?

[00:09:46] nataliamotand: I was wondering if maybe we should have a VPS or it should run in the learner's own machine?

[00:10:08] Customer: Well, this is up to the learner.

[00:10:08] Customer: Basically, the server will store the data, the accounts, and the learner will just connect to the server.

[00:10:08] Customer: So is your question about your specific deployment case or, like, where should you host it?

[00:10:08] Customer: Or is it about the user, like, where they should host it?

[00:10:42] nataliamotand: I think, like, should we have a virtual private server?

[00:10:42] nataliamotand: I think it's more about the hosting option of the application.

[00:10:42] nataliamotand: If you have any thoughts about it, something that you can prefer or something that you were already thinking of, or if we can just choose from what we believe is best for the application?

[00:11:09] Customer: It should be hostable locally in the local machine or a VPS, and it should be self-hostable, so provide some clear instructions on how to host it.

[00:11:09] Customer: The instructions should be checked ideally, like, whether they work.

[00:11:09] Customer: And this is aligned with the open-source nature of the product, so it's up to the user to decide how to host it.

[00:11:09] Customer: But, yeah, at least they should be able to host it on their local machine so that, like, no data is sent anywhere.

[00:11:51] nataliamotand: Okay.

[00:11:51] nataliamotand: So, moving forward, I mentioned previously that moving the words from one text to the front of the Anki deck took us about 55 seconds once.

[00:11:51] nataliamotand: I was wondering if this cost is something that you would accept, and what would you still miss?

[00:12:16] Customer: I don't quite get the question.

[00:12:16] Customer: Not the question, like, but the context.

[00:12:16] Customer: What does take 55 seconds?

[00:12:26] nataliamotand: Like, moving, we were wondering about efficiency and what brought us to this, were there other alternatives that we tried?

[00:12:26] nataliamotand: And we were wondering about, like, trade-off options, like, we timed it and it took, like, 55 seconds to kind of change the priority, like, which words would you revise first, and these kinds of things.

[00:12:26] nataliamotand: And we were wondering, like, for the queue list in our application, where the students will also be able to choose which words will he review next, if this would be an acceptable time, or is it still something that you would miss?

[00:13:16] Customer: So, it's one minute to reorder the cards, or the words.

[00:13:16] Customer: I think I should see that and then decide.

[00:13:16] Customer: I don't quite get what's happening there.

[00:13:16] Customer: So, if I assume that, like, there are some words, like, a list of words on the page, then clicking a word and then dragging its card, like, upwards or downwards, should not take 55 seconds.

[00:13:16] Customer: So, I don't really understand what your interface is.

[00:13:16] Customer: So, I'd like to...

[00:14:08] nataliamotand: Maybe for, like, next meetings, we could arrange, like, an example to make the question clearer.

[00:14:08] nataliamotand: I don't think, if we don't have the answer to this right now, it will impact too much between this week and the next.

[00:14:08] nataliamotand: So, I'll get back to you about this.

[00:14:08] nataliamotand: Is that okay with you?

[00:14:30] Customer: Yes.

[00:14:32] nataliamotand: Okay.

[00:14:32] nataliamotand: About the follow-up questions, that's it.

[00:14:32] nataliamotand: Thank you.

[00:14:32] nataliamotand: I'd like to share my screen now, and show you the prototype.

[00:14:42] Customer: Okay.

[00:14:49] emapfff: Just a minute.

[00:14:59] nataliamotand: Can you see my screen?

[00:15:02] Customer: Yep.

[00:15:04] nataliamotand: Okay.

[00:15:04] nataliamotand: So, this is a clickable page.

[00:15:04] nataliamotand: It's made with HTML, with mock data.

[00:15:04] nataliamotand: So, the idea is that a learner has pasted a German text and marked six words in another interface that's not the focus here, but just so you have some context about where these words came from.

[00:15:04] nataliamotand: And each word has a generated sentence in the translation, and the learner here can edit them, flag, regenerate, or confirm each row.

[00:15:04] nataliamotand: So, nothing here is real in code yet, it's just a visual example, so you understand what we're talking about.

[00:15:04] nataliamotand: The vision is not too good because my screen is kind of parted into other screens.

[00:15:04] nataliamotand: So, I'll pass it really quick, so you can take a look at everything in this page, and I can ask you about the question that I prepared previously.

[00:15:04] nataliamotand: Can you see the table here, and the options for actions?

[00:16:19] Customer: Yeah, I do see the table.

[00:16:23] nataliamotand: So, in this first mode...

[00:16:26] Customer: Yeah, in this case, I don't see the buttons when I see the cards.

[00:16:26] Customer: And I don't see the cards when I see the buttons.

[00:16:26] Customer: So, either the screen should be wider for a teacher, or the buttons should be located in some other way.

[00:16:52] nataliamotand: Okay, I think it's because the screen in my computer is not full, but if you open this HTML in a laptop, you can see all of the tables at once, but I understand what you're talking about.

[00:16:52] nataliamotand: We'll make sure that it's entirely visual when the teacher or the learner is visualizing this table.

[00:16:52] nataliamotand: So, the first question is a hypothetical example.

[00:16:52] nataliamotand: So, a learner has pasted a text and came up with these six sentences, and one of them feels unnatural to them.

[00:16:52] nataliamotand: I was wondering, in your vision, what would you do first, and at what moment would you want a card to exist from each word?

[00:16:52] nataliamotand: So, the first option is that you, as soon as you select the words, you don't quite create the cards yet.

[00:16:52] nataliamotand: They come to a parallel table where you can revise them before actually creating the cards.

[00:16:52] nataliamotand: So, it would be this first mode that you're seeing on the screen, and this is one way.

[00:16:52] nataliamotand: So, no cards exist until the learner confirms its sentences, and there's also this other way where all cards exist at once, as soon as you select the words from the text you pasted, and only the flagged ones wait for review.

[00:16:52] nataliamotand: So, all of the cards are already created, and the student or teacher can just create here and edit the cards, or maybe flag it, so it calls for attention about specifically one word, or maybe regenerate it.

[00:16:52] nataliamotand: And the main objective of this prototype is for you to express your opinion about which mode is most aligned with what you would expect from the application, and which one would you use for your own deck?

[00:16:52] nataliamotand: And if you can share with us the reason for this, it would also be great for which one would you choose and why.

[00:19:21] Customer: Thank you.

[00:19:21] Customer: Okay, let's switch to the mode one first.

[00:19:21] Customer: Okay, in this mode, this mode has a has confirm button, and the second one didn't have it.

[00:19:21] Customer: So, what does it do?

[00:19:44] nataliamotand: You can, like the cards are not created yet, and you have to confirm, and once you confirm the cards you can create in your review deck, so you can actually access them.

[00:19:44] nataliamotand: This is the first option, so you can create the card, and it's ready for you to study.

[00:19:44] nataliamotand: So, the status changed, and the second option is those cards are already created, so they will be on your revision queue, and you can just edit them, or regenerate, or flag.

[00:20:19] Customer: Okay, so, but I still need to see the cards to confirm, or edit, or flag.

[00:20:19] Customer: So, in mode one, the cards are also generated as soon as I input the text, and ask to generate cards.

[00:20:44] nataliamotand: Yes, the main pipeline is this, like the student will paste the text, select which words does he want to practice, and it will generate automatically the sentences, and in the first option, those sentences are not yet ready for the students to revise them, and in the second option, they fall on the revision queue.

[00:20:44] nataliamotand: Is this your question?

[00:20:44] nataliamotand: If I'm not answering, you can stop me at any time, and I'll try to explain.

[00:21:23] Customer: I think you answered my question.

[00:21:23] Customer: So, the sentences were generated, and the student has to click confirm buttons to select a subset of cards that they approve of.

[00:21:23] Customer: Yes, and this data will be used to generate cards.

[00:21:23] Customer: Yeah, exactly.

[00:21:46] nataliamotand: And in the second option, the student...

[00:21:50] Customer: So, the first option has a flaw, I guess.

[00:21:50] Customer: So, as you mentioned, the LLM that you tried generated 56 normal sentences, and 4 bad sentences, or unnaturally sounding, or something like this.

[00:21:50] Customer: So, it will be very tedious to confirm each card, because most of them will be all right.

[00:21:50] Customer: So, this confirm should better be like reversed, like disapprove or something, or unselect, but then this option will look very much like the second mode, except in the second mode, we assume that all words selected in the text will produce cards, like at the end.

[00:21:50] Customer: And in the first mode, we can still filter out some words if I understand correctly.

[00:21:50] Customer: So, I'm more inclined towards the second mode.

[00:21:50] Customer: So, first, the student selects the words in the text, and we assume they are sure about these words, that they want to learn them.

[00:21:50] Customer: And so, we need to generate cards for all of these words.

[00:23:30] nataliamotand: Okay, so just to make sure I understand, you believe that it's best for the user to have all the cards already created, and he can specifically, in case he doesn't like a sentence, he can decide what to do with it with the buttons that we already have, or maybe you would like to have a delete button for the line of the table?

[00:24:02] Customer: Yes, the delete button will be very useful and convenient.

[00:24:02] Customer: Yeah, and then basically it will be like mode one, where confirm is replaced with delete.

[00:24:02] Customer: So, you will still be able to learn a subset of words.

[00:24:02] Customer: Okay, so we don't assume that the user wants to learn, or we assume that initially the user wants to learn all of the words that they selected in the text.

[00:24:02] Customer: But we also assume that the user may later want to learn a subset of those words.

[00:24:02] Customer: So, they should be able to delete the cards, generated cards, and so we need the delete button.

[00:25:01] nataliamotand: Okay, I understood.

[00:25:01] nataliamotand: Thanks for sharing your opinion.

[00:25:01] nataliamotand: And moving forward with the prototype, there's also another...

[00:25:01] nataliamotand: I forgot the English word for this, but it's also a different part that you mentioned previously, and it's also mentioned in the context.

[00:25:01] nataliamotand: That is about a reprioritization of which cards will the student see first.

[00:25:01] nataliamotand: That is the student's queue, so he can choose from which text it's more important to him to learn the words first.

[00:25:01] nataliamotand: And this is the thing that we wanted to show you.

[00:25:01] nataliamotand: And so the question is, if a learner moves all the words from one text to the front of the study queue, should words they already studied move to?

[00:25:01] nataliamotand: And what do you think should happen to the review history?

[00:25:01] nataliamotand: To show you what we were thinking of, we have like a word queue here, and we kind of could order it from what's most important to the student.

[00:25:01] nataliamotand: So, if he's reading a book and he has a sentence that he would like to review first, he could choose this, for example, text C with the words, and he could move to appear before in the study slash review queue, and that's it.

[00:25:01] nataliamotand: So, to repeat the question, what would you want to happen to the review history if the student decides to reorder it?

[00:26:49] Customer: So, each text reduces the number of cards, right, and each card has a review history.

[00:26:49] Customer: Okay, if you move some text to the top, then the associated cards will also appear earlier in the review queue, right?

[00:27:20] emapfff: Yes.

[00:27:24] Customer: Okay, then if some cards associated with this text are new, then they will be shown in the next review session instead of the cards associated with later texts.

[00:27:24] Customer: But if they're not new, then they will be revealed, like, as scheduled by the scheduler.

[00:27:24] Customer: I think this order is independent.

[00:27:24] Customer: I mean, the scheduled time is independent from where the card appears in the deck in the Anki app, but I'm not sure.

[00:27:24] Customer: So, I assume that the progress is recorded for each card, but then the cards for today's review are chosen in the order they appear inside the deck.

[00:27:24] Customer: So, this review queue is, like, a deck, and by reordering the text, you just reorder associated cards inside that deck.

[00:27:24] Customer: And so, today's review will get some new cards or some cards to review, previously learned cards, and the scheduler will then decide, like, when to show them inside that session and record the progress.

[00:29:12] nataliamotand: Okay.

[00:29:14] Customer: Did I answer the question?

[00:29:17] nataliamotand: Yes, you did.

[00:29:17] nataliamotand: Thanks for the answer.

[00:29:17] nataliamotand: So, that's it for the prototype.

[00:29:17] nataliamotand: I would now like to go through the boundaries that we came up with earlier this week.

[00:29:17] nataliamotand: So, do you still see my screen?

[00:29:38] Customer: Yes, I do.

[00:29:40] nataliamotand: Okay.

[00:29:40] nataliamotand: So, this is the list of the things that we decided not to build, and I'd like to quickly go through them with you.

[00:29:40] nataliamotand: Number one is about audio for the words and sentences.

[00:29:40] nataliamotand: Number two is about importing an Anki or keeping the product in sync [inaudible].

[00:30:00] nataliamotand: The Anki collection, the third is fetching texts from video streaming services or ebooks, and the fourth is training or hosting our own language model.

[00:30:00] nataliamotand: So is there anything on this list of things that we will not build but you need before the end of the course?

[00:30:00] nataliamotand: Maybe?

[00:30:00] nataliamotand: Do you disagree with any of the boundaries that we came up with?

[00:30:28] Customer: Let me have a look at boundary one.

[00:30:32] nataliamotand: Okay.

[00:30:35] Customer: Produce audio for the words and sentences.

[00:30:35] Customer: So what does it mean exactly?

[00:30:52] nataliamotand: It means that in this application it would not produce audio versions of each of the sentences it's not covered in the context and we were unsure that it was the most important thing about this application for you, the audio part, especially because it's covered and it would be an extra rather than a differentiator.

[00:30:52] nataliamotand: So we were wondering about this, how important it is for the product idea that you have.

[00:31:34] Customer: Okay so listening to an audio during a review is like very important rather than being able to read the sentence.

[00:31:34] Customer: Basically you use two of your senses, vision and hearing to perceive language.

[00:31:34] Customer: So while your service may not be responsible for generating the audio, it should somehow fetch it from somewhere.

[00:31:34] Customer: Maybe there should be some API that produces audio.

[00:31:34] Customer: Anyway, each card should have the audio for the word and for the sentence.

[00:31:34] Customer: Moreover, when the user reviews a card, the audio for the sentence should be played automatically.

[00:31:34] Customer: Sometimes cards are reviewed on the go and it's not very convenient to read the sentence because in cold times you need to hold the phone outside of your pocket and it's pretty cold, not very convenient.

[00:31:34] Customer: But if you hold it inside the pocket then you can't read the sentence so you just rely on the audio.

[00:33:24] nataliamotand: Okay, thanks for the clarification.

[00:33:24] nataliamotand: Sorry for interrupting, you can continue.

[00:33:32] Customer: Okay, so boundary two, import cards from Anki or keep the product in sync with an Anki collection.

[00:33:32] Customer: Yeah, I think our app can be independent from Anki, can just take some inspiration from it.

[00:33:32] Customer: So yeah, that's all right, no import needed and syncs too.

[00:33:32] Customer: Okay, boundary three, fetch texts from video streaming services or ebooks.

[00:33:32] Customer: Yeah, for now, yes.

[00:33:32] Customer: I mean for this project, yes.

[00:33:32] Customer: Like as a future plan may be convenient to let the user put a link to a video and get a transcript of the video.

[00:33:32] Customer: But for now, okay, we don't implement this.

[00:33:32] Customer: Boundary four, train or host a language model.

[00:33:32] Customer: Okay, so yeah, you're not responsible for training a language model on your own.

[00:33:32] Customer: Of course, the request from the app may be used for training the model but it's done by someone else so it's not the responsibility of your app.

[00:33:32] Customer: I agree.

[00:35:08] nataliamotand: Okay, that's it for the boundaries.

[00:35:08] nataliamotand: Thank you for clarifying.

[00:35:08] nataliamotand: We will adjust the boundary one so it covers that we won't produce the audio on the application but it is important to have the audios for each word and sentence that the student will have access to in the application.

[00:35:08] nataliamotand: So that was very clarifying and I'd like to move on to the minimal usable product.

[00:35:08] nataliamotand: So we have created some user stories that we would like to go by with you and I'll just quickly read the titles for them.

[00:35:08] nataliamotand: The first one is the user gets a sentence and translation for each word I mark in a text.

[00:35:08] nataliamotand: The second one is check the sentence written for a word.

[00:35:08] nataliamotand: Third one is study my cards inside the product.

[00:35:08] nataliamotand: And that's it for the main issues that we have opened to guide the minimal usable product.

[00:35:08] nataliamotand: So this is the smallest version of the application we think a learner could really use and the core text is a learner turns the words they do not know in a text they paste into cards with sentences that they have checked and studies them in the product.

[00:35:08] nataliamotand: It needs these three user stories and these are for now the user stories that we have.

[00:35:08] nataliamotand: The candidate uses these three and the other ones we also have but are lowered priority.

[00:35:08] nataliamotand: The question about this is if the learner could only turn the words they do not know into a pasted text into cards with sentences they have checked and to study those sentences in the product could they finish their job without getting stuck and which story would you move into or out of the candidate?

[00:35:08] nataliamotand: I can show it to you.

[00:35:08] nataliamotand: Firstly, did you understand the question?

[00:35:08] nataliamotand: Would you like me to repeat it?

[00:37:24] Customer: Yeah, could you please repeat it or reformulate it?

[00:37:30] nataliamotand: About the user stories we were wondering if these three that I said to you, I will repeat them so you have the full picture.

[00:37:41] Customer: Sorry, could you please scroll the page so that I see the stories, the story titles again?

[00:37:56] nataliamotand: And about the question I was wondering if these three user stories could the student finish their job without getting stuck, the main job I mean, and which story would you move into or out of the candidate?

[00:37:56] nataliamotand: Are those three enough for the minimum viable product or do you have any other consideration about the other user stories?

[00:38:29] Customer: Study my cards inside the product.

[00:38:29] Customer: Okay, no I think this combination of user stories produces an end-to-end task so I assume the user can upload a text and review sentences written for a word and then study the cards.

[00:38:29] Customer: So I would not move anything outside of this candidate and I don't think I would move anything inside it right now.

[00:39:24] nataliamotand: Okay, so I'll stop sharing my screen now.

[00:39:24] nataliamotand: This is what we had planned for the meeting today and I would like to thank you and we will write down the decisions that came up from this meeting in the action points and send them to you by message right after the meeting is finished so you can confirm or correct them.

[00:39:24] nataliamotand: But the audio was much better and I think the conversation really flowed so I guess it was a good meeting and do you have anything else you'd like to ask about what was shown here?

[00:40:15] Customer: Not really.

[00:40:15] Customer: Yeah, this meeting was pretty thorough.

[00:40:15] Customer: Yeah, we could have dived into more details but I think I should let you drive the meetings on your own because your students need to study how to conduct them and what to ask about and whatnot.

[00:40:15] Customer: So yeah, okay, thank you for organizing this meeting.

[00:40:15] Customer: Yeah, thank you for working on the product.

[00:40:56] nataliamotand: Thank you so much and again, I'd like to say I'm sorry about the delay the link sent because it was my mistake but I'll make sure that doesn't happen again and now since it was good meeting I think I will also try to keep them hosted in this platform, the Kontur Talk.

[00:40:56] nataliamotand: Is that okay with you?

[00:41:20] Customer: Yes, definitely.

[00:41:23] nataliamotand: Okay, so emapfff, would you like to add anything or is everything covered by you?

[00:41:30] emapfff: No, no.

[00:41:33] nataliamotand: Great, so thank you both for the time.

[00:41:33] nataliamotand: Thank you, [redacted], and I will send you in the group chat the meeting report after we have it sanitized and have a great weekend.

[00:41:47] emapfff: Yes, okay.

[00:41:48] Customer: Thank you, nataliamotand.

[00:41:48] Customer: Thank you, emapfff.

[00:41:48] Customer: Thank you.

[00:41:48] Customer: Have a nice evening and the weekend.

[00:41:48] Customer: Goodbye.

[00:41:55] emapfff: Bye.
