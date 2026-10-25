# Week 4 validation meeting transcript

- **Date:** 2026-10-23
- **Participants:** nataliamotand, AbdelrahmanAbdel-Aal, emapfff, Customer

The Customer gave permission to record the meeting, with a backup recording on one team member's computer, and to publish the sanitized transcript in this repository; the recording had already started when this was asked, so the question and the answers are in this transcript at [00:05:08] to [00:05:29].
The Customer was not asked whether the recording may be shared privately with the instructors.
The transcript was produced with a speech-to-text tool run on the team's own computer from the recording, and the team then corrected it (see `ai-usage.md`).
The tool did not mark who was speaking, so the speaker of each turn was assigned from the content of the turns; a turn that starts or ends a few words away from the stamped time can be off by a few seconds.
A short exchange about how the team divides its work, from about 02:03:25 to 02:05:00, was left out of this transcript; it is on the recording.
Filler words and false starts were removed, punctuation was added, and words the tool misheard were corrected from context, including the German words.
`[inaudible]` marks speech that could not be made out.
The times are those of the recording file; the first speech on it is at 00:01:21.
Each line carries the start time of the first sentence of the turn.

[00:01:21] nataliamotand: Can you hear me? I can't hear you.

[00:01:39] nataliamotand: Okay, can you hear me?

[00:01:42] Customer: Okay, now I can.

[00:01:44] nataliamotand: Great.

[00:01:50] Customer: Sorry for being a bit late.

[00:01:54] nataliamotand: Oh, no problem. I am sending a quick text to the other teammates to make sure that they will join. But I think so. And if they don't join by eight and five, we can get started without them.

[00:02:15] Customer: No problem.

[00:03:11] nataliamotand: Hi, guys. And he just texted that his connection is not so good. So maybe we can start without him, and he can join as soon as it stabilizes.

[00:03:32] Customer: Okay.

[00:03:43] nataliamotand: So we can start this meeting. First, thank you for your time. As in the previous meetings, I will moderate and share my screen, and AbdelrahmanAbdel-Aal and emapfff will take notes and observe. We planned to have 45 minutes for questions, following the script that we sent in the group chat, but maybe it extends to one hour. Is that okay with you?

[00:04:17] Customer: Yeah.

[00:04:19] nataliamotand: Okay. Let's put the limit at one hour, so that it doesn't become three and a half hours. I'm so sorry about that. But thank you again for the time that you dedicated to the meeting. Most of the decisions that we agreed on in the last meeting were implemented. Two of them I'll go through, but they are going to be postponed to sprint five: the decks, if I'm not mistaken, and [inaudible], and being able to request more cards for the day. But I will go through this point with you later in this meeting.

[00:05:08] nataliamotand: So before we start, I would like to ask if we can record this meeting and have a backup recording on one of the members' computers.

[00:05:20] Customer: Yes, sure. You may record this meeting.

[00:05:24] nataliamotand: Okay. Can we also publish a sanitized transcript in our repository?

[00:05:29] Customer: Yeah, sure.

[00:05:31] nataliamotand: Okay. So now, a short update on the action points from last week, where we are going to say plainly what we did and what we couldn't do. We sent you some of the changes to the decisions of the last meeting and you agreed by chat. We rewrote the acceptance criterion three of user story one, and we built it, and we will show you in the next part of the meeting. We also sent two other color options and you chose option two, the blue color. It's already applied to the product. We also tried both ways of selecting several words and shared them with you by chat, and we applied the one that you chose: the learner holds the Shift key and clicks the words that he wants to add to one card. And emapfff found some options for where the audio of the cards can come from, three of them, and they are in our repository. We will also show them to you. And this is the status of our action points from the last meeting. So I guess this is all that we had agreed on. So everything was met, and we will show it to you later in this meeting.

[00:07:00] nataliamotand: So I would like to share my screen and go through user story one. It was the only user story that we showed you that was rejected, because of one of the acceptance criteria, for which you suggested a change, and we did it. I'll just show it to you again.

[00:07:25] Customer: Okay.

[00:07:27] nataliamotand: Please let me know when you can see my screen.

[00:07:32] Customer: I don't see it now. Okay, now I see it.

[00:07:36] nataliamotand: So, about user story one. It says that we get a sentence and a translation for each word I mark in a text. And I said previously that you rejected it because of acceptance criterion three. The new acceptance criterion has changed, and I'll go through all the acceptance criteria again so you can recheck them. The changed one is the one about the model not answering: we request again to the model when it didn't give a sentence right away, and it would be automatic up to a certain point. And once that limit was reached, the card would be created blank and it would show a message. So this is the one that we changed. But I'll go through all of them again really quickly, so you can confirm that they are functional. If we don't click any of the words and ask for sentences, we get an error mark here. This is acceptance criterion two.

[00:09:15] Customer: Okay, I did see the mark.

[00:09:21] nataliamotand: Now, with the languages selected and words also chosen, we see here that it didn't create the cards. I guess there is a problem again. I attempted again to generate the cards. [inaudible] the video was in front, but I'll try it again.

[00:10:04] Customer: No problem here. So I mean, yeah, I saw this banner, or however to call it. But my question is about the internals. So did it attempt to generate sentences again, or not?

[00:10:36] nataliamotand: It's configured to attempt again. I was trying to show acceptance criterion one, where it should have worked, so I'm not quite sure why it didn't. But the model is configured: when I tested it, it tried for 19 seconds, and when it didn't work, it showed the message. So I'm not quite sure why this happened. I'm so sorry. The logic is there and the message is visible.

[00:11:10] Customer: Okay.

[00:11:16] nataliamotand: So this idea is correct, right? The model just tries again, and when it isn't able to generate the sentence in the time span that we set, it should show a message, exactly like it's happening right now. Right?

[00:11:34] Customer: You're almost right. So how many times does it try again to generate sentences?

[00:11:43] nataliamotand: It should try five times. When I timed it, it took about 20 seconds of making the request again. [inaudible] Yes, it requests the model again up to five times, and when it doesn't answer, it shows an error text.

[00:12:14] Customer: Okay. Sounds reasonable. Let's keep it like this.

[00:12:23] nataliamotand: Okay. So I'm trying to connect to my VPN to show you the acceptance criterion that actually generates the sentences. My connection is not so good, so it might take a little while.

[00:13:34] Customer: Also, whether you can make a request to the API at all, outside of the application.

[00:13:47] nataliamotand: There is no problem, the card is created. I guess the problem here, and also a question for you, is that all cards, no matter how many words I choose, are created at the same time. As you can see here, the three of them were created at the same time. So there is no way to tell which ones the model has already created. So if you can share your opinion: do you think it's good to have that, because then the user can see the progress in which his cards are being created, or maybe you think that's not relevant there?

[00:14:34] Customer: It's okay the way it is.

[00:14:36] nataliamotand: Did you understand the question?

[00:14:43] Customer: Not exactly. So, last time we agreed that every card has a unique identifier.

[00:14:53] nataliamotand: Yes.

