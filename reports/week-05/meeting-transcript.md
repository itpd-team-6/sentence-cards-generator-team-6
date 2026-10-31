# Week 5 validation meeting transcript

- **Date:** 2026-10-31
- **Participants:** nataliamotand, Customer

The Customer gave permission to record the meeting and to publish the sanitized transcript in this repository, in one answer to one question at [00:04:19] to [00:04:33].
The recording had already started when this was asked, so the exchange before the question is in this transcript from [00:00:14].
The Customer was not asked whether the recording may be shared privately with the instructors, because he allowed the transcript to be published.
The transcript was produced with a speech-to-text tool run on the team's own computer from the recording, and the team then corrected it (see `ai-usage.md`).
The tool did not mark who was speaking, so the speaker of each turn was assigned from the content of the turns; a turn that starts or ends a few words away from the stamped time can be off by a few seconds.
Filler words and false starts were removed, punctuation was added, and words the tool misheard were corrected from context.
`[inaudible]` marks speech that could not be made out, and `[redacted]` marks a name or a place that was left out on purpose.
The times are those of the recording file; the first speech on it is at 00:00:14.
Each line is one sentence, with the start time of the segment it was said in.

[00:00:14] Customer: Hello.

[00:00:14] nataliamotand: Hello, [redacted], how are you?

[00:00:20] Customer: Fine, what about you?

[00:00:22] nataliamotand: I am also fine.

[00:00:25] Customer: Great, so are we waiting five more minutes?

[00:00:30] nataliamotand: Yes, they did not tell me that they were not coming, so I think they are coming.

[00:00:36] nataliamotand: We can wait about three minutes, and I will send a message in the background.

[00:00:41] nataliamotand: Thanks for understanding.

[00:00:43] Customer: Sure, okay.

[00:00:44] nataliamotand: I got a reply from them: emapfff will not be able to attend, and AbdelrahmanAbdel-Aal will try to join later.

[00:00:52] nataliamotand: So I guess we can start the meeting so we do not waste time.

[00:03:54] nataliamotand: It is okay. Are you listening to me? Just to confirm.

[00:04:02] Customer: Yes, that is okay with me. Let's start.

[00:04:06] nataliamotand: Okay, so initially I would like to thank you for your time to participate in the meeting.

[00:04:12] nataliamotand: Before we start, I would like to ask you the questions that we usually ask.

[00:04:19] nataliamotand: May we record this meeting with the automatic recording of the call?

[00:04:26] nataliamotand: And can we also publish a sanitized transcript of it in our repository?

[00:04:33] Customer: Yes.

[00:04:37] nataliamotand: Okay.

[00:04:39] nataliamotand: About the roles, I will be moderating the meeting today.

[00:04:44] nataliamotand: This is the Sprint Review of Week 5.

[00:04:48] nataliamotand: This week we put the product on the university virtual machine that you sent to us in the group chat.

[00:04:55] nataliamotand: So you can open it in a browser from the university network.

[00:05:00] nataliamotand: I would also like to confirm with you that you are in Innopolis right now and have access to the university student Wi-Fi.

[00:05:11] Customer: Yes, I am in Innopolis. I accessed your site.

[00:05:17] Customer: I also tried generating a card.

[00:05:21] Customer: So it works.

[00:05:24] nataliamotand: Okay, so what you did is user story 9, about accessing the product through the university virtual machine.

[00:05:37] nataliamotand: We also rewrote the criteria of user story 4, which were confusing last week.

[00:05:45] nataliamotand: So we would also like to go through that again and show you the acceptance criteria, to see if you accept them.

[00:05:52] nataliamotand: The meeting is about both of these stories and whether you accept them according to their acceptance criteria.

[00:06:00] nataliamotand: We do not know whether it is what you need, since this is the first time you see it, and this is what we would like to settle today.

[00:06:09] nataliamotand: I would like to start with the action points from the Week 4 meeting, which we decided on in the meeting and confirmed in the group chat after it.

[00:06:20] nataliamotand: Firstly, the time zone check.

[00:06:23] nataliamotand: AbdelrahmanAbdel-Aal looked into it, and the study queue uses the server's date and not the learner's time zone.

[00:06:30] nataliamotand: That was a concern you had, and we also told you this in the chat yesterday, and you reacted with a thumbs-up.

[00:06:38] nataliamotand: We would also like to let you know that the fix is tracked in issue 183, which is already created, but it does not have a milestone yet.

[00:06:49] nataliamotand: Just to confirm what was settled at the end of the meeting about the follow-up questions:

[00:06:57] nataliamotand: I have a question to see where we will place this fix, to understand your prioritization of it, but we can talk about it afterwards, no problem.

[00:07:10] Customer: Okay.

[00:07:12] Customer: Let's talk about it later.

[00:07:14] nataliamotand: Okay.

[00:07:15] nataliamotand: Thank you.

[00:07:16] nataliamotand: The second action point was about user story 4: I rewrote acceptance criteria 2 and 3, and deleting a card from the card selection now removes it from the study queue at once.

[00:07:33] nataliamotand: I will also show it to you in a few minutes.

[00:07:37] nataliamotand: The third action point that we settled in the previous meeting is not done yet.

[00:07:44] nataliamotand: It was the changes to the question that we ask the language model, and the tests that you suggested.

[00:07:51] nataliamotand: Since the time this week went to the deployment, we could not look into that.

[00:07:56] nataliamotand: But the 45 tests that I mentioned previously ran and passed.

