# Week 6 Sprint Review meeting transcript

- **Date:** 2026-11-08
- **Participants:** nataliamotand, Customer

The Customer gave permission to record the meeting and to publish the sanitized transcript in this repository, in two answers at [00:01:55] and [00:02:05].
The recording had already started when this was asked, so the exchange before the questions is in this transcript from [00:01:02].
The Customer was not asked whether the recording may be shared privately with the instructors, because he allowed the transcript to be published.
The transcript was produced with a speech-to-text tool run on the team's own computer from the recording, and the team then corrected it.
The tool did not mark who was speaking, so the speaker of each turn was assigned from the content of the turns; a turn may start or end a few seconds away from the stamped time.
Filler words and false starts were removed, punctuation was added, and words the tool misheard were corrected from context.
`[inaudible]` marks speech that could not be made out, and `[redacted]` marks a name or a place that was left out on purpose.
The times are those of the recording file; the first speech on it is at 00:01:02.
Each line is one sentence, with the start time of the segment it was said in.

[00:01:02] Customer: Good morning.

[00:01:02] nataliamotand: Good morning, [redacted]. How are you?

[00:01:08] Customer: Fine, thanks. How are you?

[00:01:11] nataliamotand: I'm fine also. Thanks for asking.

[00:01:16] nataliamotand: I think the weekend starts today.

[00:01:19] nataliamotand: I don't think the boys will be attending.

[00:01:22] nataliamotand: So I guess there's no need for us to wait five minutes. Is that okay with you?

[00:01:29] Customer: Yes.

[00:01:31] nataliamotand: Okay. So firstly, I'd like to thank you for having time for this meeting.

[00:01:38] nataliamotand: And before we start, I'd like to ask the normal questions we usually do.

[00:01:43] nataliamotand: So may we record this meeting?

[00:01:52] Customer: I couldn't hear you.

[00:01:52] nataliamotand: May we record this meeting?

[00:01:55] Customer: Yes, sure.

[00:01:57] nataliamotand: Okay. Thank you. And can we also publish a transcript of it in our repository?

[00:02:05] Customer: Yes, you may publish.

[00:02:09] nataliamotand: Thank you. So for the meeting today, I've arranged to show you five things.

[00:02:16] nataliamotand: First one is the product with the new deck logic that we had agreed on in the previous meeting.

[00:02:23] nataliamotand: I'd also like to show you the analytics dashboard, the observability dashboard, the results of our observability test, and a short review of our threshold of success.

[00:02:29] Customer: Okay.

[00:02:41] nataliamotand: I'll share my screen. Can you see it?

[00:02:44] Customer: Yeah, I can see it.

[00:02:44] nataliamotand: Thank you. So the product on the production instance is the one that I have here on my screen.

[00:03:10] nataliamotand: Since the core task is the one I want to repeat, I will focus here on the user story about the decks.

[00:03:19] nataliamotand: So I'll show you what's new.

[00:03:21] nataliamotand: I'll go through each of the acceptance criteria that we established for user story 11, which is "Keep my cards in decks and study only the decks I choose".

[00:03:33] nataliamotand: The first acceptance criterion is that when I ask for a sentence, I can tick one or more decks of the language pair of my text, and every new card is in each deck I tick.

[00:03:49] nataliamotand: I will paste a text here, mark two words and tick an existing deck, so you can see this acceptance criterion. Did you understand it?

[00:03:59] Customer: Not completely. Please show what you mean.

[00:04:03] nataliamotand: Maybe it's because of how I said it. I also opened the user story here so you can read it, and maybe it's more understandable.

[00:04:12] nataliamotand: I'm going to demonstrate it in the first row right now. Then I can tick one or more decks of the language pair of my text, and the new card is in each deck I ticked.

[00:04:31] Customer: What does it mean, "tick"?

[00:04:43] nataliamotand: Tick means that I check the checkbox of the deck.

[00:04:58] Customer: And what is the language pair?

[00:04:58] nataliamotand: The language pair is these two languages: the language of the text I paste and the language of the translation. Each deck is associated with one pair of these languages, as we had previously agreed.

[00:05:18] nataliamotand: So depending on the pair that I choose, the decks show or do not show, in case a deck for that pair doesn't exist.

[00:05:33] Customer: It's like filtering by the pair.

[00:05:33] nataliamotand: Yes. Is that okay with you?

[00:05:41] Customer: Yes. That's what we agreed on.

[00:05:47] nataliamotand: Here, for example, I chose two words and I can click a deck that already exists.

[00:06:01] nataliamotand: In this case, if I ask for sentences, both of these cards will be in this deck.

[00:06:07] nataliamotand: Before asking for sentences, I would also like to show you acceptance criterion number two, which says that in case there is a deck that doesn't exist yet, I can make it and I can also put cards in this deck.

[00:06:23] nataliamotand: This is the one that I'm going to show right now. In this case, I can make a new deck, and when I create it, it will also be checked.

[00:06:39] nataliamotand: When I ask for new cards, both of these cards will be in both of these decks.

[00:06:49] nataliamotand: Here you can see the success message that two cards were created and they were placed in two different decks.

[00:07:38] nataliamotand: This is acceptance criteria one and two. I can move forward with acceptance criterion number three: given cards in several decks, when I tick decks on the study page, then the queue shows only the cards of those decks, each card with the names of all its decks.

[00:08:05] nataliamotand: It might be a little confusing, but I'll explain it better.

[00:08:10] nataliamotand: Here in the study page, we reorganized it in the way that we had previously mentioned, with the different steps for studying and for reordering, so we don't have confusion. I thought it was best to keep the UI like this so it's cleaner.

[00:08:32] Customer: I'm sorry, I got disconnected a couple of minutes ago. Would you please return to the previous step where you added a new deck and demonstrated how you generate sentences?

[00:08:55] nataliamotand: I don't know if you saw, but I created this new deck here. Did you see "animals"?