[00:14:55] Customer: And so how does the history not know which cards were generated?

[00:15:04] nataliamotand: So the identifiers, this is one of the things that we implemented, like a spoiler: we have the word and we have the short context phrase. I'll show it to you later. But the question that I made is about the progress of the creation of the cards. For example, when we select more than one card to be created, the cards are not displayed as they are created. We have to wait for the LLM to finish all the cards, and then they are shown at the same time. My question is whether that's an okay way to show the cards, or maybe we should show them as soon as they are created and not have to wait for all of them to be created.

[00:15:57] Customer: Thank you for explaining. It's okay if cards from a single batch are shown at the same time. I assume that the text may contain hundreds of selected words in some cases, and so I'm not sure if it's okay to generate the cards in one batch, so sending all the hundreds of selected words in one batch. I assume it would be better to send them in several batches with some limit, for example 20 words together, or 50. So if the cards arrive in a single batch, it's okay to wait for them, but batches would be generated independently of each other and arrive at different times. No need to wait for all batches.

[00:17:15] nataliamotand: That answers the question. Thank you. And so we went through the three acceptance criteria in user story one, and I was wondering if you accepted or rejected. If you want, I can share these three acceptance criteria. Given the text in Russian, [inaudible] among the words, [inaudible] shown with one sentence in the text language that contains that word, its translation to my first language.

[00:17:59] Customer: Yeah, maybe it could have been clarified that I have selected my first language in the settings, but it's okay. I mean, it doesn't know by default what my first language is.

[00:18:20] nataliamotand: No, you have to set it here when you choose.

[00:18:25] Customer: Yeah. Okay, anyway, this one did work, when we choose the right pair of languages.

[00:18:37] nataliamotand: Okay, so we can move on now to user story four, which is "study the words of one text first". This is the story you asked for in the last meeting. So I'm going to show it to you here.

[00:18:55] Customer: [inaudible] a different question. So what happens if some sentences from a batch are invalid and some are valid?

[00:19:17] nataliamotand: Do you mean invalid, like how the [inaudible] creates the sentence that is too long, for example, or too short? So as we have it right now, there's a limiter, if I'm not mistaken, you can correct me if I am, but the songs2anki has kind of a limiter on the size of the sentence. Here we have the same thing. From all the tests that I made, the LLM didn't generate a sentence that couldn't fit the page, for example, or anything like that. It usually generates sentences that follow this pattern: they are complete sentences, but not as long as a paragraph, you know. So it's not being generated that way. Did I answer your question, or was it something different that you were wondering?

[00:20:23] Customer: Yeah, you answered it. But now I have one more question. So there is a lower bound and an upper bound on the length of a sentence that must be generated, so that all sentences have approximately the same length and can be studied in approximately the same time. The time of reading new cards is more or less predictable.

[00:20:56] nataliamotand: Okay.

[00:20:58] Customer: So if you send three words, for example Bahnhof, Tasche and [inaudible], to the LLM, and it generates sentences that don't fit these limits, so a sentence is longer than 70 characters, for example 80 characters, what happens to that sentence? Do you mark it as invalid, like blank, and then ask again in the next request to generate a new sentence, or what?

[00:21:44] nataliamotand: It won't be displayed, so I guess it will come empty. But when we connect to the LLM, we pass the request with the constraints, I forgot the word in English, so that it generates a sentence that follows the criteria that we asked for. So I wouldn't know. The only times that a sentence came blank were because of the internet or VPN connection, or maybe, in a Russian word, it couldn't generate right. So I am not sure if there would be a different kind of error message saying that the generated sentence was invalid and therefore wasn't displayed. There's no such thing displayed for the user, this doesn't happen. So I guess it would just come blank, but I haven't encountered this problem yet. I guess the LLM just follows the instructions that we have been passing to it.

[00:22:54] Customer: Yeah, I have just encountered this problem: the sentences were too short, too simple. So I wanted them to fit between 16 and 70 characters. What I learned from this is that you can't trust an LLM, you have to validate everything it sends back. So if the Python code noticed that the incoming sentences were too short, then it composed a new request and sent it again for the same words. So it treated them like blank, basically, like cards that don't have sentences.

[00:23:42] nataliamotand: So your main concern here is about the quality of the sentences that are being generated, and you are proposing that we make sure there is a minimum and a maximum length that a sentence can have. Is that the issue that you're bringing up here?

[00:24:04] Customer: Yeah, that's what I suggest. That's what I'd like to have in the service.

[00:24:15] nataliamotand: Okay, I'll make sure that this enters the action points that we have. We'll make sure that when any of these cases happens, the sentence generated is blank, so it will follow the rule that we already have, regenerating until a certain limit. And this will be documented in the project. So you have no worries about the quality of the sentences that are being generated.

[00:24:43] Customer: Okay.

[00:24:46] nataliamotand: Moving forward to the user story about the reprioritization of the cards that you're going to study. So this is the study order. As you can see, it's a bit different from the last meeting. Some of the things that you had requested we implemented, such as moving the cards in a drag way and adjusting the due date. I'll show it to you. So these are the cards that are due today, the cards that are going to show up when we start a session here. And we also have marks for which text these cards originated from. So here we have a selection by checkbox, and we can see from which text, and, for example, this three is the total of cards that we have from text 69. And here is the amount that is selected, so you can have a quick notion of the proportion of the cards that you are selecting. For example, you can see that the pattern differs here between the ones that are not entirely selected and the ones that are entirely selected, like all the cards from text 69 are selected now. The same as 70. So we can have quick access by text to what you want to do with the cards. And we also have a user friendly [inaudible].

[00:26:31] Customer: Yeah, that's right. Thank you.

[00:26:40] nataliamotand: So here. Okay.

[00:26:46] Customer: So there was "Due today" and "Later". Right?

[00:26:50] nataliamotand: What?

[00:26:51] Customer: There was "Due today" and "Later".

[00:26:54] nataliamotand: Yes, yes. "Due today" are the cards that are going to appear when we start a session, and "Later", we put this kind of separation so the user can see what he's actually going to study today. And the later cards he can also see when they're going to come to him. So that's more practical for him to understand what he's reviewing.

[00:27:24] Customer: So I have a comment about this UI. I think "Due today" should be a static element in this card, in this modal. So it shouldn't be inside the scrollable list. Because when you scroll downwards, I forgot, I didn't see that it's due today. So I was confused about what this card is.

[00:27:58] nataliamotand: Okay. So do you think these lines should be fixed, but we should still have a scroll?

[00:28:04] Customer: Yeah, I think the scrolls for "Due today" and for "Later" should be separate scrolls, and "Due today" and "Later" should be static elements.

[00:28:17] nataliamotand: Okay, scrollable. Okay. Yes, sorry, I was showing you the reordering of the words. So here we reordered the words, and they're going to show up in the session from top to bottom. So now we can also put these for later, and it will have a date. [inaudible] the latest date. So if we put here, we also have [inaudible]. Here we'll have the 25th. So it respects the order that we talked about. I'm not sure that you remember, but the first prioritization should be about which text, which cards the user wants to learn first. But it should also respect the sort that we have about the dates, so it doesn't become like 23, 25, 22. Do you see my point?