[00:08:02] nataliamotand: That was with the previous model.

[00:08:05] nataliamotand: Next week we are planning to run these tests with the new model, following what you suggested about the sentences that we send.

[00:08:17] nataliamotand: I will also add a few more test cases to make sure that the model judges correctly.

[00:08:23] nataliamotand: And that we do not have the problem I mentioned in the previous week, of the model creating cards that already exist in the same context, or the opposite.

[00:08:34] Customer: Okay, got it.

[00:08:36] nataliamotand: The fourth action point was about the Piper licence, which we checked.

[00:08:42] nataliamotand: The engine allows commercial use, and each of the voices that Piper uses has its own licence.

[00:08:51] nataliamotand: You told us in the chat, and I imagine it was the private chat because you told me afterwards, that commercial use will not be needed.

[00:09:00] nataliamotand: So I just wanted to confirm that we checked it, and if it is needed, Piper has voices with commercial use.

[00:09:11] Customer: Sorry, I did not catch the question.

[00:09:15] nataliamotand: Oh, no, it is not a question; I just wanted to let you know that we checked Piper, which is the solution for the audio in the cards that we do not have yet.

[00:09:26] nataliamotand: They have commercial use for the voices, so if we ever need it, it is covered.

[00:09:35] Customer: As far as I understand, it is not for all voices; for Russian, for example, it is not commercially usable.

[00:09:44] Customer: But it is not a problem.

[00:09:47] nataliamotand: Ah, okay.

[00:09:49] nataliamotand: For every language, there are a lot of voices in Piper, from what I read for your action point.

[00:09:58] nataliamotand: Some of them do not have commercial use but some of them have, so we will prioritize using the ones that have the commercial licence.

[00:10:11] Customer: Right now, in general, I do not prioritize voices that have a commercial licence.

[00:10:20] Customer: For now we are building an open source application, so any option that works for us, and produces voice output of high enough quality, is okay, as far as it is compatible with our MIT licence.

[00:10:41] Customer: In the future, the project may transform into something closed source, and then I will think about which models we should use.

[00:10:57] Customer: But it is not a concern for the current project.

[00:11:03] nataliamotand: So, just to make sure I get this right, the primary focus right now is that we have audio and voices of good quality, and not the commercial licence.

[00:11:17] Customer: Yes.

[00:11:19] nataliamotand: Okay. So I guess this is what we had for the action points from last week, and we can move forward with user story 9.

[00:11:32] nataliamotand: We are going to open the product in a browser at an address, without installing anything, and go through each acceptance criterion one at a time.

[00:11:43] nataliamotand: I am going to share my screen so you can see the user stories.

[00:11:53] nataliamotand: Can you please let me know when you see it?

[00:11:57] Customer: Right now I do not.

[00:12:00] Customer: Now I see it.

[00:12:02] nataliamotand: Okay.

[00:12:07] nataliamotand: About acceptance criterion 1, it says: given the production deployment on the university virtual machine, when a person on the university network opens its address in a browser, then the start page of the product loads and nothing is installed on the person's machine.

[00:12:29] nataliamotand: You mentioned previously that you already opened it in a browser.

[00:12:35] nataliamotand: I was wondering if you had to install anything, because that is not the normal behavior, just to make sure that we follow this acceptance criterion.

[00:12:48] Customer: Yes, I accessed it by the provided address, and I did not need to install anything.

[00:12:56] nataliamotand: Okay.

[00:12:59] nataliamotand: About acceptance criterion 2, I am going to show it on my screen now.

[00:13:12] nataliamotand: It says: given the production deployment, when the person pastes a text, marks a word and asks for sentences, then a card with a sentence and a translation appears.

[00:13:28] nataliamotand: I am just going to show it to you, although you already tested this too, just to make sure we have it on record and that you accept this acceptance criterion.

[00:13:50] nataliamotand: This word is not in the cards yet.

[00:13:57] nataliamotand: We are going to ask the language model, and the card appeared.

[00:14:02] nataliamotand: So it is following.

[00:14:07] nataliamotand: This is the card with a sentence and a translation.

[00:14:11] nataliamotand: And this is acceptance criterion 2.

[00:14:19] Customer: Sorry, you can [inaudible].

[00:14:23] Customer: Yes, I agree that it passes.

[00:14:26] nataliamotand: Okay.

[00:14:28] nataliamotand: Acceptance criterion 3 says: given the staging and the production deployments of the same commit, then they answer on different ports, and a text added in staging does not appear in production.

[00:14:41] nataliamotand: I have both deployments here.

[00:14:44] nataliamotand: I do not know if you can see the port, but they are different.

[00:14:53] nataliamotand: 8002 is the production deployment and 8001 is the staging one.

[00:15:00] nataliamotand: As you can see, they are both on the same commit.

[00:15:06] nataliamotand: Here you can see that when we created this new [inaudible], it does not appear in the staging deployment.

[00:15:15] Customer: I see.

[00:15:17] nataliamotand: Okay.

[00:15:19] Customer: This is a more technical acceptance criterion.

[00:15:24] Customer: More technical than necessary, or for other customers it would look too technical, I guess, but it is okay that you put it here.

[00:15:36] nataliamotand: Okay.

[00:15:38] nataliamotand: I am just going to mark here that this acceptance criterion is followed.

[00:15:44] nataliamotand: You mentioned just now that this is not necessary because it is more technical, but I was wondering if there is an acceptance criterion that we did not put here but you think is necessary.