[00:09:04] nataliamotand: I asked for new sentences and then the two cards were shown here in "Your cards", and a success message appeared saying that both of these cards were created and added to two different decks.

[00:09:21] Customer: All right. Can I see which deck each card belongs to?

[00:09:30] nataliamotand: Yes, of course. Here in the study session, we...

[00:09:36] Customer: In that panel?

[00:09:38] nataliamotand: In the previous tab.

[00:09:42] nataliamotand: So here is a text. The texts are created into decks, but here we can't see the deck on the "Your cards" tab.

[00:09:53] nataliamotand: We can only see it here in the Study tab, when we click, and then we have the cards with each of their decks displayed above each card.

[00:10:07] nataliamotand: In this case, since "Hund" and "Katze" were created, they come here at the bottom, ordered by due date. That is the business rule that we established.

[00:10:22] nataliamotand: And in this case, the "animals" deck, which is the one that I created especially for these new cards, shows both of them here.

[00:10:38] nataliamotand: About the UI, I was telling you that the UI initially is like this, as we described, with two different sets, one for reordering and one for studying.

[00:10:52] nataliamotand: I decided not to use a toggle for reordering, because it's not the main thing but something additional that the user might want to do.

[00:11:06] nataliamotand: So the initial view is like this, with no decks checked. Then the user can check which of the decks he wants to study.

[00:11:16] nataliamotand: He also has a "select all" button, to make it easier in case he doesn't want to make this distinction and just wants to study everything that he has for the day.

[00:11:28] nataliamotand: And here in the study panel, we have the number of cards that he is going to study if he starts a new session, and the number of decks that he is going to study, which in this case are the ones that we checked here.

[00:11:43] nataliamotand: Are you still connected?

[00:11:47] Customer: Yeah, I hear you. Looks good.

[00:11:51] nataliamotand: Okay. Thank you. It's not something that you asked for, but I thought it might be something that the user might want.

[00:12:04] nataliamotand: I put it here so you can see how it works and tell me your opinion about this button.

[00:12:10] nataliamotand: I added a checkbox that allows the user to not necessarily study in the reorder. The order is his prioritization of each of the cards, and it stays the same depending on the answers that he gives.

[00:12:27] nataliamotand: But he might also have a choice to shuffle the order of the cards he is going to study today.

[00:12:34] nataliamotand: I thought about this because if you do the same thing a lot, you start memorizing the order of the cards, and some users might want to shuffle it sometimes. So I just added this checkbox.

[00:12:50] nataliamotand: I would also like your opinion about this, since you are a language learner. Do you think this button is necessary and you would like to keep it, or maybe remove it?

[00:13:04] Customer: It depends on how your scheduler works. In Anki, usually cards are naturally shuffled because they are rescheduled after your answer, whether it was easy or hard and so on.

[00:13:26] Customer: So in Anki, it's not necessary to shuffle them manually. Did you observe that they appear in the same order somehow?

[00:13:40] nataliamotand: Yes. If you don't check this shuffle, they always appear in the prioritization that you chose, depending on the day.

[00:13:50] nataliamotand: Since you start a session and study from top to bottom, if you always check the cards, for example, a few days from now, you'll always see them in exactly the same order if you repeat the cards.

[00:14:10] nataliamotand: So they will be in an order that repeats every day, if the card is scheduled for the next day. This is why I thought it was necessary, because it doesn't automatically shuffle like Anki.

[00:14:33] Customer: Okay. Maybe I don't know exactly how Anki works, and therefore I assume that it shuffles.

[00:14:56] Customer: Maybe it uses time-based reordering. If you have a card that is due in one minute and another one due in one minute, after clicking "again", then the one that was clicked earlier will appear earlier.

[00:15:20] nataliamotand: Exactly.

[00:15:25] Customer: Okay. But if we have a card that is due in a day and one that is due in one minute, then the one due in one minute will appear earlier.

[00:15:41] Customer: And even if it appeared before the easy cards, after you click "easy" on this card, it should appear after the card that you clicked "easy" on.

[00:16:07] Customer: Sorry, let me structure the example. Suppose you have cards A and B. You see A and you click "easy", and that will appear in one day. I don't quite remember the interval for "easy". If I'm not mistaken, "easy" is four days.

[00:16:43] Customer: No, sorry. First you see card A and you click "again", because it's not very easy, and it will appear in one minute.

[00:16:59] Customer: Then you see card B and you click "easy", and it will appear in four days. Then in around one minute you see card A again and you click "easy", so it will appear in four days.

[00:17:16] Customer: If the scheduling is based on timestamps, then the order will change. Card A will appear after card B, because it was answered after.

[00:17:33] nataliamotand: Yes.

[00:17:39] Customer: So the shuffling will occur. I'm not sure if it's possible with your current scheduler and how it will work.

[00:17:51] Customer: And usually you don't stick to "easy" always. Sometimes you choose the other options, which give intervals of less than four days in your case, so the cards may get reordered this way as well.

[00:18:25] Customer: One card will appear in one day and another card in four days, and so there will be even more than one card between those cards in the static queue. I assume that shuffling will occur naturally.

[00:18:44] nataliamotand: Okay, makes sense.

[00:19:05] nataliamotand: So I guess we can revisit the button, maybe not display it here, since the shuffling will happen as the user uses the platform. I guess we can adjust this. Thanks for sharing your opinion.

[00:19:12] nataliamotand: Thank you for validating this feature. So, moving forward with acceptance criterion three: on the study page I check decks and the queue only shows the cards of those decks, each card with the names of all its decks.

[00:19:32] nataliamotand: In this case, I displayed "animals" and you can see both of the cards that were created here in the previous tab.

[00:19:43] nataliamotand: If you remember, I also added these cards to the "travel" deck. If you look closely, you only see the cards "food" and "cats" once here, as it is established by the application.

[00:19:57] nataliamotand: Even though they belong to different decks, they are the same cards, so in the same study session they shouldn't repeat. Is that okay behavior with you?