[00:29:39] Customer: Yeah, I do see your point.

[00:29:42] nataliamotand: Okay. So accepting... Sorry. You can go.

[00:29:47] Customer: I think there was a flaw in my reasoning last time. So as far as I remember, I suggested that if you move a card for later, for example card number seven moves to between eight and nine, then its due date becomes October 25, and the due time, if this concept exists, becomes the middle between [inaudible], between the times that Zug and Bahnhof are due, cards eight and nine are due. Do you store the timestamps?

[00:30:45] nataliamotand: The timestamps, you mean the dates that they're going to show up?

[00:30:49] Customer: No, like in seconds. Or is it localized?

[00:30:58] nataliamotand: I'm not sure I understood your question, but we only have the dates here, not hours or seconds, that they're going to show up.

[00:31:08] Customer: Yeah. Okay. I think I got it. So they will be just in this order, seven, eight, nine, in this order on October 25, right?

[00:31:22] nataliamotand: Yes. On the date of October 25, they come to "Due today" and they will be exactly in this order. They will be shown in a section.

[00:31:36] Customer: Yeah. Okay. What happens if I move to another country, with a different time zone?

[00:31:45] nataliamotand: This is an interesting question. I'm not sure I know how to answer it, but I guess it just takes the time of your computer. So if you move to a different date, maybe the cards wouldn't show up because they would be kind of history, or maybe they would adjust to due today. For example, if you don't do your cards of today, they will show up tomorrow again, on the due date, so you don't miss it. So I guess if you move to a different country and it's the 25th in the country that you're in, the cards would no longer be on the "Later" page and would be on "Due today". But if it's more specific, like what does this refer to, is it the date that it was created or the date that it is on your computer? I don't know how to answer your question, but I can surely check and send you a message on Telegram after the meeting, so everything is clarified.

[00:32:58] Customer: Yeah, please.

[00:33:01] nataliamotand: Okay. So this is important for you, the time zone adjustments in the product?

[00:33:12] Customer: Yeah, if it's a visible element of the product, then yes, it's important, not super important. Okay, this is a "should have" feature rather. I can't make it a "could have" feature, because it's relatively important: people move between countries. It doesn't happen very seldom. Yeah, but for now it's not the top priority issue.

[00:33:51] nataliamotand: Okay, but still I can check and let you know about how to adjust it, and if it's not meeting your expectations, we can surely adjust it, no problem.

[00:34:04] Customer: Thank you.

[00:34:07] nataliamotand: About user story four, which is about this reprioritization of your study. Here are the acceptance criteria. The first one says that only the cards that the user chooses are moved to the front, and the others keep their place. So as you could see, I can show it again: all other cards keep the same place and only the ones that you chose are reordered in the table. So if that's okay, we can move forward. If you want me to show it again, I can drag another card, maybe from "Due today" to "Later" or the opposite.

[00:34:50] Customer: Could you drag card number five to the first position, to before one?

[00:35:06] nataliamotand: Okay, it works.

[00:35:11] Customer: Okay, so if you move two cards, if you drag three and four together to before two, to between one and two. Okay. They move together. What if you select two and four, and which position, maybe after five. Okay. Good. So it seems to work.

[00:35:48] nataliamotand: So it's according to your expectations, or maybe you would want to change something? But if I remember correctly, this is what we had agreed on in the last meeting about the order. If we choose two together, they should be one after the other, in between the places that we had agreed on.

[00:36:08] Customer: Oh, yeah. Okay.

[00:36:15] nataliamotand: So I moved ahead a little: I'm going through acceptance criterion two right now. Given a past text in which I mark no word, when I ask for a sentence, then no sentence is shown. Oh, sorry, I'm reading the wrong acceptance criterion. So: given a card that I already studied, when I move it, then its review history and its interval are unchanged, and its due date only changes so that it fits the new place. And that's what we had also shown previously. So I moved the order a little bit, but before entering the meeting I had created some cards, so I could give you the examples, and Buch was one of them. In the text that I had created, I had already started a session and marked Buch as Good. We also had implemented the four answer options that you had mentioned when starting a session, so Good. When you select Good, and we'll also go through this so it's more visually comprehensible for you, the card repeats two days from now. So that's why it's on the 25th of October to be repeated again. So I can start a new session here; Bus is one of the cards that are due today. And here, when we select Good, it comes back on the 25th.

[00:38:09] Customer: If you select Easy or something like that.

[00:38:13] nataliamotand: If I select what?

[00:38:15] Customer: Easy, or like the, yeah, for this. Okay. Okay, 23 plus 4, 27. Okay. Great.

[00:38:34] nataliamotand: So that's it for acceptance criterion two.

[00:38:39] Customer: Could you please show it again? Show the acceptance criterion.

[00:38:46] nataliamotand: Yeah. Given the review history...

[00:38:58] Customer: Okay, the review history is not visible.

[00:39:09] nataliamotand: Yes, and its interval are unchanged.

[00:39:17] Customer: So, moving a card, what do you mean, like moving inside the study queue manually?

[00:39:23] nataliamotand: Yes, or through a [inaudible]. So we change here the next due date.

[00:39:40] Customer: Yeah.

[00:39:41] nataliamotand: So it adjusted to the 25th of October. So it kept the 25th.

[00:39:48] Customer: Okay, move it to one of the "Due today" cards. Then it becomes October 23, right? And what happens to its interval?

[00:40:10] nataliamotand: Yeah, I don't quite understand. Could you be more specific about what you didn't understand?

[00:40:22] Customer: Sure. So if you studied a card, or if you have to study card number eight on October 25, then I assume its interval is two days. Or what, what is an interval?

[00:40:49] nataliamotand: The interval is the amount of time before you have to study that card again.

[00:40:57] Customer: If you manually move card number eight to "Due today", like after card five, for example, or yeah, after card three, sorry, then its interval does change, right? It's like during two days, but it's due today. It's as if its interval was zero days, or

[00:41:28] nataliamotand: Since you moved the card to study today, it will come back again to "Due today", and depending on what you chose for that card, either Easy, Medium or Hard, it then has a new due date for when you have to do it again. So maybe, I would guess, the problem here is the way that the acceptance criterion was written, and then we can surely rewrite it so that it is specified that the interval means that the card will be repeated again, and that it's based on the answer that you choose in the session. So it's clearer, and in a way that we plan to have for the students, since the answer to the question matters most to decide when he should see the card again. Is that okay?

[00:42:34] Customer: Yes.

[00:42:41] nataliamotand: So I'll show acceptance criterion three now: given an order that is no longer valid because the cards changed, when I save it, then the product refuses it and changes nothing. So I'll just reload the site here. Just a second, and following the step by step for how I can show this acceptance criterion, since it's a bit more tricky. Here I'm going to delete the card in the "Your cards" selection, here we can find it again, and try to move it. And here we can see the error message that the move was not saved because it's invalid, since we don't have that card anymore. So that's it for acceptance criterion three. Is that understood?