[00:15:57] nataliamotand: Feel free to give your opinion about that too.

[00:16:04] Customer: Maybe an acceptance criterion about browsers.

[00:16:11] Customer: Or maybe that it opens in Firefox and Chrome, on mobile and desktop.

[00:16:18] Customer: I do not think this would be put here otherwise.

[00:16:23] nataliamotand: Okay, thanks for sharing.

[00:16:26] nataliamotand: About this user story, is it accepted or rejected according to these acceptance criteria?

[00:16:36] nataliamotand: We can also add the other one before closing it, that it opens in multiple browsers, both on web and on mobile.

[00:16:50] Customer: I tested it in Firefox, and it does work for me in Firefox.

[00:16:58] Customer: So you can either specify the browser here in the user story and open another one about mobile with its own acceptance criteria.

[00:17:15] Customer: Or you can add some acceptance criteria here.

[00:17:19] Customer: Either way works for me.

[00:17:22] nataliamotand: Okay, so to close this user story, I was wondering if we can add this acceptance criterion today.

[00:17:37] nataliamotand: Since I will not be able to do it right now in the meeting, I was wondering if I can do it and show it to you through the chat.

[00:17:46] nataliamotand: And we can close this user story today, still before the end of the sprint.

[00:17:54] Customer: Okay, I will be available until the evening.

[00:17:58] nataliamotand: Okay.

[00:17:59] Customer: [inaudible].

[00:18:04] Customer: No problem.

[00:18:10] nataliamotand: Thanks for the availability.

[00:18:18] nataliamotand: I guess we can move forward with user story 4.

[00:18:22] nataliamotand: These are the two acceptance criteria that we brought.

[00:18:27] nataliamotand: I would like to demonstrate the first one.

[00:18:34] nataliamotand: Actually, the first one was already demonstrated in the previous meeting.

[00:18:38] nataliamotand: So I would like to move forward with acceptance criterion 2, since we did not change anything about the first one.

[00:18:46] nataliamotand: Acceptance criterion 2 says: given a card I already studied, when I move it to another place in the study queue, then only its due date changes, to fit the new place.

[00:19:04] nataliamotand: Here we can see the cards due today, and they do not show a due date.

[00:19:13] nataliamotand: I would like to move one of the ones in "Later", so you can see.

[00:19:18] nataliamotand: The card "Haus" was previously due on 2 November.

[00:19:24] nataliamotand: That is a Monday, and if I move it here, before "Bahnhof", its date changes so that it fits the intervals of the cards that are ordered.

[00:19:37] Customer: I see.

[00:19:41] nataliamotand: Acceptance criterion 3 is about the change that we agreed on previously.

[00:19:50] nataliamotand: I do not know if you remember, but acceptance criterion 3 was a bit confusing before, because it said that if we delete the card, we cannot reorder it, which makes no sense, because the card is already deleted and should just disappear from the study queue altogether.

[00:20:08] nataliamotand: So we adjusted this acceptance criterion: given a card I delete, when I open the study queue or start a study session, then the card is not there.

[00:20:18] nataliamotand: I would like to show that to you.

[00:20:21] nataliamotand: Here we have, for example, [inaudible].

[00:20:33] nataliamotand: Okay, thank you. If we delete it here, then when we go to Study, it does not show up in the study order.

[00:20:43] nataliamotand: And if we start a session, it does not show either.

[00:20:48] nataliamotand: So that is it.

[00:20:53] nataliamotand: So I was wondering about this user story 4: is it what you need, given the criteria that we show here?

[00:21:00] nataliamotand: Do you accept or reject it, or would you like to suggest any new acceptance criterion that this user story might need and is not shown here?

[00:21:23] Customer: Acceptance criterion 3 definitely passes. I saw the result.

[00:21:31] Customer: I would like to have a look at the exact user story, number 4. Could you please scroll upwards?

[00:21:41] nataliamotand: Yes.

[00:21:44] Customer: I am reading the words of the text.

[00:21:47] Customer: [inaudible] the words of this text to come first in my study order.

[00:21:52] Customer: [inaudible].

[00:22:02] Customer: Please show the second acceptance criterion, how it is written.

[00:22:14] Customer: A card already studied, when we move it to another place.

[00:22:17] Customer: Okay.

[00:22:18] Customer: Yes, you demonstrated this as well.

[00:22:21] Customer: Okay.

[00:22:22] Customer: It also passed.

[00:22:28] Customer: I think we can finalize this user story.

[00:22:38] Customer: [inaudible] we need to [inaudible] to another model, like not only texts exist, but also decks.

[00:22:47] nataliamotand: But also what?

[00:22:49] Customer: Decks.

[00:22:51] Customer: Sets of cards grouped into decks.

[00:22:55] nataliamotand: Okay.

[00:22:57] nataliamotand: Yes, you are correct.

[00:22:59] nataliamotand: In the following sprints we will do the stories that we already settled by the end of this meeting.

[00:23:11] nataliamotand: I would also like to confirm with you the order that we decided on the previous week, to see if it still holds.

[00:23:18] nataliamotand: Neither of the user stories we brought last week was concluded this week, because of the focus on the deployment.

[00:23:28] nataliamotand: So we will resume them in the following weeks, and we would like to confirm whether the priority that you defined still applies.

[00:23:42] nataliamotand: Now, about the language model of the virtual machine.