[00:20:10] Customer: So one card was generated and it was added to two decks, right?

[00:20:19] nataliamotand: Yes.

[00:20:23] Customer: And so it appears only once in the study queue, right?

[00:20:28] nataliamotand: Yes, exactly.

[00:20:28] Customer: And it shows the decks it belongs to?

[00:20:31] nataliamotand: Yes.

[00:20:35] Customer: Yes, I agree with this behavior.

[00:20:35] nataliamotand: Okay.

[00:20:42] nataliamotand: So this was acceptance criterion three. I'm going to move forward with acceptance criterion four, which says that when I give a queue a new order and save it, then the study session shows the cards in that order.

[00:20:57] nataliamotand: So here, for example, the reordering says that "Hund" will be the first card that appears in a session and "Katze" the next.

[00:21:06] nataliamotand: But if I move it here and the order is saved, when I start the session I can see that "Katze" was the first card that appeared in the session.

[00:21:16] nataliamotand: So this is acceptance criterion four. It's more related to the queue user story, but I also wanted to show you that the behavior stays the same in spite of the decks logic that we implemented.

[00:21:31] nataliamotand: The logic of this study queue wasn't changed. So that's it for user story 11.

[00:21:45] nataliamotand: I'd also like to tell you that we had to make some changes in the data and how it was stored. Initially we didn't have cards associated to decks, so I redid the data that we had.

[00:22:02] nataliamotand: The migration also made a deck called "Earlier cards" for each of the pairs of the previous cards.

[00:22:10] nataliamotand: But you won't be able to see it, because I changed the data that we had, since it was only experimental. So I guess that's no problem.

[00:22:10] nataliamotand: I'd also like to add that production runs the main branch right now, since you're seeing it in production.

[00:22:29] nataliamotand: We'll tag release number six after this meeting, on the commit that production runs.

[00:22:39] nataliamotand: Also, about the previous action points from week five: one of them was the decks that I just showed you.

[00:22:47] nataliamotand: The other two were the change about the tests of the language model to make sure that everything was correct, and the time zone scenarios, the visualization that we talked about. Both of these action points were not carried out until this week's work.

[00:23:09] nataliamotand: So we are proposing to carry both of them to week seven and show you at the meeting.

[00:23:17] nataliamotand: It happened because we decided to prioritize the implementation of the decks logic, which was a little bit extensive, and both of the dashboards that the week six assignment asked for.

[00:23:33] nataliamotand: So I was wondering if it's okay for me to return to these two action points next week.

[00:23:41] Customer: Yes. It's right that you reprioritized when new information appeared mid-sprint.

[00:23:51] nataliamotand: Okay. So this is user story 11. I was wondering if what I showed you against the acceptance criteria is accepted or rejected by you.

[00:24:08] nataliamotand: I mean, if you had any doubts or maybe something else that you would like to see here that wasn't carried out?

[00:24:17] Customer: Okay. Let me look at the other two acceptance criteria. Should I look at them, or are they not completely implemented yet?

[00:24:31] nataliamotand: AC-03 and AC-04? No, they are implemented. I showed them to you. Maybe it wasn't clear. I can show it again if you like. Can you see my screen?

[00:24:49] Customer: Yeah, I can see it. I'm just reading AC-03.

[00:24:52] Customer: Oh, okay. Each card once with the names of all the decks. Yeah, that's what you showed. AC number three, each card appears once.

[00:25:07] Customer: And "given a new order of the queue, when you save it, then the study session shows the cards in that order".

[00:25:13] Customer: Okay, I got it. Yeah, you showed all of them. I should add something. Let me think a bit.

[00:25:49] Customer: No, I think nothing should be added related to this user story.

[00:25:56] Customer: Although I have a couple of comments about the UI.

[00:26:04] nataliamotand: Okay, should we discuss them now?

[00:26:07] Customer: Yes, sure.

[00:26:09] nataliamotand: Okay.

[00:26:10] Customer: So I think, since the shuffle might disappear, probably this whole study panel can be between reorder and decks, or even embedded into some other panel.

[00:26:33] nataliamotand: Okay.

[00:26:40] Customer: No, I think there is no need to join the decks and study panels. But I think the study panel would be above the reorder panel.

[00:26:57] Customer: I think the reorder panel is an important feature and it should not be collapsed. It should be quickly accessible to a user.

[00:27:07] nataliamotand: Okay.

[00:27:14] Customer: And the start of the session may also be somewhere... Maybe the study panel should even appear above the decks, because it provides the summary for the whole page, like how many decks are ticked or how many cards are due today, and then the start of the session.

[00:27:35] Customer: So the user on mobile devices should not have to scroll to click "start the session".

[00:27:59] nataliamotand: Okay. So just to make sure I understand correctly, you have two suggestions. The first of them is that reorder, instead of being shown in this study tab, has a tab of its own.

[00:28:16] nataliamotand: So we would have "add a text", "reorder" and "study" separately. Is that what you meant?

[00:28:24] Customer: Not quite. I suggest that reorder is not collapsed as it is now, and is not collapsible.

[00:28:34] Customer: The sentences may be longer than currently, and some sentences right now are clipped, so you can't see full sentences when reordering. It's not very convenient. So I suggest that reorder takes the whole width of the screen.

[00:28:56] Customer: And the study panel moves to the top of this study tab, so it provides the statistics and the "start the session" button somewhere at the top of the page.

[00:29:00] Customer: That way the user does not have to scroll the page to click "start the session". That's it.

[00:29:29] nataliamotand: Okay, I understood. So the order should be the "start the session" button, the study summary, then the decks, and finally the reordering, one after the other.

[00:29:46] nataliamotand: Okay. In this case, since we are putting the "start the session" button right at the beginning of the page, I would like to suggest that maybe all the decks should start checked.

[00:30:03] nataliamotand: Right now the rule is that when you enter the page none of the decks are checked and you choose what you're going to study. If the button is the first thing that the user clicks, I think maybe all the decks should start checked.