[00:44:31] Customer: Not really. Could you please show it again? I'd like the text of the criterion.

[00:44:38] nataliamotand: Yes. Given an order that is no longer valid because the cards changed, when I save it, then the product refuses it and changes nothing.

[00:44:53] Customer: Okay. Why can this happen? You remove the card? Did you...

[00:45:05] nataliamotand: Yes, I did. I deleted the card from here, the "Your cards" selection. So when I tried to move it in the order, the card no longer existed and couldn't be moved because it doesn't exist anymore. So that's the error that is shown.

[00:45:28] Customer: Yeah, but why did you design it like that? Why is there no immediate synchronization between the action here and the order? Correlation, like if I delete in "Your cards" it should automatically disappear in the other table. Yeah, not correlation, synchronization. Like, is a single state used for this list and for the study queue, or not? And [inaudible].

[00:46:13] nataliamotand: So that's why it's not synchronized exactly at the same time. So that's why we have this kind of lock: if the card doesn't exist anymore, you shouldn't be able to move it, because in the database it doesn't have a correspondence anymore. So that's why we chose to do it that way. But maybe you are right and it's best if it's completely synchronous. So when I delete one card from here, it should automatically disappear from the other table.

[00:46:48] Customer: Yeah, I would prefer this. So that there is a single source of truth, and you don't need to handle all kinds of errors. Because, okay, maybe you can have some delete cascade or something like this. Not sure if SQLite supports this.

[00:47:12] nataliamotand: If you say delete cascade, you mean like deleting: if I delete in one table, it should delete in the other one automatically, right?

[00:47:22] Customer: Yeah, if you delete in one table, then all tables that reference it will delete it too, or do something, depending on which rules you've set for this event.

[00:47:37] nataliamotand: So, user story four. What we have as action points is rewriting the acceptance criteria number one, number two and number three, and only acceptance criterion number four is correct to what you expect from the study queue.

[00:48:01] Customer: Yes. Or maybe look at them again, maybe there is something else. Could you please show the user story again?

[00:48:16] nataliamotand: Okay.

[00:48:19] Customer: Given the cards of two texts in my study order, when I move the cards I choose to the front, then they are studied before the other cards, and the cards that I don't move keep their place. Okay. And did we try it with cards from different texts? If I tried. Or from one text.

[00:48:49] nataliamotand: Do you mean the indicator, or are you still asking about the study queue?

[00:48:58] Customer: I'm asking about acceptance criterion number one here. So: the cards of two texts in my study order, when I move the cards I choose to the front, then they are studied before the other cards. Did we try moving cards that belong to different texts?

[00:49:21] nataliamotand: Yes, it works the exact same way. I'm getting here text 73 and text 70, and I'm going to put them to due before the four here. [inaudible] And they move exactly the same way. The text is only for the cards, to select here and say, you can click the text that you want, and this way you can easily drag to one position that you want, from text. Do you understand what I mean?

[00:50:00] Customer: So it still works for different texts also. Great. Then this acceptance criterion is satisfied.

[00:50:11] nataliamotand: Okay.

[00:50:13] Customer: Given a card already studied, when I move it, then its review history. Okay. Yeah, interval should be adjusted. But review history... [inaudible] stay the same. Due date only changes so that it fits its new place. Given an order that is no longer valid. Yeah, fine technically.

[00:50:44] nataliamotand: What about the study queue? That's it for the acceptance criteria that we have about the study queue. So the way that you see it, the way that it's ordered, is this what you expected? The way you move, you can move to the front, you can also vary the date that you want to study. Compared to the study queue from Anki, the reprioritization they have, do you feel like there's something missing here, or maybe you would like to see it put in a different way?

[00:51:26] Customer: I think the behavior is just right. But as I mentioned, the date logic may be improved. Like, not localizing the time, but choosing to show the date in the right time zone. And, yeah, another comment is about the text chips. So why are the texts called like this, "Text 69", "Text 70", and not using their true name, if they do have some title or name?

[00:52:24] nataliamotand: I tested a lot on the product. Every time that I added a new word from different texts, it created a new one. So that's why the numbers are so high. And even though I deleted the cards, this is something that we still need to fix for next sprint: even though I deleted the cards and there are no cards left from text 1 to 68, for example, the newly created text comes after the last one that was created. That's why such long numbers. Did you understand what I mean?

[00:53:07] Customer: Yeah, got it. So you had auto-increment, and then you got texts including ids. Yes, you removed some texts but their ids were preserved, and so I see now large numbers. Okay. Not very large, but this number. Okay, I assume these are placeholder titles for the texts. Later, I think it would be more convenient to see true text titles here instead of just ids of these texts, because I don't remember which text each id belongs to.

[00:54:02] nataliamotand: Okay.

[00:54:05] Customer: And I wonder how this can be implemented from the UI point of view.

[00:54:12] nataliamotand: Surely, as you paste a text, there would be a field for you to put the name of the text, something like a book that you're reading, you can put the title here. It would surely be in this box as soon as you enter your text, and then you would be able to adjust it, maybe in an editor here in "Your cards", or maybe in a different kind of view. But we can come up with options and show them to you so you can see which one is best.

[00:54:50] Customer: Great. And then, yeah, let's think about the study tab. So if we show the actual text title here, then the chips will not be as narrow horizontally. They will have to somehow fit the screen, using the free space which is here in each card row. So for example, for card one, "Text 69" takes not much space. But if you show the whole text title, then it may occupy half of the column, half of the row. So it shouldn't be allowed to grow like this horizontally. So should the actual title be as wide as the sentence approximately, or should we limit the width of the column that contains the text titles and let it wrap lines, like in this quote, or as I showed you in the chat, a screenshot from a news site, where there was a title and it was split into three lines because it was too long? So maybe we could introduce something like this.

[00:56:42] nataliamotand: So the way that I see it, we have two options: either we keep it this way, in this positioning, and limit the maximum number of characters that we allow in a title, so it doesn't become too much for the user to see, or we take it from the way that it is right now and put it in a line below the sentence here, so it is able to grow as much as it needs, without breaking the visualization of this table. Those are the two options that I see here about the title question.

[00:57:24] Customer: Yeah, and the short one is to clip the title to some number of characters, like a prefix of the title.

[00:57:38] nataliamotand: Okay.

[00:57:42] Customer: Yeah, okay, so even four options. The first one: we let it grow horizontally and be on the right of the sentence. The second option: we move the title to above the card or below the sentence in the card. The third option is we clip the title, and the fourth is we wrap the title, like what Google Sheets or Excel do when they have very long cells.

[00:58:23] nataliamotand: Yeah. Okay, so we can build these options and see which one fits best the user experience.

[00:58:40] Customer: And I think these options should also be tried on the mobile version.