[00:23:51] nataliamotand: We were using the Gemini model in development, but it refuses requests from the machine's address, since I believe it is located in Russia.

[00:24:08] nataliamotand: So we had to replace it with Mistral Small 3.1, which is currently hosted by Cloudflare Workers AI with a free daily quota.

[00:24:20] nataliamotand: This decision is also recorded in the deployment page and in the risks.

[00:24:27] nataliamotand: The words that the learner marks go from the virtual machine to Mistral Small 3.1, a language model hosted by Cloudflare.

[00:24:39] nataliamotand: I was wondering if you accept that for the product we will use.

[00:24:45] nataliamotand: In the tests that I made this week I noticed no faults in the model, so we can ask for sentences and it gives them, and there is no quality change that I could tell.

[00:25:01] nataliamotand: So I was just wondering if it is okay for you that we use this model instead of the Gemini model.

[00:25:10] Customer: Yes, it is okay.

[00:25:14] Customer: But I expect that later the person will be able to choose another provider, like providing their own API key, so that they can access other models.

[00:25:27] nataliamotand: Yes.

[00:25:30] nataliamotand: Moving forward, as I mentioned previously and AbdelrahmanAbdel-Aal also told you by chat, the study queue counts a day by the server's date and not by the learner's time zone, and the daily limits that you asked for will depend on what counts as a day.

[00:25:47] nataliamotand: We opened an issue for this fix.

[00:25:50] nataliamotand: I was wondering where you would put this fix about the time zone: before the audio, together with the daily limits, or maybe later.

[00:26:04] Customer: I think it is interconnected with the limits, because you should know when the day ends and which cards belong to some date.

[00:26:21] Customer: I wonder how you decide how to store the date: what exactly do you store for a card, the due date?

[00:26:32] Customer: Do you store the time when it is due, or do you store just the date?

[00:26:42] nataliamotand: You mean when the card is created?

[00:26:45] Customer: Or reviewed.

[00:26:49] Customer: So maybe the person clicked "hard" or "easy".

[00:26:56] Customer: Okay, "easy": that is due in four days.

[00:27:01] Customer: So they clicked "easy" at 3 p.m., for example, and therefore it is due in four days at 3 p.m.

[00:27:13] Customer: And then they move to another city or another country with another time zone.

[00:27:21] Customer: And then the card is not due in four days at 3 p.m., but in four days at 2 p.m., for example.

[00:27:35] nataliamotand: Yes, since it follows the server's time, it will be four days in the server's time.

[00:27:45] nataliamotand: So if the student changes to a new country, maybe with a two-hour difference, they would feel this delay on the cards showing up again.

[00:28:00] Customer: Sorry, what did you say?

[00:28:07] nataliamotand: Since the time of the cards' reappearance is decided on the server's side, by the server's time, the user would feel this difference.

[00:28:23] nataliamotand: So instead of the card showing up at the time that is current on the user's computer in the country they are in, it would have this delay.

[00:28:39] nataliamotand: So instead of 4 p.m., it would appear at another time of the day.

[00:28:45] nataliamotand: So the user would feel this delay when studying, and the issue that we created is about fixing this problem.

[00:28:55] nataliamotand: We would have the time of the study queue fixed on the user's computer.

[00:29:07] nataliamotand: So even if they move from country to country, the card would appear again at the same time that they studied it in the previous country.

[00:29:18] nataliamotand: Is that what you asked?

[00:29:20] Customer: The first approach is to use some standard time stored on the server, but you switched to the user's local time right now, or you created an issue at least.

[00:29:48] nataliamotand: Yes, we have not altered this in the application yet, but we created an issue to alter it.

[00:29:56] nataliamotand: If you do not agree with the way we are thinking about doing it, connected to the user's time, and you would prefer, for example, that the day is counted as a whole and not the time itself, then feel free to suggest changes in the issue.

[00:30:10] nataliamotand: We have not started yet, so it will not affect any of the development of the application.

[00:30:20] nataliamotand: So would you prefer it that way?

[00:30:23] Customer: No, I think the date should be granular at the level of time, so it should store both the date and the time.

[00:30:38] Customer: I mean, it will be a timestamp anyway, but it should remember both the date and the time.

[00:30:51] nataliamotand: Okay, so right now, instead of just the due date appearing, you would also like to show the time, so the user can see when the card will be available again.

[00:31:06] Customer: I am not sure it is really necessary.

[00:31:15] Customer: Since this is a study queue and a bit of a low-level thing, I think we can show the time.

[00:31:41] Customer: Even if we did not show the exact time, like 2 p.m., we would need to partition the cards correctly into study today or study later, depending on when the cards are due.

[00:32:00] Customer: If we define "correct" at the level of time, then if a card was marked "easy" at 3 p.m. in some time zone, it appears in four days, regardless of the time zone, in study today.

[00:32:21] Customer: Then we will need the timestamp, the time, to correctly put this card into later or today in four days.

[00:32:42] Customer: So I think we should store the time information anyway, even if we do not show it, or if we decide to show it, we show it.

[00:32:56] nataliamotand: Okay, just to make sure I get this right: time is relevant for when the cards should appear again, and the alternative that we are not following is that each day is separate for when the cards appear again.

[00:33:18] nataliamotand: So even if I studied a card yesterday at 8 p.m., and today is a new date, this card should only appear to me at 8 p.m. today, right?

[00:33:30] nataliamotand: Does this example make it clear? If not, I can rephrase it.