[00:30:27] nataliamotand: I don't know if it would be a good user experience otherwise. I would love to hear your opinion, because if the user doesn't want to worry about selecting decks or reordering, he just wants to get into the application and study.

[00:30:45] nataliamotand: I think maybe a normal behavior would be that all decks are selected as soon as he enters the page. What do you think?

[00:30:53] Customer: Yeah. But for me it was rarely the case that I wanted to study all available decks every day. I usually studied only one of them but had more than one deck available.

[00:31:23] Customer: So rather than selecting all or none of the decks by default, we could just store the last selection of the user and use it in subsequent sessions.

[00:31:39] Customer: For example, if the user selected "animals" every day, next time when they open the site, those decks are selected like they were last time, and then they can select other decks.

[00:31:59] Customer: If they are studying this particular topic the whole week, I think it will be convenient that the decks don't get automatically unselected or combined with other decks.

[00:32:17] Customer: I think this is a viable solution. Can you implement it?

[00:32:19] nataliamotand: Okay.

[00:32:29] nataliamotand: You are commenting about the UI. Do you have any more comments, or something that you'd like to see, so we can move forward with it?

[00:32:33] Customer: Yeah. For me the first action in Anki was not to add a text but to study. I think the study tab should be the tab that opens by default.

[00:32:49] nataliamotand: Okay.

[00:32:59] Customer: And "add a text" will be a secondary tab.

[00:33:05] nataliamotand: Okay.

[00:33:49] Customer: And I still think... could you please go to a session? I started a study session.

[00:33:49] nataliamotand: Yeah.

[00:33:49] Customer: I still think that this text in English is not really necessary, because you have a "show translation" button. What do you think about this text?

[00:33:49] nataliamotand: I agree with you, I think the "show translation" button is enough. I remember we had discussed this in the meeting after the MVP, and I just forgot to take it off. I'm really sorry about it.

[00:34:01] nataliamotand: I'll make sure that by next week we don't have the sentence anymore, because I also think it's not necessary.

[00:34:11] Customer: No problem.

[00:34:11] nataliamotand: Okay. Thank you.

[00:34:15] Customer: All right. Can we leave the session somehow? How do you leave it right now?

[00:34:28] Customer: I also noticed we don't have a back button. I think we should have a back button.

[00:34:42] nataliamotand: Yeah, probably.

[00:34:52] Customer: Not sure actually how this should look on mobile. Maybe if you put the "stop" switch and the other tabs, "add a text" and "study", at the bottom of the screen on mobile, then you can put the back button somewhere at the top of the page.

[00:35:12] nataliamotand: Yeah, but what to do on the desktop version? I'm not sure where to put the back button.

[00:35:14] nataliamotand: Maybe these two could get a little bit to the right and we put the back button on the left. Usually back buttons are placed in the left position, maybe on top or on bottom.

[00:35:44] nataliamotand: I was thinking maybe about an arrow pointing to the left, because it might look a little more integrated and not like an exit button. But I'm not sure if it's the best visualization.

[00:36:00] Customer: I agree. I don't quite know what we want. Maybe some other applications should be explored. For example, in Kontur Talk there is an arrow to the left to go to the previous screen.

[00:36:24] Customer: In the desktop version of Firefox we also go to the left to go to the previous page. So yeah, maybe an arrow at the top left corner of the screen can be placed.

[00:36:34] nataliamotand: Okay.

[00:36:34] Customer: And maybe the header of the page should be somehow redesigned, to not show relevant information.

[00:37:03] nataliamotand: Do you think other information that is not displayed here should be shown? Do you have an example?

[00:37:09] Customer: Not really. Well, maybe statistics can be shown. But I can also see it in the study tab, like the three numbers in Anki.

[00:37:35] Customer: It can be aggregate statistics over the selected texts, just for a user to see it immediately when they open the application. However, we already open the study tab by default, and the statistics will be at the top of the page, like "due today", "new", "learning".

[00:38:01] Customer: So this separate statistics at the top of the page is not really necessary.

[00:38:17] nataliamotand: Okay.

[00:38:25] nataliamotand: I'm not quite sure I understand your suggestion. Is it about this page specifically, or about the header of the session? And which statistics are you suggesting? You mentioned "new cards": is it how many new cards the user added today?

[00:38:51] Customer: Something like this. In Anki there are three numbers: new, learn and due, if you remember.

[00:39:01] nataliamotand: Mm-hmm.

[00:39:03] Customer: So for a quick glance the user could see them at the very top of the page: how many cards are due, how many to learn, how many are new.

[00:39:19] nataliamotand: Mm-hmm.

[00:39:23] Customer: But since we have a tab that already provides that information, the study tab, I think it's not necessary to put this in the page header. I mean, between "Sentence cards generator" and the "My library" button there is some space that could be occupied with some buttons or information.

[00:39:47] nataliamotand: Mm-hmm.

[00:40:05] Customer: And this header should appear on all pages.

[00:40:09] nataliamotand: Like these, the texts and study? They should always appear?

[00:40:13] Customer: I'm not sure. Usually it's more compact: the name of the service is usually a little text with an icon at the top left corner of the page. For example, in OpenRouter it looks like this.

[00:40:35] nataliamotand: Mm-hmm.

[00:40:37] Customer: So maybe the size of this text should be reduced.

[00:40:43] nataliamotand: Mm-hmm.

[00:40:49] Customer: I don't know how we can use this space. Maybe put the tab names in the freed-up space, or keep them where they are. I'm not sure.

[00:41:07] nataliamotand: Mm-hmm. I think it's a good suggestion, the one that you gave about the statistics. To be honest, I think the visualization can get a lot better, both the tab selection and the title with "My library", to be more structured.

[00:41:33] nataliamotand: And I think it would be a good addition to have these statistics, like "due today" and "how many cards were added" and things like this.