[00:58:52] nataliamotand: Okay. I'll make sure that we have it also on mobile, that the interface is not broken by these adjustments, and we can discuss this further in later meetings, so you can verify that everything is doing accordingly to what you expect. And we still have some things to show, [inaudible] the time box has expired. So we made some adjustments about decisions that we discussed in the previous week, as you could see in some of the ones that I showed you. I'm going to skip them really quickly, but I will tell you which ones we have made. So here we have done the identifier as you asked, with the word and a short phrase. This was one of the adjustments that we made. We also put subtitles, and instead of text for the actions we put the buttons, as you also requested. And here we have a lock on the translation: if I change it here now, it won't be changed. Also, we have changed this: now you don't make the edit in line but in a modal. Another option that we discussed in the previous meeting was maybe double-clicking the sentence to change it in line. If you think that's necessary and useful for the user of the product, please let me know and we will implement it. If you think the modal is enough, you can also say so.

[01:00:51] Customer: First of all, yeah, I think the modal is enough. Maybe it will be even more convenient on mobile. You don't accidentally tap a sentence and start editing it while scrolling the cards. And regarding the timing, I do have time to continue the meeting, if you have something to discuss and also have time, we can proceed.

[01:01:29] nataliamotand: Okay. I'm okay with time too, no problem.

[01:01:35] Customer: Okay. What about your teammates? I hope they manage their time.

[01:01:46] nataliamotand: So, guys, if you have any other appointments or commitments that you have to attend to, feel free to leave the meeting. If not, you can also say no problem. We're going to go through the other points here and I'll move on. Okay.

[01:02:16] nataliamotand: About the ID, the identifier of the cards, I have a question for you. So we decided that the card is identified by its word and a short phrase, but the language model judges whether two phrases have the same meaning. So this context phrase is also passed so the LLM can check with the other cards if any of them have the same meaning. About this decision: when we tested it, we found a few cases where it misjudged, and I made a few changes to the model and ran some tests, and it passed the 45 tests that I made. But still, we have to consider that it's possible that the lock on the LLM might not work in all cases, because maybe the context phrase is a bit different from one to the other. For a short example here, I tested two sentences with the word Bahnhof, where Bahnhof in this context is [inaudible], and I tested another sentence in which Bahnhof was also [inaudible]. So the translation was the same, but the model was still creating another card for the same word. So we made a few changes to the [inaudible], we made a few changes to the model to make sure that it doesn't happen again. But I was just bringing up the point that in some previous tests that we made this was happening. So I was just wondering, if this happens in some of these cases, is it acceptable, or should we be completely strict about that and maybe implement something so that the model can be absolutely sure that it doesn't exist already, something like the translation of the word specifically? So maybe the identifier can be the word, the short context phrase and the translation of it, or maybe we just keep it the way it is and accept that there might be some cases in which the model makes mistakes and allows a second creation of a card with the same meaning.

[01:04:53] Customer: Okay, so I don't completely understand how you produce the identifier. Could you please elaborate on that?

[01:05:15] nataliamotand: So maybe I should provide an example, which I consider for this question. Assume you have a text with Bahnhof selected. What happens to Bahnhof after that? How does it obtain its identifier? On the first occurrence, it creates a card for Bahnhof, and the same way it creates a sentence and a translation, it also creates a context phrase to associate with the word Bahnhof. So maybe some preposition or some place; the creation of this context phrase is completely by the LLM, and the user or the teacher can edit it, but the first creation is by the LLM. And then every time that the word Bahnhof is selected, it compares to the identifier, so the word and the context phrase that was previously created. And if the LLM decides that the context is the same, it doesn't allow the creation of a new card for it. But if not, it allows and creates a new card with another context phrase. So what happened was that I put two different texts in which the word Bahnhof appeared as a string, and in these two occurrences it created two different cards when it shouldn't have, with two different context phrases, even though the translation was the same.

[01:06:57] Customer: So you first create a card for Bahnhof, right? And the context phrase is generated together with the sentence. So what I was thinking about is that you first look at the selected words in a text and then pre-process them, so you can immediately generate the context phrases for them without generating an actual card. So how can this happen? For example, the text contains Bahnhof, the first text contains Bahnhof, and you already have a card for Bahnhof created from another text, from text two. For Bahnhof from text one, you know that you have in your database entries for Bahnhof; there is a card that contains Bahnhof already. And then you can ask an LLM to decide whether that existing Bahnhof has the same meaning as the new one or not. If it doesn't have the same meaning, then you need to generate a new context phrase. Otherwise, you can reuse exactly the same phrase that exists already. And after this pre-processing, this matching, you can decide whether you need to generate new cards. So if you found the matching context phrase for the new Bahnhof, then you don't generate a card. Otherwise, you have to generate, because the context phrase changed and the idea has changed.

[01:09:24] nataliamotand: Yes. So this is how it should happen. But in some occurrences, where the word has the same meaning, and still, instead of not creating the card and showing the message, as in most of the test cases I made, it didn't allow the creation of a new card with the same sentence; the message appeared, saying that we already have the same context, and it showed both the word and the short context for it. But in some exceptions, it happens that the model didn't recognize that the word had the same meaning, because the sentence has changed a little bit. So that's the main thing. The main problem that we encountered was this one.

[01:10:23] Customer: So how did your test look like?

[01:10:32] nataliamotand: Yes, I can. I have a table with some examples. I tested one same word, like [inaudible], with three different kinds of translations for the word. Let me just get the table. I can show it to you here. So for example. So this is the case where it doesn't create, because it already has a word with the same meaning. And then, let me delete this one so I can show you what should happen. So now it's supposed to create a new card for it. But here, if I put another sentence where it has the same meaning as the previous one, it shouldn't create a new card, and it should show here that we already have a card with that meaning. So what I did was test this with different sentences with either the same or a different meaning, to see if it would create new cards or not. So here it has the same meaning as the previous one and it shouldn't be able to create a card. But for example, we can use Schloss here, that has [inaudible]. The next one has the same meaning as the previous one. So it shouldn't be created, and it shows here. And for example, in this phrase, Schloss has a different meaning than the previous two. So now it should create a new card for it. Yes. So now it's working, but some of the tests that we made before the previous adjustments in the code didn't work. And I was just mentioning that this might have happened in some cases that we didn't predict during testing. And if that's okay, if in some cases it allows creating a card with the same meaning, or maybe we should adjust the identifier so it has other information for the LLM to determine whether that card already exists or not.

[01:13:16] Customer: Mm-hmm. So what did the LLM receive in this request?

[01:13:24] nataliamotand: In this case, yeah, Schloss is like a lock, a lock on the door.

[01:13:32] Customer: Yeah. So, and there is a card Schloss, where Schloss is a castle.

[01:13:46] nataliamotand: What do you mean, the context phrase that the LLM receives?

[01:13:51] Customer: Yes. Did it receive? Yeah, what did it receive?

[01:13:57] nataliamotand: It receives the word Schloss and this context phrase that is assigned on the creation of the card. So for example, here, you can see that the context phrase in the castle one is different from this one, and it's like three words long. So maybe the two options that we have here are to make a context phrase that's a bit longer, for the LLM to understand it better, or maybe to add another field that it will receive with the request, the translation maybe, so it compares: if either the translation or the context meaning is the same as any other one, it doesn't allow the creation of a new card.