[00:33:36] Customer: This is a very good question, okay.

[00:33:45] nataliamotand: I think Anki works by date, so even if I answered the question yesterday evening, today in the morning, if the question was "hard" or to be repeated one day after, I think I would be able to do it again, independently of the time at which I go through the deck.

[00:34:04] nataliamotand: So I am just making sure that we are following a different approach, or maybe that is not the case.

[00:34:20] Customer: Okay, I think I did not consider what Anki does in this case, and I am not sure how it interacts with time, like storing the time.

[00:34:44] Customer: So if I studied a card today at 11 p.m. and marked the card as "easy", it should appear in four days in my current time zone.

[00:35:09] Customer: So not at 11 p.m., but it should be available since 12 a.m., since the start of the day in four days, right?

[00:35:25] nataliamotand: Yes, in my opinion it should be available on the date and not at the specific time, but the date starting in the time zone that you are currently in.

[00:35:45] Customer: And so basically you record the time when the card was marked "easy", for example, then you calculate the next time: the time of marking plus the interval, four days, and then you look at the date in the current time zone when this card should appear, and it would be today.

[00:36:34] nataliamotand: Okay.

[00:36:36] nataliamotand: But how does it work when I switch the time zone?

[00:36:47] nataliamotand: How is it working right now, and how should it work when I switch the time zone?

[00:36:55] Customer: So we have three points in time: the current time, the time of marking, the current time plus the interval, and the final date.

[00:37:14] Customer: It is the date to which the current time plus the interval belongs.

[00:37:21] Customer: I am not sure if I named it in an understandable way.

[00:37:31] nataliamotand: Okay, let's call them current time, future time and future date, so it is easier to keep in mind.

[00:37:50] nataliamotand: I guess the future date, because this is tricky, it is a very technical decision, and it is about how the user would be affected by it.

[00:38:08] nataliamotand: I guess the primary thing we should consider is the full day of the place where the user is at the moment.

[00:38:16] nataliamotand: So they do not feel that changing time zones changed the day when they were supposed to redo the card.

[00:38:25] nataliamotand: If we take this into consideration, maybe we can look at the future date first and trace it back from that.

[00:38:38] nataliamotand: Did you understand? If today is 31 October and I do a card here, and I move back to [redacted], I would like to see this card show up again on, for example, Monday, two days from now, in the case that it is of medium difficulty.

[00:38:59] nataliamotand: So if we count the full days, it is less perceptible for the user, because I guess the user perceives more the date, the day of the week, of the place where they currently are.

[00:39:20] nataliamotand: So I guess the time zone is an important thing for us to consider.

[00:39:26] Customer: Okay, I almost got your example.

[00:39:31] Customer: But it would be better to consider exact times.

[00:39:41] Customer: I mean, 1 a.m. in one time zone can be 11 p.m. in another one, on the previous day.

[00:39:57] Customer: So if a user expects that they learn this card in two days in the current time zone, it may become not two days but one day when they move to another time zone, if I am not mistaken.

[00:40:21] Customer: So something should be done about that.

[00:40:30] nataliamotand: Okay, I understand your point.

[00:40:35] nataliamotand: I think the most productive thing for us would be that I do this as an action point, and maybe show you when I have visuals, to look at what would happen in each scenario.

[00:40:50] nataliamotand: We would look at the dates when the card was studied and at each of the options that we could apply, depending on the time zone.

[00:41:00] nataliamotand: So we can visualize specific cases, like the user did a card at the beginning of the day, at 1 a.m., or maybe at 11 p.m., and what would happen then, so you can see it and we make sure that we agree on the same thing.

[00:41:11] nataliamotand: Is that okay with you?

[00:41:19] Customer: Yeah, sure. Thank you.

[00:41:22] nataliamotand: I understand your point, and I think it is a valid concern.

[00:41:26] nataliamotand: Once it is settled between us, we can implement it in the application.

[00:41:36] Customer: I agree.

[00:41:38] Customer: Okay, thank you for this suggestion.

[00:41:41] nataliamotand: You are welcome.

[00:41:44] nataliamotand: This was a shorter meeting.

[00:41:47] nataliamotand: What we have now is the decision about the next stories and a few open questions from Week 4.

[00:41:56] nataliamotand: I will go with the following stories, and I will share my screen again so you can see them.

[00:42:05] nataliamotand: These are the features that we have, and the order that was set for the next stories is that we should do the audio first.

[00:42:25] nataliamotand: Then the daily limits with asking for more cards, then the decks apart from the texts, and finally the teacher's review.

[00:42:35] nataliamotand: I was wondering if this order still holds.

[00:42:40] nataliamotand: It is the order that I sent in the message after last week's meeting.

[00:42:48] Customer: Okay, let me check it.

[00:42:52] nataliamotand: I am going to re-send the message so it is easier for you to check.

[00:43:02] Customer: Okay, thank you.

[00:43:12] nataliamotand: You are welcome.

[00:43:14] Customer: So where is the order here?

[00:43:30] Customer: Okay, the last paragraph.

[00:43:33] Customer: Audio first, daily limits and request more cards, then decks, then the teacher's review.

[00:43:41] nataliamotand: But in today's meeting you mentioned the decks.

[00:43:47] nataliamotand: That is why I am asking this again, just to make sure that the decks are still after the audio and requesting more cards.

[00:43:58] nataliamotand: Or maybe you feel that the decks should come first and then the audio?