[00:41:45] nataliamotand: I think the best way for us to see if it works is to make it and then use the application to see if everything flows. So I guess we can implement it and see if the result is similar to what you are expecting.

[00:42:07] Customer: Okay. So you suggest trying to implement the statistics at the top of the page and see how it looks?

[00:42:19] nataliamotand: Yes.

[00:42:19] Customer: Okay, agreed. If you have time, please try it.

[00:42:25] nataliamotand: I will make sure that we try this next week and show you at the next sprint review, so you can see if it meets your expectations.

[00:42:37] nataliamotand: I'll also do the reordering of the study tab, to make sure that the "start" button comes first.

[00:42:49] nataliamotand: I still think the study panel should have some kind of visualization for the user, so we can have a preview of what he is studying in this session. I'll see how to adjust it, since one of the statistics that we have will be moved from here.

[00:43:07] nataliamotand: I should have suggestions about this box, the studying box that shows the preview of what the user is studying in this session. Please feel free to share with us.

[00:43:23] Customer: Okay. Let's start the session now.

[00:43:29] Customer: From here I can add a text immediately? Honestly, I don't know if I should be able to add a text from a session.

[00:43:51] Customer: There are no conventions about whether you should be able to do actions that are not very connected with the current activity. Right now the user is studying, and then should they be able to add a text? I don't know. Add a different text, or add it to the one he's studying?

[00:44:30] Customer: I think adding a random new text doesn't make sense in the study session. But maybe he's studying and he noticed that something might be better, and then I think an edit might be more useful than adding some other text.

[00:44:52] nataliamotand: Yeah. What does the edit do exactly?

[00:44:58] Customer: Okay, this card was generated from a text. Is it still connected to the text?

[00:45:12] nataliamotand: When I created the cards, it appeared "text" and the number of created cards, but the text doesn't show anymore as it did when we had the queue, when the text was on the side. The text is not an important part of the application anymore, since we chose to prioritize the cards and their relation to the text.

[00:45:36] nataliamotand: So the texts are not really in the pipeline of the application use anymore.

[00:45:44] Customer: Mm-hmm. So there's no link from the card to the text where it appeared, right?

[00:45:50] nataliamotand: Yes.

[00:45:54] Customer: Okay. So the text cannot affect this card?

[00:46:04] nataliamotand: No, this card is created... What you do is that if you try to add a new card with the same word that you chose, then if it's the same meaning it won't allow a new card, unless you choose this card in some way, for example here in "Your cards".

[00:46:30] nataliamotand: Right now, what we have to edit the card is all concentrated in this "Your cards" box, so we don't have it in the session.

[00:46:40] Customer: Mm-hmm. So to edit the card during the session or mark it for regeneration later or something, I should go here and look for this card, right?

[00:46:50] nataliamotand: Yes.

[00:47:00] Customer: Okay. I think this is not very convenient, because first of all I can't search by text here, and second, I could have edited in place.

[00:47:18] Customer: I would like to edit in place to not get very distracted from the session. For example, I notice that the sentence is poorly written and I want to recreate it.

[00:47:38] Customer: So I think some "edit card" action in the session would improve the user experience. What do you think?

[00:47:52] nataliamotand: Oh, sorry.

[00:47:54] Customer: No, I just asked what are your thoughts about this.

[00:48:00] nataliamotand: Okay, sorry. I think it's a good idea and I think maybe we should. But I don't know if only the edit would be a good addition.

[00:48:10] nataliamotand: I think maybe we should allow the user to have these options: regenerating, maybe hiding so it doesn't show in the next sessions, or editing by hand. All of these actions I think are necessary, and if the user feels the need to edit, he might feel the need to do other actions that are also associated with the card.

[00:48:42] nataliamotand: So it's not that here we have some actions and then we have some different actions in the session. I would like to universalize them and let the user do these actions while he's studying in the session, all together.

[00:49:00] Customer: Yeah, I agree. This will be convenient.

[00:49:02] nataliamotand: Okay.

[00:49:11] nataliamotand: So we have this "add a text" tab and we have the "Your cards" panel or modal. How do you call these?

[00:49:25] Customer: Yeah, "your cards". It's just all of the cards that are created.

[00:49:31] nataliamotand: They are displayed here in the study, depending on the deck you choose. You can see all the cards in the reordering tab, but here you can see all of the cards without any filters applied.

[00:49:45] Customer: Right. But from the front-end point of view, how do you call this element of the web page? Like a "your cards" modal or panel?

[00:49:59] nataliamotand: I usually call it a box, but I'm not sure that's the correct vocabulary. Modal can also work.

[00:50:07] Customer: Okay.

[00:50:11] Customer: I also don't quite know the right vocabulary.

[00:50:13] nataliamotand: Okay, let's use "box" for now.

[00:50:15] Customer: Okay.

[00:50:21] nataliamotand: So we have this "add a text" tab at the top of the page, and inside it we have "Your cards".

[00:50:36] nataliamotand: I think "Your cards" deserves a separate tab, because each card does not remember its text, so it should not be coupled to this other text tab. What do you think?

[00:51:01] Customer: I think it's okay that we separate the responsibilities of each tab, so the user has it well established. I think it's good.

[00:51:14] Customer: But before that: if we took this box out of here, the page would be too empty. But since we added the text, I guess it's filled enough for it to be a page of its own. So I can see a new tab for all card selection, with some more features like a search space for the user to look for a word.

[00:51:58] nataliamotand: He might want to change cards quickly, and some other things that he might want. Here you can see that we can't see to which text a card belongs. This is only a visualization that's available in the reordering section, and I think it's important to have here.

[00:52:14] nataliamotand: There is something else I'd like to discuss with you. It's about the text. Right now we don't have a feature that allows us to change the text, neither the title nor deleting it or anything like that.

[00:52:34] nataliamotand: We also can't see which cards belong to it. For example, I would like to see the "news" cards, click it and see every word that's inside of it. We don't have that visualization.