[01:14:46] Customer: Yeah, that might work. So if there were two cards for the same word, but with different meanings, does the LLM receive both context phrases? [inaudible]

[01:15:10] nataliamotand: Yes, yes. In this case the LLM would look at Schloss one time with this meaning and one time with this meaning. So if any new sentence was created with Schloss, it would compare with both existing ones. If either existing one had the same context, it wouldn't be able to create it.

[01:15:39] Customer: What specific text does the LLM receive? Like Schloss and then some separator and the existing context phrase? And then what?

[01:15:53] nataliamotand: Yes, it's Schloss and the context phrase.

[01:15:59] Customer: Okay, now you have two Schlosses here, two cards with Schloss. And if you try to generate a new card for Schloss from some sentence, then what do you send to the LLM? Like Schloss and then the first context phrase and then the second context phrase, or what? Together, in the same request, in the same string, or how does it look?

[01:16:30] nataliamotand: It receives them as different lines, since it compares which word you want to create with which words you have in the table. It receives both the word and the context for each one of the lines that we have and compares against that. So if it says it's the same in the first line and it already identifies that it's the same context word, then the error message will appear and it won't create. But if it identifies that both the word and the context are different, then it moves forward to the next line.

[01:17:16] Customer: Okay. I'd love to see the exact request that is sent to the LLM. Maybe the format can be changed. Is it possible?

[01:17:30] nataliamotand: I don't know. Maybe in the browser tools. Let me see how I can do that. I'll show you my VS Code. Do you want to see the VS Code, or maybe another visualization?

[01:18:05] Customer: VS Code is okay.

[01:18:07] nataliamotand: Okay. Just a second. Do you see my screen?

[01:18:32] Customer: Yeah.

[01:18:38] nataliamotand: This is the write-sentence function.

[01:18:46] Customer: But I suggested that after the user selected the words, then for each word you look up whether it already has context phrases in your database, and then you ask an LLM to decide. Maybe one of those context phrases is okay for this word. And if not, then it generates a new sentence. So I'd like to see what exactly you sent to the LLM. Do you ask it separately about each word, to classify, like maybe select one existing context phrase or another, or decide that there is no matching context phrase in your database?

[01:20:04] nataliamotand: I'm not sure I understand the question.

[01:20:07] Customer: Okay. Well, you have a list of cards that you produced from words selected in the text. And you store, for each card, the word and its context phrase, the generated sentence in one language and in another, and maybe some other information.

[01:20:38] nataliamotand: This is the information that the LLM receives about each of the cards that we have.

[01:20:47] Customer: So assume you have two cards for the same word in your deck. Like here we have Schloss and Schloss, two cards. And so in each card there is its own context phrase, right, that reflects the meaning of that word in the original sentence. And suppose a new sentence arrives that contains Schloss and the user selects it. And you need to decide whether you already have a card with that meaning or not, with the context phrase that corresponds to the meaning of the new word or not. Do you understand until now?

[01:21:48] nataliamotand: A little. Like you want to know how it compares. Like if I want to add a Schloss that doesn't already exist in the database, what happens with the LLM then?

[01:22:08] Customer: Basically, yeah. You have to decide whether you already have an existing context phrase and you don't need to generate a card, or you don't. And it's like a classification problem, and it should not need lots of context to decide. Basically, you can send to an LLM this new Schloss together with the sentence where it appears, together with all existing context phrases. So you have two context phrases in your database right now, and so you can send four values together: the new Schloss, its sentence and two context phrases, and ask the LLM to decide whether any of the context phrases that you send works for this new Schloss or not.

[01:23:27] nataliamotand: Okay.

[01:23:31] Customer: I'm not sure how you handle it right now. But from this prompt, I think maybe the prompt provides too much context for an LLM and therefore it becomes confused and can misclassify sometimes.

[01:23:53] nataliamotand: Okay.

[01:23:55] Customer: Yeah, maybe the problem is in the tests, not in the LLM. But I didn't see the exact setup for the tests. And so I can't judge right now.

[01:24:10] nataliamotand: Oh, yes. I understand what you mean about giving more context than the LLM needs, and maybe this is clouding its judgment. So I can check and do a new batch of tests to make sure that all of them pass. And we don't have to implement any modification to the ID itself, only to how the prompt is asked to the LLM.

[01:24:39] Customer: Yes. Okay. Right. But your concern is valid. Even after this optimization, we can't fully trust the LLM. So we have to decide what happens if it misclassifies. So if it decides to create a new card although similar cards exist. So either we should ask the user to decide whether they want this new card, or we allow it to just create it and not notify the user. So should we highlight such cards where we are not sure whether they should exist, or should we keep it simple, generate a card, and let the user decide, maybe they notice that they already have such a card?

[01:25:38] nataliamotand: Okay. That makes sense. So I'll implement that. And hopefully this will solve our problem and we can keep the ID as it is.

[01:25:55] Customer: Okay.

[01:25:57] nataliamotand: For the last points, we have to go through the quality requirements and the architecture quickly, and talk about the next stories that you want implemented. So I'll share my screen again for the quality requirements, really quickly. And I can also share this with you via the group chat if you prefer. It's all committed on the main branch of our project on GitHub. So what's your preference about how to read it? We wrote down the qualities that the product must have and how it's built, and we want to know if they answer what you need for this.

[01:26:53] Customer: Okay. Let me... I see it in the chat. Could you please send the link?

[01:27:00] nataliamotand: I can also, do you want to receive the quality requirements and the architecture via chat and we move forward with the meeting, or?

[01:27:11] Customer: Yeah. Okay. Let's agree on the goal: what would you like to discuss right now, whether the requirements capture what I intend?

[01:27:24] nataliamotand: Yes.

[01:27:27] Customer: Okay. In principle, yeah, if you show them, I think it will be also okay.

[01:27:35] nataliamotand: Okay, so they are in a table. Yes, these are the five that we came up with based on the characteristics. Do you prefer to read, or I can read it to you.

[01:27:56] Customer: No, I prefer to read myself. When the language model gives no sentence for a marked word, the learner still gets a card for that word and can ask for a sentence again. The other words keep their sentences. How does it affect the architecture?

[01:28:28] nataliamotand: These are the quality requirements. The architecture is about which frameworks we [inaudible]. But this is reliability, because the user doesn't only get an error message and get lost on a word that he previously wanted to learn. So this way, if the word is added to the cards, his card selection, he can just come back to it. In the first moment it asks to get a new sentence, and in the last moment, if it still failed, he still has that record, that word that he created was a word that he wanted to learn. So he doesn't lose this.

[01:29:21] Customer: Okay. Sounds good. A developer can run the backend checks from a clean checkout of the repository, and a change that breaks one of the product's critical modules makes those checks fail.