[00:44:08] Customer: Yes, I think the decks should come first, because it is more of an architectural change.

[00:44:18] Customer: Okay, not very architectural, but it may change the schema of your database.

[00:44:23] nataliamotand: For the structure?

[00:44:26] Customer: Yes, and also the UI will change, because you are not showing the text titles on the study queue page but deck titles.

[00:44:40] Customer: The audio may come next.

[00:44:45] Customer: You already have some research, and I think it remains just to deploy the model.

[00:44:53] Customer: And then you already have the foundation for the daily limits.

[00:45:05] Customer: At least you have the way to partition cards.

[00:45:10] Customer: So the daily limits will just be a little addition on top of it.

[00:45:18] Customer: Given that we decide how to handle the timestamps.

[00:45:23] Customer: And the teacher's review may come later.

[00:45:27] nataliamotand: Okay, so we are moving forward with the decks logic that we are going to implement.

[00:45:36] nataliamotand: Then the audio, then asking for more cards, since it is not so big.

[00:45:41] nataliamotand: And at last the teacher's review.

[00:45:46] nataliamotand: Is that correct?

[00:45:47] Customer: Yes, yes.

[00:45:49] nataliamotand: Okay, so I think we can move forward with the follow-up questions from the previous week.

[00:45:59] nataliamotand: The first one is: should the study queue show the titles of the decks and not of the texts, and what changes in case the queue has a card in several decks?

[00:46:15] nataliamotand: This was something that you mentioned in the previous week, but we had not discussed it.

[00:46:23] nataliamotand: So I was wondering if you would like to decide this now.

[00:46:26] nataliamotand: Since we decided that the next story that we are going to implement is the decks, I think this is a valid question.

[00:46:34] Customer: Okay, so I am not sure if we should show the deck titles in the study queue rows, for each card.

[00:46:56] Customer: I think what we can do is show a list of decks above this list of cards.

[00:47:06] Customer: So that the student may select particular decks, like they can select texts right now.

[00:47:17] nataliamotand: Here, you mean?

[00:47:19] Customer: Yes. But here they are in the same row, and deck titles may be long.

[00:47:30] Customer: Therefore I think it would be better to put them into a list, like Anki does right now, and let the user mark with checkboxes, or somehow else, the decks that they want to study.

[00:47:51] nataliamotand: Okay, so the start session button has to be connected to this filter that the user is going to make about which decks they will study.

[00:48:03] Customer: Yes.

[00:48:05] Customer: Basically, the study queue will either not show the cards that belong to non-selected decks, and only show cards from decks that were selected.

[00:48:23] Customer: Or it should show all cards, but mark some cards as not selected, or something like this.

[00:48:33] Customer: I think we should apply the filter for a deck.

[00:48:37] nataliamotand: I think we need to have a list that contains all the cards that the student has, both for today and for later, so we can visualize how it is displayed.

[00:48:49] nataliamotand: But I think we need to have a filter, and make sure that its interface is friendly, and that the learner understands that if the filter is selected, the session will only take the cards that are in the selected decks.

[00:49:11] Customer: Yes, I agree.

[00:49:18] Customer: I am more inclined towards not showing cards from non-selected decks, because filtering by only the selected decks will show the complete picture to the user.

[00:49:41] Customer: They will see which cards are due today and which ones are due later.

[00:49:48] Customer: On the other hand, if we show the cards that were not selected by deck, and show them in the today section but highlight them somehow as not selected, then the user may get confused about which cards exactly they are going to review today.

[00:50:18] Customer: So maybe just hide such cards.

[00:50:23] nataliamotand: Okay, I think it is a valid concern, and I understand what you mean right now.

[00:50:28] nataliamotand: I have an idea that I think corresponds to your suggestion, and I just wanted to make sure it is okay with you.

[00:50:37] nataliamotand: I was thinking that as soon as we start the page, all of the decks will be selected, so the student has initial access to all the cards.

[00:50:49] nataliamotand: Then when they deselect a deck, by clicking a button, they do not see the deck anymore and its cards disappear, but they can still check all the cards that they have.

[00:51:05] nataliamotand: Or maybe they could start with the list empty and no selected decks.

[00:51:13] nataliamotand: And as they select the decks, the cards will be shown with their respective due dates.

[00:51:22] nataliamotand: That is another option also.

[00:51:24] Customer: Oh, okay, I did not get the second option.

[00:51:35] nataliamotand: The second option is that, instead of all the decks being selected and the student clicking to remove some of them, it could start with none of the decks selected, so none of the cards will be shown.

[00:51:56] nataliamotand: And as the student selects the decks, the cards that belong to the deck will be shown.

[00:52:04] nataliamotand: Maybe we can also change the order in which the page is displayed, so there is a clear sequence for the user.

[00:52:09] nataliamotand: In the first step, you select which decks you are going to study.

[00:52:18] nataliamotand: And when you have those selected, the button that starts a session shows up.

[00:52:24] nataliamotand: What I am most concerned about is that it is important that the user studies based on the decks they filter.

[00:52:33] nataliamotand: But maybe some day they just like to go through all of the cards, to do a quick overview of everything.

[00:52:43] nataliamotand: So we should think of a way that is easy for the students to access and user friendly.

[00:53:01] Customer: Yes.

[00:53:05] Customer: I mean, if they want to study all cards, we can provide a "select all" button.

[00:53:14] nataliamotand: Okay.