[00:52:50] nataliamotand: So I guess if we put "Your cards" in another tab, it's good that we implemented the decks and segregated the cards by each of the decks, and we have the freedom to move the cards, edit them, change them from one deck to another.

[00:53:14] Customer: Yeah, I agree. So maybe we can move "Your cards" to a separate tab, but still keep a box here just for cards generated from this text.

[00:53:42] Customer: Right now you can edit the text and then generate cards, and then they are added to decks and to this "Your cards" box.

[00:53:56] Customer: But I think it would be nice to also remember which text was used for generating cards. Have some kind of library of texts, and for each text remember which cards were generated from it. Store the history of texts. What do you think?

[00:54:34] nataliamotand: Let me formulate my thoughts and communicate them properly. I think in this tab, what makes sense to have is maybe the cards added today, which refresh each day.

[00:54:54] nataliamotand: But I also think the text is a good addition to the application, because of the point that we had discussed previously: maybe a user added a paragraph from a book that he's reading and he would like to access it.

[00:55:10] nataliamotand: But I think this is similar to the decks implementation. It's a completely different logic, and we should store it elsewhere and edit it elsewhere and have this history somewhere else. I don't know if this page is a proper way for it to be added.

[00:55:36] Customer: There are already proper ways. Basically, right now you have an implementation for a single text, the text currently written. If you allow a user to add several separate texts at the same time, each of them will receive this page.

[00:56:06] Customer: So the user will still be able to edit each of these texts separately, add cards to decks, see which decks the cards were added to, and see this list of cards in your "Your cards" box, maybe by text.

[00:56:38] nataliamotand: By "text" you mean these texts?

[00:56:40] Customer: Yes, yes.

[00:56:42] nataliamotand: Okay. So this is a single text, and it produces cards.

[00:56:56] Customer: Basically you store the information about the relation between the text and the cards, which cards are generated from this text, and between cards and decks, which decks these cards belong to.

[00:57:16] nataliamotand: Today we have this edit modal with the context phrase, which is what the model uses, the sentence and the translation. If we want to store the text for each of the cards, maybe we should add another kind of information here, so it's displayed when I access the card.

[00:57:42] nataliamotand: But I'm not quite sure what the user would gain from seeing the texts beforehand, since the sentences are different from the ones the word initially came from. Do you understand what my concern is about?

[00:58:04] nataliamotand: I'm concerned that it might be confusing to have a sentence associated to a word and also the text from which this word came.

[00:58:18] Customer: My concern is that the user might want to mark more words in a text that they uploaded earlier, but there will be another text in place of that earlier text. We have this under the text tab.

[00:58:40] Customer: Could you please scroll to the top of the page? Right now we can only paste and keep one text at a time, right? If the user wants to add one more text, what do they do? They should delete this one?

[00:59:06] nataliamotand: Yes, they should delete this one, write the new text and select the new words.

[00:59:14] Customer: Okay. And if they recollect at some point that they didn't mark some words in a previous text, should they find that text somewhere, paste it again and generate new cards?

[00:59:24] nataliamotand: Yes. Right now what we have implemented is that, let's say he refreshes this page and this text disappears, then if he didn't mark "Garten", for example, he should paste the text again and mark it. So we don't have an easy way to click and have it appear here in this space.

[01:00:08] nataliamotand: But I think that this is a concern you have and you would like to have in the application.

[01:00:17] Customer: I'm not sure if I would like to have this in the application. Maybe the current flow will be easier for real users. They may not want to store texts somewhere, and this way will be much quicker.

[01:00:25] nataliamotand: Yes. I have a suggestion that might be in between what you are bringing. Maybe here we could store the previous texts that the user used to have, with words selected, and we could have quick access to that, just in case he forgot to mark some of the words in recent texts.

[01:01:09] nataliamotand: As he adds more texts, these texts will disappear. And here we have a visualization, a quick choice from a number of previous texts, in case this happens. I don't know if that fixes the problem that you think of.

[01:01:25] Customer: It is kind of a workaround, but it can be generalized to a library of texts.

[01:01:51] Customer: By the way, you have "My library". What is that?

[01:01:55] nataliamotand: Since the analytics uses different accounts for each user, I thought it would be good for us to have an identifier for each user's library. So here we have all the information about the cards that this library has, and the decks. The user can connect it between different devices and doesn't lose information.

[01:02:23] Customer: Mm-hmm. Okay. So what happens when they open another library? We just switch to another account?

[01:02:39] nataliamotand: Yes. The cards from this library disappear and the cards from the library they chose open and show the other cards. I didn't prepare any other codes, because as you can see these codes are very randomized.

[01:02:59] nataliamotand: One of the risks that we have is that the user forgets this code and then loses his library. But for now it's a workaround for how the user can have his library separated from other users' libraries.

[01:03:19] Customer: Yeah. So in the future it would be nice to implement authentication, and then you will not need to use the codes; users will just be able to sign out.

[01:03:41] nataliamotand: Mm-hmm. So you think login is necessary for this application?

[01:03:55] Customer: Yeah, I think it should support several users.

[01:03:57] nataliamotand: Okay. I agree with you, I think login is important for us to have. The initial idea is for us to implement it, and this week we only didn't implement it because of lack of time and the prioritization of the implementation.

[01:04:14] nataliamotand: But I'll add a user story for that, so we can implement it in the following weeks.

[01:04:24] Customer: Mm-hmm. Thank you.

[01:04:28] nataliamotand: Okay. So regarding the texts, how hard would it be, or what do you think about adding a library of texts that were uploaded by the user at any time, and letting the user work with any of these texts at any point in time?

[01:05:01] Customer: Mm-hmm. Like uploading maybe a book or something like that?

[01:05:11] nataliamotand: Or a paragraph.

[01:05:11] Customer: Yeah. Maybe we should not let them upload files, only texts. Maybe we should even limit the size of each text they can upload.

[01:05:31] nataliamotand: Mm-hmm. But what do you think about letting the user work with texts that they pasted at any time they used our service?