[01:29:38] nataliamotand: Yes. So the tests are implemented, I can also show it to you in VS Code. But for every change that we implement in the project, we run these tests. So every change has new automated tests. So it shows when the main module of the code breaks or not. So the developer can see if the code is running smoothly as it should, or maybe something has changed that shouldn't have.

[01:30:23] Customer: Okay.

[01:30:28] nataliamotand: Yes, this is more about what you mentioned this week about testing. Some of it is implemented in the code. Since assignment five hasn't been released yet, we just check the tests that we already have against the tests that you're going to introduce for us to have.

[01:30:54] Customer: Oh, great. We are ahead of the course progress. All right. A person who is not on the team installs and runs the product by following only `docs/setup.md`. There's no other help from the team. Okay. Flexibility, installability. Yeah. This one is also okay. The language model key is read from the `.env` and never committed to the repository or shown to the learner, even in an error. Wow. Okay. I wonder how you're going to ensure this.

[01:31:49] nataliamotand: Make sure that the `.env` information isn't committed to the repository.

[01:31:56] Customer: I mean, not shown to the learner even in an error. So you manipulate this key inside your application. How do you ensure that it doesn't appear in some logs, or in the error message?

[01:32:16] nataliamotand: The information from `.env` isn't committed to the repository because of `.gitignore`. So we just make sure that we all check every time that we're committing something, maybe a screenshot or error messages, to make sure that, for example, the API key from the agent doesn't appear anywhere in our code. So it's secured that way.

[01:32:51] Customer: I mean a different thing. So your application runs and reads the values from `.env`, right? And it saves those values in some variables, or some fields of an object. And then it uses this value elsewhere, maybe to send requests to an LLM, or maybe to encrypt something, like if it's a password or some passphrase. And here you have to ensure that this value does not appear in any logs, and that it is not shown to the learner in any error. So you need to check that all code that may produce an error never prints values from the `.env` file. It's not about committing or not committing `.env`, it's about how you handle values from the `.env`, that you don't expose them where they are not necessary. For example. And so, okay, I'm not sure how this can be automated right now. But okay, let's keep it. Okay, this is useful anyway. Okay, when the language model does not answer for a word, the time the product spends repeating the request stays within about 19 seconds. The learner is not left waiting without end. Okay, 19 looks like a magic number. Maybe 30 seconds doesn't look better, but I don't know what to choose. Maybe make this number configurable and set it to some default. Okay, 20 seconds. Okay, but this is time behavior here. Performance efficiency. Yeah, but in this case you depend on an external service, and you can't control how quickly it responds. So you should not measure this time. You shouldn't put it in the time behavior characteristic, because this time does not depend on you. It depends on this API. What you can measure is that after the response has arrived, the cards are displayed within half a second, for example. So this will be the performance of your application, which can be measured and controlled. Okay, what else. Okay, the teacher may never see the student's key. Okay. And what else is important?

[01:37:01] nataliamotand: So these are the quality requirements. I'd also like to show you the architecture. So the product runs as a front end, a back end and a database, and the language model is outside. That's the element that we're calling.

[01:37:20] Customer: So regarding the quality requirements, okay, I suggest that you add another one: the teacher may never see the student's key.

[01:37:33] nataliamotand: Okay, any user.

[01:37:35] Customer: Yeah, yeah, basically like that. [inaudible] Okay, let's go to the architecture, I may have some more comments about the quality requirements after that. [inaudible] make requests to the back end. [inaudible] make requests to the SQL database. And [inaudible] make requests to the language model service. Great. So the back end makes, what happens? So there is a problem. We have a student who wants to learn, who wants to generate cards using the most powerful model in the world, which is not supported by the back end. Like, the back end cannot make requests to that model, it's not a supported provider, for example. And also, the student does not want to send their API key to the back end. So what should they do?

[01:39:28] nataliamotand: Is there another solution to make the requests without going through the back end?

[01:39:45] Customer: Yeah, exactly. So requests can be made from the front end, and some heavy processing can be outsourced to the back end. This way you never send the student's key to the back end, but you can still use the back end to process data and to store data. You need some source of truth regarding the data; in the case where you store always up-to-date data, this can be the back end.

[01:40:23] nataliamotand: Okay, so maybe we make the request from the front end specifically, or we have to have a different kind of subsection here, where the information of the user never gets to the back end, but he sends it somewhere else, with a closed LLM.

[01:40:48] Customer: Yeah, something like that. I mean, not all information should be kept on the front end. So the API key definitely, but account information is already stored on the back end. This is user information. It should go to the back end. Yeah, and so one of the teams, okay, another team suggested that the back end can also provide an API key. So for example, the user pays for a subscription, and then they can use the key provided by the service, by the service that you built. And then the back end never sends this key to the user, but it uses it to make requests to the language model service. The same thing that you have implemented right now: the API key is provided in the `.env` file. Yeah, so the only thing that remains is to support similar functionality on the front end. So, make requests from the front end.

[01:42:12] nataliamotand: Okay, so we'll change the architecture so it supports the user's wish to not share his API key. That's important for security also. So, okay. And sorry, go on.

[01:42:37] Customer: Okay, the teacher should also be able to use their own API key. Yeah, and when they edit the cards, their API key should never go to the server. Basically, if the user does not use a built-in API key, then their API key never goes to the server. Yeah, that's basically it. It's not only about students, it's also about teachers. Okay. And I think, yeah, I think that's it about the API keys. Okay, SQLite. I think it's okay for now, yeah. Maybe later it might be better to use Postgres, but for this version it's okay to use SQLite. Okay, front end. Show the page. Okay.

[01:44:05] nataliamotand: And we'll add to the front end what you mentioned about making the LLM requests directly from it. I'll add the text to the [inaudible].

[01:44:28] Customer: Okay, maybe it could be made a bit more high level. But it's okay, let's keep it like that, just adjust it a bit for this.

[01:44:47] nataliamotand: High level, you mean like more description?

[01:44:51] Customer: I mean, not specify all the functionality that is available on the front end. Show the card table where the learner edits, selects, hides and deletes cards. Maybe like a card editor or something. Okay. Run the study session. Yeah. But overall it's okay.

[01:45:32] nataliamotand: So should we discuss something else? There are only the next stories that we're going to implement. So we just need to discuss which one is the priority here. None of these user stories that I'm going to show are built yet. And we were wondering which one of these you would miss first in the application if it didn't have it, so we know what's more important to build next. The first one is about the audio options, so to hear the words and the sentences, both in the texts and in the cards, and the sentences generated. The next one is the teacher review. So it will let the teacher correct the student's sentence. And the next one is some of the changes that we discussed previously, so about the daily limits and letting the learner ask for cards ahead of schedule, that you mentioned. And keeping decks apart from the texts, so that would change the vision of the study queue. And which ones would you study first, similar to Anki? So we were wondering which one you would like us to build first in the next sprint. Surely, if we have time we'll build more of them, but we wanted to know your priority.

[01:47:08] Customer: Could you please show them in the project? I think you have. Yeah, or like this. Okay. So yeah. For five. Okay, for two or not. So number four you built for today's meeting, and number six.