[00:53:17] Customer: Initially it is unselected, so when they click this button, all decks are selected, and when they click this button again, none of the decks are selected.

[00:53:33] Customer: Basically it is like your "clear selection", but with two states.

[00:53:42] nataliamotand: Okay.

[00:53:47] Customer: So there is a problem that we will need to somehow marry this new functionality, selecting decks as a filter for what appears in the study queue, with the previous one, where we could select texts to drag cards inside the study queue.

[00:54:25] Customer: Maybe we can still use the same list of deck titles, like the text titles here, but provide two actions in each row.

[00:54:45] Customer: Maybe an eye icon that, when you click it, hides all cards of this deck from the study queue.

[00:54:57] Customer: And another one, maybe a button that is responsible for selecting cards from those decks to move them inside the study queue.

[00:55:23] Customer: So this is one option.

[00:55:25] Customer: Another option is that we somehow keep just one button for selecting decks, and then manipulate the cards using those selected decks.

[00:55:57] Customer: But then it is not completely obvious how to hide some cards from the study queue after manipulating cards.

[00:56:12] Customer: So maybe you selected a deck, then moved cards from that deck to later.

[00:56:19] Customer: Then you want to hide these cards and hide cards from another deck.

[00:56:27] Customer: So what do you do?

[00:56:29] Customer: You select another deck, and this one, and click something to hide them, or what?

[00:56:37] Customer: You unselect?

[00:56:45] nataliamotand: Yes.

[00:56:51] nataliamotand: I do not know which is the best way for us to do it, but maybe unselecting will make the cards disappear.

[00:57:03] nataliamotand: I understand your concern about mixing the session and the reordering, since they are connected, but they are two different issues that we have to deal with.

[00:57:20] nataliamotand: I am not quite sure right now which would be the best way for the user to have these options displayed, but we can give more thought to this.

[00:57:36] nataliamotand: Maybe we could have one view for re-prioritization and another view only to select what you are studying right now.

[00:57:48] nataliamotand: Is that a possibility for you, these two separate views?

[00:58:00] Customer: Yes.

[00:58:02] Customer: So maybe have separate tabs, one for re-prioritization and one for studying, filtering what to study.

[00:58:14] Customer: Yes, this looks like a viable option.

[00:58:21] Customer: It seems like there are no cases when the student needs to interleave both actions, like hiding some cards and re-prioritizing them at the same time.

[00:58:43] Customer: If they want, they can choose one of the tabs and do some actions there.

[00:58:55] Customer: These actions will be reflected in the other tab.

[00:58:59] Customer: So, for example, with the re-prioritization tab and the filtering tab, they can filter in the filtering tab, and then in the re-prioritization tab only cards from the enabled decks will be displayed.

[00:59:22] Customer: And vice versa, if they re-prioritize something in the re-prioritization tab, then in the filtering tab this order will be preserved.

[00:59:35] Customer: Maybe something like this can work.

[00:59:37] nataliamotand: I think it is a good option, I can visualize how it would be, and we can implement it next week and show it to you, to see if you agree with it.

[00:59:50] nataliamotand: I think it is more intuitive if we separate it into two tabs, because the user will not be overwhelmed with too many options and too much information in only one tab, about selecting what they are going to study and selecting the order.

[01:00:14] nataliamotand: So I guess that is a valid way for us to follow.

[01:00:18] Customer: Yes, I agree. Thank you for this idea.

[01:00:22] nataliamotand: You are welcome.

[01:00:24] nataliamotand: Finally, I have one more question.

[01:00:28] nataliamotand: It may come out of context, because it is something that we discussed in the early meetings of the project.

[01:00:37] nataliamotand: It is about flagging.

[01:00:39] nataliamotand: I remember that we mentioned the differences between flagging for the teacher and for the student.

[01:00:49] nataliamotand: A question that was brought up is whether we should have one flag or two flags.

[01:00:57] nataliamotand: The options that we mentioned were two flags: one is a flag to review and one is a flag to regenerate.

[01:01:04] nataliamotand: The user would flag, the teacher would be able to see this, and depending on the flag that the user chose, the teacher would decide.

[01:01:17] nataliamotand: So I think the main question is whether you think this is really necessary, or we can keep the flag as it is, as something more general that the user wants to highlight.

[01:01:33] nataliamotand: So the user or the teacher can see that this is a card that should be reviewed in some way.

[01:01:41] nataliamotand: This question is just to understand if you think we need different kinds of flags for this application, or if only one is enough.

[01:01:57] Customer: Okay, I do not quite understand the purpose of the second flag.

[01:02:04] Customer: The first one is for a student to tell the teacher "I want you to look at this card", right?

[01:02:15] nataliamotand: Yes.

[01:02:16] Customer: Okay, and the second one is about regeneration.

[01:02:21] Customer: Was it intended for a teacher or for a student, just to select cards and then regenerate them in a batch?

[01:02:35] nataliamotand: It is for when they are in doubt whether the card is correct and it should be regenerated.

[01:02:43] nataliamotand: Or maybe it is the case that we mentioned previously: when the model does not respond, the product repeats the request to the language model.

[01:02:54] nataliamotand: But if it reaches the maximum number of times it should request again, then it should automatically flag the card, so the user knows that they have to click the regenerate button manually.

[01:03:09] nataliamotand: I think this flag was mainly about this problem.

[01:03:14] Customer: Okay, so we can pursue this direction with [inaudible], or we can reuse some button, or select empty cards or invalid cards and regenerate, something like this.