[01:05:50] Customer: I'm not quite sure I understand this question. I understand it in two different ways. The first one is that the user uploads a text, it appears here, and we let him choose the words from the text he uploaded without having to copy and paste.

[01:06:10] Customer: The second is that he writes a text here, and we let him store it so he can go back in case he needs it. So I'm not quite sure I understand your question.

[01:06:22] nataliamotand: Okay. I am talking about this action, "paste a text", but I propose that we store all texts that the user pasted at any time. So say they pasted text A, then text B, then they decided to select the words in text B and generate sentences, then they went to text C, selected some words and generated sentences.

[01:07:04] nataliamotand: And they didn't do anything to text A, for example. And in a week maybe they decide to study words from text A. Then they can go to text A, select some words there, generate sentences and so on.

[01:07:28] Customer: Okay, I understand your question. I think it's a good option, but to be realistic it involves another implementation and another user story, similar to what we did with the decks.

[01:07:42] nataliamotand: So I think this is work for the following sprints, and it's good that we implement it. But we also have to discuss the logic about this. For example, I will allow the user to create cards from these texts, but what if he deletes one of these texts? Should all the cards that he has created and that are associated with it also be deleted, and so on?

[01:08:12] nataliamotand: What happens if the user deletes every card of that text? Then the text won't have any more cards. Do you know what I mean?

[01:08:22] Customer: Yeah, I also thought about this. A similar problem can appear if the user edits a sentence in the text, and that sentence contained a word that they selected before and generated a card from.

[01:08:57] Customer: Since the text does not contain this word anymore, a card cannot be generated from this text, and it loses its connection to this text.

[01:09:09] Customer: I think it's okay. We should let users edit the texts and preserve cards generated from texts, but while these texts exist we should store them and let users work on them, use them to create new cards.

[01:09:41] nataliamotand: Mm-hmm. Okay. Regarding the deleted texts...

[01:09:59] Customer: Not sure, maybe... okay, we preserve cards.

[01:10:07] nataliamotand: Just preserve them.

[01:10:07] Customer: And if the word that the card was generated from is deleted from a text, then we can either mark that card in some way, like it has no associated text, or basically we can introduce a label for a card: the text it comes from.

[01:10:47] Customer: Or it will be one of the texts where the word for this card has the same meaning. If there are no such texts, because in each text the user deleted the sentence that gave this word its meaning, then we just show no label.

[01:11:13] Customer: And this label can be used to go to the text, to the text page, I mean from a card. So maybe something like this can work.

[01:11:29] nataliamotand: Okay, I think I got the idea. I think some questions will appear while we are implementing it, and I was wondering if it's okay that I communicate with you through the chat while I'm implementing it.

[01:11:45] Customer: Yes.

[01:11:53] nataliamotand: Okay. So I'll create a user story for this implementation and we'll keep you posted about how it's going in the following weeks.

[01:12:08] nataliamotand: Okay. I think for the product that's what I had prepared. If you have any more comments about the UI, you can feel free to tell me about it.

[01:12:29] Customer: If not, we can... since you mentioned that there is no functionality for inspecting decks, maybe when you implement it we can let the user go to the deck from a card.

[01:12:49] Customer: So right now, in the study tab, could you please open it? And reorder. Okay, so there is "animals" and "travel".

[01:13:09] Customer: Maybe we should let the user go to the "animals" deck when they click on "animals".

[01:13:21] nataliamotand: What for?

[01:13:23] Customer: Not sure. Maybe to reorder a deck, move cards inside the deck, maybe for some other actions.

[01:13:33] nataliamotand: Okay. So I agree with you. I think one of the things that's missing from the application right now is a separate page for the deck visualization, and I think it's a good way for the user to click and be redirected to this page.

[01:13:52] nataliamotand: We will also see what is necessary for the user to have as information about the decks, maybe editing or deleting it. So I think it's a good way to reach the decks.

[01:14:10] nataliamotand: But we should also have another way, another tab or something like that, so the user doesn't have to know that he can only reach the decks if he goes to the study, goes to the reorder and clicks the deck.

[01:14:24] Customer: Yeah, I agree.

[01:14:30] nataliamotand: One more step. I wanted to make sure we are aligned. I was wondering if the user story can be closed as it is, since it fulfills all the acceptance criteria, what you expect from the decks implementation, and we should create other tasks for these other implementations.

[01:14:50] nataliamotand: Or maybe we should keep this user story open and do everything about these other implementations here?

[01:15:02] Customer: I think it would be better to close this user story and create new ones with more details that you learned.

[01:15:14] nataliamotand: Okay, more relevant, more specific acceptance criteria. Okay. Thanks for the clarification.

[01:15:31] nataliamotand: It's a good suggestion, the one that you gave, about being able to be directed to the decks from the labels. I like it.

[01:15:45] Customer: Okay, cool. I'm not sure what the exact use cases will be, so maybe it should not be prioritized to be implemented very early, very soon. But yeah, that's up to you right now.

[01:16:09] nataliamotand: Okay. I think at the end of the meeting we can discuss which are the next user stories that should be implemented. Last week we prioritized the decks implementation, and the audio was delayed again.

[01:16:31] nataliamotand: I was wondering which of them... we can discuss this later, but just to make sure that we are implementing the application based on the things that you would like to see first. We can discuss it at the end of the meeting, if it's okay.

[01:16:53] Customer: Okay. By the way, the end of the meeting will be around 12 pm because I will have another meeting. I think we should finish in 20 minutes.

[01:17:18] Customer: I suggest that we proceed with what you planned.

[01:17:22] nataliamotand: I will move forward now with the dashboards. I will give you a quick overview of each one and the indicators that we chose, just so you see that it's implemented and working.

[01:17:38] nataliamotand: About the analytics, we have first the dashboard of staging, with "cards studied per active learner" as the first chart and "cards made per active learner" as the second. Here we have a list of the recent events that are happening in the staging product.