[01:47:44] nataliamotand: Yes.

[01:47:46] Customer: Or not.

[01:47:48] nataliamotand: So number six, we didn't put as an option, because in previous meetings, when we talked about your priorities, you mentioned that the first thing, the teacher's review, was most important. And you also talked about the audio. So that's why both of these user stories are kind of prioritized before using the product in a person's own language.

[01:48:18] Customer: Got it. So we have two user stories and two tasks. Keep decks apart from the text.

[01:48:35] nataliamotand: Like right now we only have one kind of deck, where we can only study cards all together, and this kind of version with decks apart from the text is what we mentioned in the previous meeting, about creating a deck from each pair of first language and selected language, so the user can choose which language he's learning next.

[01:49:09] Customer: Yeah. Okay, so daily limits and let the learner ask. I think it could be a user story, [inaudible] daily limits and let the learner ask. But okay, right now it's a task. Keep decks. Okay, so the big priority here: the words and the sentences should go first. Set daily limits, that daily limit should go next. Keeping decks apart from the texts is a short priority. And user story number five is the fourth one.

[01:50:16] nataliamotand: So about the audio sources that I mentioned at the beginning of the meeting, these are the three audio sources that we found. And I was wondering which one of them you would choose, given that one of them has a non-commercial model license and one sends the words and sentences to an online service. The table here, I think it's best for visualization.

[01:50:53] Customer: No price, run by the learner, local, as a program the learner runs. So I think the first option does not work at all, unless it runs in the browser. If you want to monetize the service in future, then you can't use this model, because it has a non-commercial model license, or [inaudible]. Okay. Google Cloud TTS. There was a problem with it like two years ago. I think it could only send one request per second for free, so it was not very scalable. Okay, Piper, all three have voices, open source, run by the learner. Why "run by the learner", by the way? [inaudible] How can a model be run by the learner?

[01:52:18] nataliamotand: So I know that the database maybe will ask for the learner's information to create an account, so you can ask for the audio. I can talk to him about this because he's the one that looked at the options for the audio sources, he will be able to clarify that.

[01:52:50] Customer: So you showed the architecture: there is a front end, a back end and a database.

[01:53:00] nataliamotand: Yes.

[01:53:01] Customer: So the learner interacts with the front end.

[01:53:06] nataliamotand: Yes.

[01:53:07] Customer: And the back end and the database are managed by, like, service admins.

[01:53:12] nataliamotand: So right now this is one of the things we need to discuss with you: the database right now is on the user's computer, because it's self-hosted. So that's not a thing that you would like us to have, a database specifically for the product that the user doesn't interact with at all?

[01:53:39] Customer: I mean, the ultimate goal for this service is that it can handle multiple users, and they interact only with their front ends. We don't interact with the database. The data is stored in the host of the database, and it's managed by someone else. Okay. Yeah. Nevertheless, since this can trivially be adapted to the self-hosting case, where you just deploy the service on your local machine or on the VPS and manage the database yourself and store everything in your database, I can see that in this second case, where you self-host, you can run a model to generate audio. You just run the model on your machine and then you get audio. But yeah, for the case where someone manages the back end and the database and so on, you can't run a model. You don't run a model on your local machine. Instead, you rely on some service provided by the back end.

[01:55:29] nataliamotand: Okay.

[01:55:32] Customer: Okay, I think I didn't consider one possibility, where you run a model locally on your machine, and then on the front end you provide the address of the service running on your machine, and then the front end can make requests to the service running locally, just from your browser. Is this the option that you considered? Like, where does the learner run the model?

[01:56:11] nataliamotand: We considered that the database for each user would be held on his own machine. So that's the way it's configured today. The scale is for each user specifically, when they run the program.

[01:56:30] Customer: Yeah. So if the user wants to go out and learn more words on the street, then they have to go to the site, then they need to access this service somehow. So this service should be deployed somewhere on some machine that has a public IP address that the user can connect to from their device.

[01:57:07] nataliamotand: That makes sense. So the audio model can be deployed on that machine, then the back end can send requests to it directly and so on.

[01:57:27] Customer: What if the user does not control this virtual machine, it's controlled by someone else? I mentioned the case when someone deployed the service for multiple users, they connect to it, they don't send their API keys, they use their own keys. What if they want to use their own model to generate audio? Yeah. Either they should provide some other API key, so that they can use the hosted model, like Google Cloud TTS, or they should be able to host a model on their machine just to generate audio, and then the audio that they have generated will be sent to the back end to be stored there. Maybe something like this. But I think a more viable option, a more user-friendly option, is to deploy some model on the back end and generate audio for users. So, yeah. We need something that can be deployed for a commercial product. Not sure if GPL3 permits commercial usage, so it should be checked.

[01:59:14] nataliamotand: Okay. So the model will be deployed on the back end, and then the back end can make requests to that model. Okay. Then the architecture should be updated for this model. Okay. And for the options, do you think any of them suit what we need?

[01:59:49] Customer: I think Piper is the closest one, although maybe there are more models that can handle this.

[01:59:57] nataliamotand: Okay.

[01:59:59] Customer: Yeah, but, yeah, for the first time it's okay.

[02:00:04] nataliamotand: Okay. So that's what we had for the meeting today. I will get the transcript of it and review everything that we decided here. And also change the things that we mentioned, both about the product and about the architecture and the quality requirements. But thank you so much for your time for this meeting. And I'm sorry again that we took a little more time than we had originally planned. And I'll try to adjust that. There are so many things to go through in this meeting and I'm not quite sure I know how to correctly time-box it. So if you have any suggestions that you would like to share, they are very welcome.

[02:01:01] Customer: Yeah. I think it's mostly on me. So I'm diving into some details, and then we are distracted from the plan that you had in mind. So I'm not sure whether it's better to give more feedback now, to prevent some problems later in the project, or whether it's better to time-box the meetings and not provide some feedback.

[02:01:35] nataliamotand: I don't mind that the meetings are long. I actually prefer it that way. That way you can guide us best when building the product. But I don't want to take more of your time than we had originally planned, you know. But if it's no problem for you, it's no problem for me also. And don't worry about speaking a lot, because that's good for us, the students on this subject, I think we learn best this way. So if there's no problem on your behalf, there's no problem on mine either. So I guess that's it. Thanks very much for sharing your opinion.

[02:02:26] Customer: Yeah, thank you. And have a great weekend. Sorry for interrupting. I mean, okay, then I will keep giving you feedback; if you need to time-box the meetings, please feel free to interrupt me if it takes too long. But otherwise, thank you for facilitating the meetings and sparking conversations about the details. Yeah, I care about this project. Therefore I'd like to give more feedback.

[02:03:16] nataliamotand: Okay, it's good, don't worry about it. I like it too. Okay, thank you a lot for your effort and for your work.

[02:05:00] nataliamotand: Okay. Yeah, thank you. Have a great weekend.

[02:05:07] Customer: You too. Goodbye.

[02:05:11] nataliamotand: Bye.