[01:03:43] nataliamotand: Oh, I think it is a good option, because then the student does not have to look in the table and click more than one button.

[01:03:51] nataliamotand: They can just see this button, to regenerate the invalid ones, and ask for them.

[01:04:00] nataliamotand: So I think it is a good solution for the problem.

[01:04:06] Customer: Okay, let's go with this option then.

[01:04:10] Customer: As for [inaudible] for a teacher, honestly, right now I am not sure if the teacher idea is very good.

[01:04:24] Customer: There is a problem of discoverability, like accounts and so on.

[01:04:35] Customer: How does a student discover the teacher on the platform?

[01:04:41] Customer: Okay, they can discover them by email, but this will introduce two types of accounts, some complications, and some more specialized interface for a teacher.

[01:05:01] Customer: And since another team goes in this direction, and I would care more about the UX part for the student, I would like to abandon this direction with the teacher in your project.

[01:05:23] Customer: What do you think about that?

[01:05:26] Customer: Is it okay?

[01:05:28] Customer: Or did you do some work towards supporting teachers?

[01:05:35] nataliamotand: We still have not done the work towards the teacher vision.

[01:05:40] nataliamotand: I guess it is okay; I am just worried that the project will be incomplete.

[01:05:48] nataliamotand: But if you think it is best that we focus on this other direction, I guess it is okay, no problem.

[01:05:56] nataliamotand: But I am afraid that, in comparison to other changes, our application will be less of a usable solution for the kind of problem that we wanted to fix at the beginning of the semester, which was about studying, and teachers and users could do this for language learning.

[01:06:24] nataliamotand: But if you think it is best that we do not develop towards it, it is okay also.

[01:06:34] Customer: You should decide what is necessary for you in this application.

[01:06:40] Customer: Honestly, I thought about trading the teacher functionality for offline usage of the application.

[01:06:49] Customer: Right now it is not usable offline, because it is a site that needs to reach the web server.

[01:06:59] Customer: And I think it does not cache any audio on the client side, and does not store any audio, or texts, or sentences.

[01:07:13] Customer: So what do you think about going in this direction?

[01:07:17] Customer: Maybe creating a mobile version that can run offline, maybe without changing the stack drastically.

[01:07:30] Customer: I guess you use React or something, and I think it can run on mobile as a mobile application.

[01:07:44] nataliamotand: I think it is a valid option, also a path for us to follow, and I am okay with that idea.

[01:07:53] nataliamotand: But just to make sure about the mobile: do you mean making it available on the Play Store, or the App Store, or something like that, for the user to download, or just accessing it through the web?

[01:08:14] Customer: I think right now it is enough to release an installable file on GitHub.

[01:08:22] Customer: For example, you release an APK file, and then I install it on my Android phone, and the user can do the same.

[01:08:33] Customer: I am not sure about [inaudible] here, whether they release their mobile versions on GitHub.

[01:08:43] Customer: But it is a valid distribution channel for an open source application.

[01:08:52] Customer: So yes, I release it on GitHub for the MVP.

[01:09:02] nataliamotand: Okay, we can do that.

[01:09:04] nataliamotand: So, just to make sure I get this right: we are not focusing on the teacher interface anymore.

[01:09:16] nataliamotand: And we are focusing on the offline mobile version of the application.

[01:09:21] nataliamotand: So it is an application more focused on the person who is trying to learn a new language in an autonomous way.

[01:09:32] Customer: Yes, exactly.

[01:09:34] nataliamotand: Okay.

[01:09:36] nataliamotand: I think it is a good idea, no problem.

[01:09:39] nataliamotand: We can move forward with this direction.

[01:09:44] nataliamotand: Thank you very much for everything.

[01:09:47] Customer: There can be some lessons learned from [inaudible] here.

[01:09:52] Customer: Basically, [inaudible] allows [inaudible] the local files and previous versions of these local files.

[01:10:03] Customer: The [inaudible] are stored on the web server.

[01:10:09] Customer: [inaudible].

[01:10:09] Customer: And when you connect a mobile application to the server, you need to reconcile these versions of local files.

[01:10:19] Customer: So I would suggest that local files are not editable while offline.

[01:10:27] nataliamotand: Okay.

[01:10:30] nataliamotand: I do not have an opinion formed about this yet, but I agree with following what you are suggesting.

[01:10:45] nataliamotand: So we can take a look at this in the following sprints.

[01:10:53] Customer: Right.

[01:10:55] nataliamotand: Yes.

[01:10:57] nataliamotand: So that concludes what we had planned for the meeting today.

[01:11:03] nataliamotand: I would like to thank you again for your time and availability for showing up for the meeting and doing all these things together.

[01:11:13] nataliamotand: So thank you, and have a great day.

[01:11:16] nataliamotand: If you have any further questions, feel free to reach out, and also to ask them right now if you prefer.

[01:11:25] nataliamotand: But anyway, thanks for the time.

[01:11:29] Customer: Right now I do not have any questions.

[01:11:33] Customer: Thanks a lot for working on this project and dedicating your time to it.

[01:11:39] Customer: You are making good progress. Please keep doing that.

[01:11:45] nataliamotand: Thank you.

[01:11:47] Customer: And good luck with the project.

[01:11:49] nataliamotand: You too. Have a great weekend.

[01:11:51] Customer: Thank you. Have a great weekend too.

[01:11:54] nataliamotand: Okay.