[01:18:16] nataliamotand: These values right here came from a study session that our team did with a demo library, so this just shows how the pipeline works and does not show how the product is performing right now, especially because it's staging and it hasn't been tested by people outside of the group.

[01:18:40] nataliamotand: We have the same dashboard in production, but without the recent events, because I didn't think it would be a good indicator to have. It's not that important as these other two.

[01:18:54] nataliamotand: So it's practically the same dashboard. Then the observability dashboard: the staging dashboard has one chart, which is the request latency P95 by outcome.

[01:19:14] nataliamotand: This is, for example, one test that we performed yesterday night just to make sure that it is visible when any of these three errors come. Production is also the same.

[01:19:32] nataliamotand: Staging carries the test traffic of our team, and production carries the requests it has served since we turned the monitoring on yesterday. The line stops where the route got no request in the last five minutes, so there is no value to draw.

[01:19:54] nataliamotand: Our quality requirement, QR-07, asks that when a request fails, the team finds its log point in at most five seconds and its failure in the metric in at most one minute.

[01:20:14] nataliamotand: Here is the failure series, "client error" on the card routes, with a P95 of 970.5 milliseconds, as you can see. So we are inside of the quality requirements.

[01:20:34] nataliamotand: That's pretty much it. I was wondering if these tests met both limits in staging and if you accept this quality requirement, or if you have any other suggestions of what these dashboards should monitor.

[01:20:51] Customer: Yeah, I accept this quality requirement. Each request is basically executed under a second, so yeah, this is acceptable.

[01:20:55] nataliamotand: Okay. We also documented this evidence about the quality requirements here, as you can see, and it's already committed to the main branch of our repository.

[01:21:27] nataliamotand: Quickly about the thresholds of success: here it says that the threshold status is "achieved", because the main goal of the application was met when you approved user stories 1, 2 and 3, which is the complete objective of the application, that the learner studies the cards that he added.

[01:21:59] nataliamotand: But here in the table we have that you accept the final product at the end of the semester, and this isn't fulfilled yet, so I'll correct the status to be "open".

[01:22:11] nataliamotand: We also have these other three thresholds of success, but they depend on usability tests from users outside of the team, and for now these are the four that we have.

[01:22:25] nataliamotand: I was wondering if you would like to have any other thresholds, if you think it's important that we have others, or if it's okay that most of them are associated with usability tests. And also, what do you think the next threshold measure should be, or if it is okay the way it is, and at first hand there's nothing you'd like to change, we can base the product's implementation on these thresholds.

[01:23:00] Customer: Well, I don't know, honestly. You will have to conduct usability tests and you will collect some measurements, but first you need to design it. Like this week... So I think we can discuss this a bit later.

[01:23:19] nataliamotand: Okay.

[01:23:27] Customer: Yeah.

[01:23:39] nataliamotand: So no problem at all. That's okay, we can return to this point in the following weeks.

[01:23:51] nataliamotand: I did a little speed run right now and we went through everything that I wanted to show you this week.

[01:23:57] nataliamotand: So I would like now to discuss what the next implementation should be, because I feel like we have a lot of things to get done, and maybe you would like to see some of these things done first, so you see the application making real progress.

[01:24:21] nataliamotand: From the top of my head, one thing is the audio implementation. As you can see, the cards still don't have audio. And there are some other things that we had mentioned previously, like these other pages, the text implementation and the text logic.

[01:24:29] nataliamotand: And there are also some fixes that we discussed in this meeting. I was wondering what you think the next step that is going to bring the most evolution for you is, for the next sprint.

[01:25:15] Customer: I think this new work on texts and your improvements will bring the most value. Although audio is an important part of the application, right now it can be done client-side, using the right browser. For example, Chrome has pretty good text-to-speech, and maybe Android TTS will be also alright. So in the worst case, just the client-side audio can work.

[01:25:59] Customer: So I would prioritize the UI refactoring over audio.

[01:26:07] nataliamotand: Okay. So both the texts and the UI that we discussed today?

[01:26:17] Customer: Yes.

[01:26:17] nataliamotand: And another thing that I didn't mention is the mobile version of the application. Where does it lie on the scale of prioritization? Do you think we should maybe review the UI and the texts, then maybe mobile or audio first? What do you think is best?

[01:26:43] Customer: Okay. You have weeks 7, 8, 9, 10. I'm not sure how much it would require to make the mobile version.

[01:27:04] Customer: I think an MVP will be usable even without a mobile version and with browser audio. So maybe let's postpone mobile to after the audio.

[01:27:24] Customer: And I'm sorry, remembering as we talk, there's also the login. Do you think it should be first?

[01:27:49] nataliamotand: Well, we have to support several users.

[01:27:51] Customer: Yeah. So I would say the texts and the UI have the highest priority, because it needs settling the database schema and so on, and adjusting the UI. Then authentication can be done, and then audio and mobile versions.

[01:28:31] nataliamotand: Okay. So the implementations that we made this week, context and texts, then login, then audio, and lastly the mobile version. Is that correct?

[01:28:48] Customer: Yes, that's correct.

[01:28:50] nataliamotand: Okay, thanks for telling me. So that is what we had for the meeting today. As usual, I will send by the end of the day a text with the main points and the things that we are going to be moving forward with in the next few weeks, so you can verify that everything is according to your expectations.

[01:29:16] nataliamotand: That's it. Thank you so much for having the time for this meeting and sharing your opinion on multiple parts of the product. I really appreciate it.

[01:29:26] nataliamotand: We can keep in contact as we move forward with the next implementations. Thanks for your time, and have a great Sunday.

[01:29:38] Customer: Thanks a lot. Thank you for your patience and for your work. Thanks a lot, I enjoy working with you.

[01:29:46] nataliamotand: Okay.

[01:29:55] Customer: Have a great day and week.

[01:29:59] nataliamotand: You too. Bye bye.

[01:30:01] Customer: Thank you. Goodbye.
