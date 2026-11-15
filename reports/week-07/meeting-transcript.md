# Week 7 Sprint Review meeting transcript

- **Date:** 2026-11-15
- **Participants:** nataliamotand, Customer

[00:01:25] nataliamotand: Hello.
[00:01:25] nataliamotand: How are you?
[00:01:30] Customer: Fine, thanks.
[00:01:30] Customer: How are you?
[00:01:34] nataliamotand: Also fine, thanks for asking.
[00:01:36] nataliamotand: I think we should start.
[00:01:36] nataliamotand: I don't think that my teammates will be joining today.
[00:01:46] Customer: Okay, let's start.
[00:01:50] nataliamotand: Let me share my screen.
[00:01:55] nataliamotand: First of all, I'd like to thank you for coming to this meeting.
[00:02:01] nataliamotand: And I'd like to ask if it's okay with you if we record this meeting and publish a sanitized transcript of it in our repository?
[00:02:12] Customer: Yeah, it's okay.
[00:02:14] nataliamotand: Thanks.
[00:02:29] nataliamotand: Can you see my screen?
[00:02:31] Customer: Yes.
[00:02:32] nataliamotand: Okay, so as you can see, we made some alterations in the product, so it's pretty different from last week, and we have a lot of user stories to cover in today's meeting.
[00:02:49] nataliamotand: I'd like to give you an overview of everything, and then go through each of the acceptance criteria that we established with you.
[00:03:00] nataliamotand: Since, if I'm not mistaken, four user stories were implemented.
[00:03:06] nataliamotand: And so that I don't have to open GitHub, I also wrote them down, so I can read them with you and you can check as I show it to you.
[00:03:17] nataliamotand: So let's get started.
[00:03:20] nataliamotand: So the first user story is user story 17.
[00:03:31] nataliamotand: So, given that I opened the product, the Study tab is shown first, with the cards to study today.
[00:03:42] nataliamotand: New, forgotten and review, with the start button at the top.
[00:03:47] nataliamotand: It was something that you asked for in the previous meeting.
[00:03:50] nataliamotand: As you can see, the application now opens on the Study page.
[00:03:54] nataliamotand: And we have highlighted a "Start a session" button, with the cards in the same format as Anki, something that you mentioned previously.
[00:04:05] Customer: Nice.
[00:04:05] Customer: Yeah, I see.
[00:04:09] nataliamotand: We also, not in the Study tab, because it already has this information, but we also added some kind of statistics.
[00:04:18] nataliamotand: I'm not sure this is what you meant, but it looks like this right now.
[00:04:24] Customer: Yeah, I meant to show the statistics immediately, like four to three at the top.
[00:04:33] Customer: But this way seems to be better.
[00:04:38] nataliamotand: Okay, like showing a button or something, and then statistics inside.
[00:04:46] nataliamotand: Okay, and a detail, something that I thought about while I was implementing, but I didn't know your opinion right now.
[00:04:55] nataliamotand: This button redirects to the Study page, but I don't know if it should start a session right away when I click it.
[00:05:05] nataliamotand: So what do you think about it?
[00:05:10] Customer: I think it should not start the session because the session may need some settings.
[00:05:19] Customer: I mean, like selecting specific decks to study.
[00:05:24] Customer: So it would be better to bring the users to this page.
[00:05:29] Customer: Yeah, study, and let them set up the session and then start it.
[00:05:37] nataliamotand: Okay, so about acceptance criteria.
[00:05:43] nataliamotand: One of them, acceptance criterion two, is that if I ticked decks last time, they are still ticked, checked, when I open the Study tab again.
[00:05:54] nataliamotand: This was something that we agreed on when we talked about selecting the decks.
[00:06:00] nataliamotand: So right now, if I reload the page, it will be exactly as I used it last time, as you could see here.
[00:06:09] Customer: Okay, so that's okay.
[00:06:15] Customer: Yes.
[00:06:18] nataliamotand: Also, acceptance criterion number three was about the reordering.
[00:06:23] nataliamotand: So right now, it says that the reorder list is always open below the study panel and shows each sentence in full.
[00:06:32] Customer: I can see that.
[00:06:37] nataliamotand: Okay, and acceptance criterion number four says that, in Your cards, which is a new tab that we added,
[00:06:47] nataliamotand: when I type a word, I can find the cards that have it.
[00:06:51] nataliamotand: For example, here we can quickly find these cards.
[00:07:02] nataliamotand: I think this was something that you mentioned through text.
[00:07:06] nataliamotand: So we have that now.
[00:07:09] nataliamotand: And we will also go through this tab specifically.
[00:07:13] nataliamotand: We have a user story about it, and we will get into more detail.
[00:07:20] Customer: Okay.
[00:07:23] nataliamotand: So this was user story number 17.
[00:07:29] nataliamotand: We can move forward to number 18 right now.
[00:07:32] nataliamotand: That is: given a card in a study session,
[00:07:35] nataliamotand: when I edit it, regenerate its sentence or hide it, then I stay in the session and the hidden card does not come back.
[00:07:43] nataliamotand: This is acceptance criterion number one of the user story about the session.
[00:07:51] nataliamotand: That was something that we had to make a few changes to.
[00:07:54] nataliamotand: For example, the sentence that was here is not here anymore, because it was not necessary.
[00:08:00] nataliamotand: The back button was also added, so we can quickly leave the session and return to the Study tab.
[00:08:07] nataliamotand: And the actions were also added here.
[00:08:12] nataliamotand: So the user can quickly change the card, or hide it, or regenerate it, as they wish.
[00:08:21] nataliamotand: And in a quicker way, so they don't have to search for the card and then edit it.
[00:08:32] Customer: Great.
[00:08:34] Customer: And that's what I asked for.
[00:08:37] nataliamotand: So here they can quickly edit it, or regenerate it, or hide it.
[00:08:52] nataliamotand: And if they hide it, it will not return in the study session.
[00:08:56] nataliamotand: The card just becomes hidden, and they have to unhide it if they want to study that card again.
[00:09:06] Customer: Where can they find the hidden cards?
[00:09:12] nataliamotand: They can find the hidden cards in the Your cards tab.
[00:09:16] nataliamotand: They can quickly access these hidden cards with this filter that we implemented.
[00:09:24] Customer: Okay, nice.
[00:09:26] Customer: So how does the mobile version look like?
[00:09:31] Customer: I mean, of this page.
[00:09:36] Customer: How do the filters fit in?
[00:09:41] nataliamotand: Ah, okay.
[00:09:43] nataliamotand: Is this visualization good for you?
[00:09:46] Customer: Yeah, yeah.
[00:09:52] nataliamotand: So, moving forward.
[00:09:55] nataliamotand: This was acceptance criterion number one, about the actions in the study session.
[00:10:03] nataliamotand: Acceptance criterion number two is that the card in the session is shown without the English sentence that we had previously.
[00:10:14] nataliamotand: And the translation appears when I click the button "Show translation".
[00:10:23] nataliamotand: For example, here.
[00:10:25] nataliamotand: Acceptance criterion number five is about the back button.
[00:10:32] nataliamotand: So the arrow at the top of the study session leaves the session and goes back to the Study page.
[00:10:44] nataliamotand: Since there were a lot of user stories, we tried keeping the acceptance criteria to a minimum.
[00:10:57] nataliamotand: It implements some of the things that you asked for, but we didn't do it in an extensive way, so we could show you what you meant.
[00:11:10] nataliamotand: So that was it for user story number 18.
[00:11:14] nataliamotand: And I was wondering about these two user stories, number 17 and 18.
[00:11:20] nataliamotand: What did you expect to happen here that maybe did not happen?
[00:11:26] nataliamotand: Do you have any other considerations, something that you would like to add, or do you think it is good the way it is?
[00:11:32] nataliamotand: If you miss something, feel free to share it with me.
[00:11:37] Customer: Okay.
[00:11:37] Customer: Could you please send links to the user stories?
[00:11:43] Customer: Okay, I can open it.
[00:11:43] Customer: So, just a minute.
[00:11:46] Customer: "I'm studying, adding a text, in my cards, in a few steps."
[00:12:01] Customer: Can you see it?
[00:12:05] nataliamotand: Yeah.
[00:12:05] nataliamotand: "As a learner, I want to find studying, adding a text and my cards in a few steps, so that I start studying without extra clicks."
[00:12:17] Customer: So was it about this top menu, with Texts, Your cards and Study?
[00:12:31] Customer: Was this user story about this top menu at the top of the page?
[00:12:40] nataliamotand: Okay.
[00:12:40] nataliamotand: It's about the user having access to the things that they want to do in an easy way, without having to look through multiple pages.
[00:12:54] nataliamotand: For example, the main goal of the application is that the user studies their cards quickly as soon as they enter the app.
[00:13:03] nataliamotand: So it implements that, both in the study session, so they can quickly study what they want,
[00:13:09] nataliamotand: and also in the Your cards tab; one of the acceptance criteria is about that.
[00:13:16] nataliamotand: So they can quickly access a card that they might want to change, both the decks and maybe the actions, like editing it.
[00:13:24] nataliamotand: So it's about making life quicker for the user, you know.
[00:13:28] Customer: Okay.
[00:13:28] Customer: Got it.
[00:13:28] Customer: Thanks.
[00:13:28] Customer: So, start what?
[00:13:41] nataliamotand: And this was kind of inspired by some of the requests that you made.
[00:13:47] nataliamotand: And then we just grouped them and made a user story for it.
[00:13:51] Customer: Seems like searching and having access to the Study page firsthand.
[00:13:59] Customer: Got it.
[00:13:59] Customer: So it's a bit...
[00:14:05] Customer: So it's like an epic, kind of.
[00:14:11] Customer: Many features combined, but it's okay.
[00:14:17] Customer: So, okay, I saw that the Study tab opens first, although after reloading the page, the Texts tab was still open, as far as I remember.
[00:14:36] Customer: Was that intended?
[00:14:40] nataliamotand: What do you mean?
[00:14:41] Customer: So right now, the Study tab is selected.
[00:14:46] Customer: Then you please click Texts.
[00:14:49] Customer: And then reload the page.
[00:14:53] nataliamotand: Yeah, click Texts.
[00:15:00] nataliamotand: Okay, I meant, in this acceptance criterion that was about the cards, the decks being selected.
[00:15:10] nataliamotand: So not about reloading the page and coming back to Study, but rather selecting the decks and they keep this position independently of reloading the page or going back and forth.
[00:15:24] nataliamotand: So also about the redirect: we believe that if the user is on Texts and reloads the page, maybe they want to stay on that page and see the alterations.
[00:15:40] nataliamotand: So about Study being the first page that the user opens, I meant when they open the application, the web app.
[00:15:52] nataliamotand: Not when they reload from other tabs.
[00:15:59] Customer: Okay, got it.
[00:16:02] Customer: And on the Texts page, there is "nine to study" or something like this.
[00:16:10] Customer: I mean, "seven to study".
[00:16:13] nataliamotand: Okay, that button, they can click it and then go to study.
[00:16:18] Customer: Okay.
[00:16:18] Customer: What does this green indicator mean, by the way, near "My library"?
[00:16:28] nataliamotand: This means that the API status is okay.
[00:16:31] nataliamotand: Just so we know that it's communicating with the LLM, in case it needs to generate new sentences or add cards.
[00:16:42] nataliamotand: Before, it was like a text, and then we just did it like this.
[00:16:47] nataliamotand: I don't know if it's in the main application.
[00:16:51] nataliamotand: Do you think it's necessary for the user to have this kind of indicator?
[00:16:56] nataliamotand: If you don't, we can take it out when we do user tests or release it to the public.
[00:17:07] nataliamotand: But for now, it's more of an indicator for us, who are developing the app, that everything is according to plan with the LLM.
[00:17:19] Customer: Okay, I think the LLM availability status only matters when they generate some cards or regenerate sentences.
[00:17:33] Customer: And I assume that your application will notify them if it can't access the LLM.
[00:17:43] Customer: So probably this indicator won't be needed in this case.
[00:17:49] Customer: Another purpose may be whether the backend is accessible for editing the cards, for updating the cards or receiving the cards.
[00:18:09] Customer: But I'm not sure if this is really necessary, because if the backend is not accessible, I also assume that your frontend will not allow editing the cards.
[00:18:32] Customer: And it won't even load right now, because I think it won't load if the user tries to open the page for the first time.
[00:18:47] Customer: Or it will not allow editing if it can't connect to the backend after it's already loaded.
[00:18:57] Customer: So right now, if the backend disconnects, then I assume the frontend will not allow editing the cards and will not send them to the backend.
[00:19:13] nataliamotand: We will make sure that every error that impacts the user's ability to use the app will be notified, and we can take it off this indicator.
[00:19:25] nataliamotand: No problem.
[00:19:25] nataliamotand: I will put it as an extra point for next week.
[00:19:32] Customer: Yes, so I think more context-based notifications will be more understandable for a user than this indicator.
[00:19:47] nataliamotand: Okay.
[00:19:49] Customer: I was talking about this first acceptance criterion, not about saving the selected decks, not about AC-02.
[00:20:09] Customer: And so we discussed the first acceptance criterion.
[00:20:13] Customer: Yeah, I agree that the page that the user opened last should open again when they just reload the tab without changing the URL.
[00:20:25] Customer: Okay, "given I ticked decks last time and opened the Study tab again, then the same decks are ticked".
[00:20:32] Customer: Okay, I also saw this.
[00:20:38] Customer: Okay, "given the Study tab, then the reorder list is always open below the study panel and shows each sentence in full".
[00:20:47] Customer: Okay.
[00:20:52] Customer: Could you please show how it looks in the mobile version?
[00:20:59] nataliamotand: Yes, of course.
[00:21:02] Customer: Okay, will the sentences be...
[00:21:06] Customer: Oh yeah, they are up and they can see them in full.
[00:21:10] Customer: Nice.
[00:21:13] Customer: Okay, then this one, I agree, it's implemented.
[00:21:20] Customer: "Given the tab Your cards, when I type a word, then I find the cards that have it".
[00:21:28] Customer: Okay, could you please demonstrate it again?
[00:21:31] nataliamotand: Of course.
[00:21:33] nataliamotand: Here we can have...
[00:21:35] nataliamotand: In Your cards.
[00:21:41] Customer: Okay.
[00:21:45] nataliamotand: This search selector also looks for decks and texts that have that name.
[00:21:53] nataliamotand: So you can see here that the text has "Zug" in it, so it just brings the word, maybe something that the user wants.
[00:22:05] nataliamotand: This is something that we should align with you about, your expectations about the search.
[00:22:10] nataliamotand: Whether it should just search cards, or maybe should also search decks and texts that the user might want to quickly access.
[00:22:22] Customer: So you mean search decks by their title?
[00:22:27] nataliamotand: Yes.
[00:22:29] nataliamotand: Or texts.
[00:22:31] Customer: But this is the your cards tab, so I think it should only search for cards here.
[00:22:43] nataliamotand: Yep.
[00:22:45] nataliamotand: Okay.
[00:22:46] Customer: They can search decks in the Decks tab.
[00:22:54] nataliamotand: Okay.
[00:22:56] nataliamotand: So they don't really need to search for decks, because they see the deck titles on the left, right?
[00:23:05] Customer: Like in the filters?
[00:23:06] nataliamotand: Yes.
[00:23:07] Customer: Okay.
[00:23:10] Customer: So there is some text clipping issue.
[00:23:23] Customer: There is text clipping issue, so I can't see sentences in full.
[00:23:30] Customer: So could you please click the first card?
[00:23:38] nataliamotand: Yeah, Suppe.
[00:23:39] Customer: Okay.
[00:23:43] Customer: So I still can't see the full German sentence here.
[00:23:50] nataliamotand: Okay.
[00:23:52] nataliamotand: And what would you prefer?
[00:23:56] nataliamotand: We put it this way so it wouldn't clash with the other side, but we can show the full sentence.
[00:24:04] nataliamotand: Do you mean this one, right?
[00:24:07] Customer: Yeah.
[00:24:09] Customer: One option is to put the sentence on the second line, then it can take the whole line.
[00:24:23] Customer: I assume the word in the first line will not be that long and it will not overlap with the deck label.
[00:24:35] Customer: Or what is this?
[00:24:37] Customer: Deck chip?
[00:24:38] Customer: "Am Abend", I mean.
[00:24:40] nataliamotand: It's the title of the text that created this card.
[00:24:46] Customer: Okay.
[00:24:48] nataliamotand: The title of the text.
[00:24:53] Customer: And what is this layers icon?
[00:25:00] nataliamotand: This is how many decks this card belongs to.
[00:25:05] Customer: And what happens if you click it?
[00:25:08] nataliamotand: Nothing happens.
[00:25:09] nataliamotand: It's just a visualization.
[00:25:12] nataliamotand: To access the deck, you have to click the deck chip.
[00:25:26] Customer: All right.
[00:25:28] Customer: So you can edit, mark for review, hide from study, get a new sentence, or delete.
[00:25:35] Customer: Okay.
[00:25:44] nataliamotand: So about these changes, since a user can search for the cards when they type a word,
[00:25:57] nataliamotand: I was wondering if the best way for us to move forward with this is maybe checking these acceptance criteria, since they are met, and then creating a separate issue to build the fixes that you think would be best for usability.
[00:26:18] Customer: Yeah, I agree.
[00:26:20] nataliamotand: Okay, so is this user story accepted as it is, user story 17?
[00:26:28] Customer: Yes.
[00:26:31] nataliamotand: Okay, we can close it.
[00:26:33] nataliamotand: You can also look at user story 18 to see if you accept it, and I can also show you the acceptance criteria.
[00:26:45] Customer: Okay, let me read it.
[00:26:47] Customer: "The learner wants to edit, regenerate or hide the card while studying,
[00:26:52] Customer: to have a session without clutter, so that they keep their focus on the cards".
[00:26:59] Customer: Okay, good.
[00:27:01] Customer: "Given a card in the study session, when I edit it, regenerate its sentence or hide it,
[00:27:07] Customer: then I stay in the session.
[00:27:09] Customer: The hidden card does not come back".
[00:27:17] Customer: Okay.
[00:27:19] Customer: I did see that you stayed in the session after regenerating the card, but I didn't see whether the card did not come back
[00:27:35] Customer: if I hide it.
[00:27:35] Customer: Okay.
[00:27:38] nataliamotand: Let me put less text so you can see.
[00:27:44] nataliamotand: The first one is the dish.
[00:27:49] Customer: Nice.
[00:27:50] nataliamotand: Thank you.
[00:27:51] nataliamotand: If I hide it, then it doesn't come back again.
[00:27:55] nataliamotand: If I click the "Again" button, it comes back.
[00:27:58] nataliamotand: But if I hide it, it doesn't.
[00:28:00] nataliamotand: So I can also show you in other decks, so you can see with more cards, for example.
[00:28:09] nataliamotand: Sorry, I did it wrong.
[00:28:13] nataliamotand: But when I hide "faster", then the next one comes.
[00:28:17] nataliamotand: And if I put "good", then it's over.
[00:28:22] nataliamotand: "Faster" didn't come back.
[00:28:25] Customer: Okay.
[00:28:30] Customer: Okay, I see.
[00:28:33] Customer: Then, yeah, that's correct.
[00:28:38] Customer: "Given a card in a study session, then it shows no English sentence".
[00:28:44] Customer: This English sentence, I think...
[00:28:49] nataliamotand: It means that orientation sentence that we had.
[00:28:53] Customer: Yep.
[00:29:02] Customer: So, yeah.
[00:29:08] Customer: That instruction about clicking "Show translation" is not there.
[00:29:15] Customer: Okay.
[00:29:17] Customer: This one also passes.
[00:29:20] Customer: "And given a study session, when I click the arrow at the top left, then I leave the session".
[00:29:29] Customer: Okay, so that as well.
[00:29:34] nataliamotand: Okay, so is user story 18 accepted for you?
[00:29:40] Customer: Yes.
[00:29:43] nataliamotand: Okay.
[00:29:46] nataliamotand: And you can also open the other user stories I'm going to show.
[00:29:52] nataliamotand: I think we can do it like this.
[00:29:54] nataliamotand: Maybe you read the acceptance criteria first, and then I can show you.
[00:29:59] nataliamotand: I think maybe you would prefer it that way.
[00:30:05] Customer: Yeah.
[00:30:07] Customer: Okay.
[00:30:08] Customer: So do we look at user story 20, or which one?
[00:30:14] nataliamotand: 15.
[00:30:15] nataliamotand: We can start with user story 15.
[00:30:18] Customer: "As a learner, I want my texts to be kept, so that I can come back to a text I added before and mark more words in it".
[00:30:27] nataliamotand: Okay.
[00:30:28] Customer: So there is some text library.
[00:30:31] Customer: "Given I saved a text, when I open the Texts tab, then I see them and I can open one, edit it and mark more words in it".
[00:30:42] nataliamotand: Okay.
[00:30:43] Customer: "Given a text..."
[00:30:45] Customer: Oh, sorry.
[00:30:46] Customer: Could you please...
[00:30:47] nataliamotand: Yeah.
[00:30:48] Customer: "Given a text with cards, when I edit or delete the text, then its cards are kept".
[00:30:55] Customer: "Given a card made from a text, when I open the card, then it shows the name of its text and I can click the name to open the text".
[00:31:06] Customer: All right.
[00:31:08] Customer: So the first one is about
[00:31:14] Customer: marking more words.
[00:31:16] Customer: What about unmarking some words?
[00:31:22] nataliamotand: You can unmark words, but if you want to...
[00:31:26] nataliamotand: You mean unmarking the words should delete the card?
[00:31:26] nataliamotand: Because right now we can delete the card,
[00:31:34] nataliamotand: but we can't, for example, unmark Suppe and save changes to...
[00:31:42] nataliamotand: If I'm not mistaken, it won't delete the card.
[00:31:42] nataliamotand: For you to delete the card, you have to come here and click it.
[00:31:48] nataliamotand: But it can also be done on the same page.
[00:31:57] nataliamotand: So would you prefer it that way?
[00:31:59] nataliamotand: Like, if I click it and save, should I delete the card right away, without any notice or something like that?
[00:32:09] Customer: I'm not sure we should delete a card when the text is deleted or the word is unmarked.
[00:32:18] Customer: The user may have started studying that word, so they have some progress associated with that card.
[00:32:29] Customer: So I think we should not delete it, but we should let the user manipulate such cards that have no associated text.
[00:32:52] Customer: So where should we do that?
[00:32:52] Customer: I'm not sure.
[00:32:52] Customer: On the text page, or in Your cards?
[00:33:01] nataliamotand: Like, manipulate the cards that don't have a text?
[00:33:09] Customer: Yeah.
[00:33:13] nataliamotand: I think the best thing would be to do it in Your cards, maybe with a filter "no text associated" or something like that.
[00:33:26] nataliamotand: And the user can quickly access these cards.
[00:33:26] nataliamotand: I think it will be an exception, because in the new flow of the application,
[00:33:36] nataliamotand: every time that you add a card from a text, it automatically saves that text and links it to the cards that it created.
[00:33:46] nataliamotand: So for a card to not be associated with a text, I don't think it's possible right now, the way it is.
[00:33:56] nataliamotand: But if you want that to be an option, for example, the user created the card from a text and then, I don't know,
[00:34:08] nataliamotand: I don't see why that would happen, but maybe that's a concern you have.
[00:34:15] nataliamotand: Like, the user added it and, for example, the original text had "Zug" in it, and then they edited the text,
[00:34:26] nataliamotand: so "Zug" wasn't in it anymore.
[00:34:26] nataliamotand: So the card loses its association to the text.
[00:34:33] nataliamotand: Right now it doesn't lose the association, even though it doesn't have that word in the text anymore.
[00:34:39] nataliamotand: It continues with the text that created it.
[00:34:39] nataliamotand: But I don't know if you would like it to automatically
[00:34:48] nataliamotand: leave the text and be in an uncategorized kind of filter.
[00:34:58] nataliamotand: Can you share maybe why you think that would be necessary?
[00:35:05] nataliamotand: Or why it is important to you, so I can understand your priorities, or what you meant?
[00:35:15] Customer: Yeah, I meant exactly this case.
[00:35:15] Customer: One of the cases that I meant was that the text is edited
[00:35:25] Customer: and the word selected previously is not in the new text version.
[00:35:32] Customer: So in this case we may still want to let the user study this word, just not inside this text.
[00:35:47] Customer: I mean, just not belonging to this text.
[00:35:47] Customer: Why?
[00:35:58] Customer: Well, because they may have already studied this word a couple of times.
[00:36:03] Customer: It occurred in their queue.
[00:36:03] Customer: When they decided to edit the text, I mean, they technically can do this.
[00:36:15] Customer: Therefore, we can have such cards.
[00:36:21] nataliamotand: So right now, what you want that isn't implemented yet is that we also have a parallel flow for cards that don't have a text association.
[00:36:35] Customer: This is one way.
[00:36:35] Customer: Another way is to not let the user edit the text,
[00:36:45] Customer: but instead let them add a new text which contains the edited text.
[00:36:58] Customer: There is text A, and to use a modified text A, they create another text, text B, with some edits in it.
[00:37:11] Customer: And we don't let the user edit any text, and we also don't let them remove any text,
[00:37:21] Customer: but we can let them hide some text, so that it doesn't appear in the filters.
[00:37:30] Customer: This way every card will be associated with a text.
[00:37:37] Customer: And we don't need to implement this feature.
[00:37:46] Customer: We don't need to implement this case when the card is associated with no text.
[00:37:53] Customer: So what do you think about hiding some text?
[00:38:11] nataliamotand: I think maybe the second option that you gave, about having to create a new text and add the cards to it,
[00:38:20] nataliamotand: may be more complicated than if we create a kind of uncategorized text.
[00:38:30] nataliamotand: Right now we have that for decks: when a card is not in any deck,
[00:38:36] nataliamotand: it goes to a different deck that is uncategorized, which is identified by the pair of languages it's studying.
[00:38:46] nataliamotand: So I think, since it's a logic that already exists in the application, it's the simplest one that we have to implement here.
[00:39:01] nataliamotand: And I think that it's a case that is easily implemented in the application, and might be best.
[00:39:12] nataliamotand: About the other one, I'm afraid that it might overcomplicate the flow in a way that the user can't follow it.
[00:39:23] nataliamotand: And about hiding the texts, do you mean hiding from the study session?
[00:39:29] nataliamotand: Like, if I click "hide a text", all the cards associated with that text should also be hidden?
[00:39:36] nataliamotand: Or maybe you meant just hiding from this filter?
[00:39:42] nataliamotand: Well, so a card cannot belong to more than one text, right?
[00:39:57] Customer: Yes.
[00:39:58] nataliamotand: Okay.
[00:39:58] nataliamotand: Then, yeah, logically it would hide all of the cards associated with that text.
[00:40:11] nataliamotand: And yeah, the text will not appear in the filters.
[00:40:18] Customer: Okay.
[00:40:20] Customer: Okay.
[00:40:24] Customer: So let me just make sure I get everything right.
[00:40:30] Customer: Oh, sorry.
[00:40:32] Customer: Yeah, I agree with you regarding the complications that the second flow may introduce.
[00:40:43] Customer: Maybe the user is studying German at school.
[00:40:48] Customer: The teacher gave them some list of words to study.
[00:40:54] Customer: And then they want to just add one more word to the text, to study that word particularly.
[00:41:05] Customer: And in the second approach, they would need to copy the whole initial text.
[00:41:11] Customer: Or they would need to add another text, append this new word there and create new cards.
[00:41:22] Customer: Or they would need to add a text with just that one word.
[00:41:29] Customer: So this will not be a very nice approach.
[00:41:34] Customer: That will duplicate some texts potentially.
[00:41:39] Customer: So I would agree to keep the current approach where the texts are editable.
[00:41:52] Customer: And since it implies that some, previously selected, words may be deleted from a text,
[00:42:05] Customer: we have to handle the case where the whole text is deleted, basically.
[00:42:13] nataliamotand: Right now we have that case about deleting the text.
[00:42:19] nataliamotand: If you open here, you can delete it.
[00:42:23] nataliamotand: And the cards will stay.
[00:42:30] Customer: Okay.
[00:42:32] Customer: So you want to decide what to do?
[00:42:37] nataliamotand: Yes, for example, here, "Suppe".
[00:42:42] nataliamotand: We deleted it and the card is still here.
[00:42:53] nataliamotand: It's just not associated with any text.
[00:42:56] nataliamotand: As you can see, in other cards we have the title of the text redirecting here, but in this one, no.
[00:43:05] nataliamotand: So the card still exists.
[00:43:07] nataliamotand: You just can't see it in the Texts tab.
[00:43:11] Customer: Okay, but I still see this layers icon and the number one.
[00:43:18] nataliamotand: The layers icon is the deck.
[00:43:22] Customer: Ah, so it's not text.
[00:43:24] Customer: Okay.
[00:43:25] nataliamotand: No, it's decks.
[00:43:26] nataliamotand: I'm sorry.
[00:43:27] nataliamotand: Maybe my accent made it sound similar, but these are the decks.
[00:43:35] Customer: Okay.
[00:43:44] Customer: So maybe we just have to add another rule, or case, that if the user edits the text in a way that one of the words disappears,
[00:43:58] Customer: it just disassociates, and it's exactly like it is right now.
[00:44:04] Customer: It's shown, but not associated with any text.
[00:44:08] Customer: Maybe we don't even need to create a category.
[00:44:11] Customer: We can just keep it as it is.
[00:44:17] nataliamotand: Okay.
[00:44:21] Customer: But I wonder whether we should let them hide a text without deleting it.
[00:44:32] nataliamotand: I think it's a good suggestion.
[00:44:35] nataliamotand: On the Texts page, I think it should be easily accessible to the user.
[00:44:44] nataliamotand: So I would just add another hide button here and then ask for confirmation, since the page already shows which cards belong to that text.
[00:44:53] nataliamotand: When we click the hide button, it would just open a modal, a kind of pop-up, and confirm that we want both of these cards hidden from the study session and the text hidden from the filter, so the user can confirm it.
[00:45:11] nataliamotand: And it would still appear in this table, but kind of faded.
[00:45:19] nataliamotand: And then it wouldn't show up in the filters, and not in the study session either.
[00:45:26] nataliamotand: Is that what you mean?
[00:45:26] nataliamotand: Do you agree with this approach?
[00:45:30] nataliamotand: Should we implement it and bring it again next week, so you can verify?
[00:45:39] Customer: Yes, I like this approach.
[00:45:43] Customer: Maybe we could use an archive, the archive word instead of hiding.
[00:45:52] Customer: I'm not sure which one will be more consistent with what you have.
[00:46:00] nataliamotand: Would the archive also be in this table, at the bottom of the table?
[00:46:07] Customer: Yep.
[00:46:07] Customer: Sorry, what did you ask?
[00:46:15] nataliamotand: If the archive of the hidden texts could also be in this table?
[00:46:21] Customer: At the bottom.
[00:46:21] Customer: Yep, it can be there.
[00:46:26] Customer: Or there can be two tabs under Your texts.
[00:46:33] Customer: One for active texts and another one for archived.
[00:46:43] nataliamotand: In this same Texts tab?
[00:46:47] Customer: Just below the Your texts title.
[00:46:47] Customer: Inside this box, Your texts.
[00:46:56] nataliamotand: Also here?
[00:46:56] Customer: Yeah, yeah.
[00:46:56] Customer: Two tabs here.
[00:47:01] Customer: Like "active", "archived", something like this.
[00:47:06] nataliamotand: Like a filter, like we have here.
[00:47:11] Customer: Yes.
[00:47:15] Customer: Regarding this Your texts box, what if the user selects 300 words?
[00:47:25] Customer: How will they be displayed here?
[00:47:30] nataliamotand: Yes, right now it would pile up.
[00:47:33] nataliamotand: So it would not be a good visualization, but we didn't make this example to see how it would look.
[00:47:41] nataliamotand: But since it shows all of them, it would just pile up and be huge.
[00:47:47] nataliamotand: Do you think maybe it should be like...
[00:47:53] nataliamotand: There are two options, the way I see it.
[00:47:56] nataliamotand: Maybe we could just put words in this line until it doesn't fit anymore, and then have three dots, so the person can click and see all of them in a modal.
[00:48:10] nataliamotand: Or maybe we could make a little scroll inside each of these boxes.
[00:48:20] nataliamotand: But I think the first option might be better.
[00:48:20] nataliamotand: I'm not sure.
[00:48:20] nataliamotand: What's your opinion about this?
[00:48:27] Customer: I think we already have a page to view the words selected for a text.
[00:48:36] Customer: Like you have Your cards.
[00:48:40] Customer: Or am I wrong?
[00:48:43] Customer: Here, in the Texts tab, do you show the selected words, or the words that belong to a card?
[00:49:00] nataliamotand: These are the cards.
[00:49:00] nataliamotand: Each of these ones is a card that was made from this text.
[00:49:07] Customer: So, can a user select a word but not generate a card?
[00:49:15] nataliamotand: No, like if you select and you don't say...
[00:49:15] nataliamotand: I don't think you will select it.
[00:49:28] nataliamotand: One marked word has no card yet.
[00:49:31] nataliamotand: Let me just make sure it stays like this.
[00:49:36] nataliamotand: It's all yours.
[00:49:39] Customer: Okay.
[00:49:42] Customer: Anyway, so I see the marked words are already shown here.
[00:49:52] Customer: And the cards as well.
[00:49:56] Customer: And also the user can see the cards in the Your cards tab.
[00:50:04] Customer: So I think it's not necessary to show them in this place, in the Texts tab.
[00:50:13] Customer: So you can just show the text.
[00:50:19] Customer: Yeah, please go to Your texts.
[00:50:22] Customer: You can just show the text title, some info about it, and an Open button.
[00:50:28] Customer: So, no need to show words here.
[00:50:32] Customer: Or cards.
[00:50:35] Customer: Okay, add the new cards.
[00:50:35] Customer: Could you please scroll up?
[00:50:50] Customer: Add cards from a text.
[00:50:55] Customer: This is the...
[00:50:58] Customer: It was the first page in the previous minutes.
[00:51:11] nataliamotand: Do you have things you would like to point out?
[00:51:16] nataliamotand: Or would you like to go back to the user stories and their acceptance criteria?
[00:51:24] Customer: Yeah, I just wonder if Your texts will be...
[00:51:32] Customer: It should be somewhere at the top of this page.
[00:51:43] Customer: Maybe it would be worth it to make two tabs here as well.
[00:51:55] Customer: Like Your texts and Add cards from a text.
[00:52:02] Customer: So that the user does not have to scroll past Add cards from a text to reach Your texts.
[00:52:12] Customer: I don't know if that's...
[00:52:17] nataliamotand: Maybe we could add Add cards from a text as a toggle.
[00:52:24] nataliamotand: And if the user wants to add cards from it, they can just open it.
[00:52:29] nataliamotand: But I would still keep it at the top of the page.
[00:52:36] nataliamotand: So it's easily accessible.
[00:52:39] nataliamotand: Because this one is an action kind of box,
[00:52:43] nataliamotand: and the other one is kind of consultation.
[00:52:47] nataliamotand: So I believe that the user will use this box more than the Your texts box.
[00:52:53] nataliamotand: Especially when they are a beginner in the application,
[00:52:57] nataliamotand: because they are just creating their cards.
[00:53:00] nataliamotand: And so I think it's best if it's the first thing that they access when they enter this tab.
[00:53:11] Customer: Okay, but if they're not really a beginner,
[00:53:16] Customer: and they already have a deck of cards to study,
[00:53:22] Customer: but then they need to quickly add a couple more words from a text,
[00:53:30] Customer: then they have to scroll past this Add cards from a text box to reach Your texts.
[00:53:41] Customer: Actually, I would suggest that Your texts has an "Add new text" button inside it,
[00:54:00] Customer: which will open this box for adding cards from a text.
[00:54:10] nataliamotand: Like on a different page?
[00:54:13] Customer: No, I mean here.
[00:54:15] Customer: There is a box, Your texts.
[00:54:19] Customer: And there is a list of texts.
[00:54:25] Customer: There could be a button like "Add text" below Your texts.
[00:54:32] Customer: And then when the user clicks that button, they can add a new text.
[00:54:40] Customer: This box where they can add a new text opens.
[00:54:44] Customer: So it's not...
[00:54:47] Customer: The box that is currently above Your texts is not always visible.
[00:54:54] Customer: It opens only on demand, when the user tries to add a new text.
[00:55:06] nataliamotand: We can make that.
[00:55:11] nataliamotand: But visually, I think it would not be pleasant.
[00:55:20] nataliamotand: Instead of another box popping up, I think maybe we should do a modal,
[00:55:27] nataliamotand: like the ones that we have when we confirm something like this.
[00:55:32] nataliamotand: Something like this, but bigger, with that option?
[00:55:37] nataliamotand: Not sure, maybe it should be even full screen.
[00:55:45] nataliamotand: Like the way it is right now?
[00:55:47] nataliamotand: Is that the only change that you would make?
[00:55:50] Customer: Yeah, the only change is to not show "Add cards from a text" always,
[00:55:55] Customer: but only show it on demand,
[00:55:59] Customer: when the user clicks a button to add cards from a text.
[00:56:08] Customer: Add a text, basically.
[00:56:14] nataliamotand: So, yeah, and another question is: why is it called "Add cards from a text"?
[00:56:23] nataliamotand: Because this is one of the concerns I had about this suggestion.
[00:56:30] nataliamotand: For us to make sure that we are following the same line of thought,
[00:56:36] nataliamotand: the main goal of the user isn't about the text, but specifically the words that they want to learn.
[00:56:47] nataliamotand: They just want to create cards that they want to learn, to get new vocabulary.
[00:56:55] nataliamotand: I don't think that they would first create the text and then click the words in it to make a card.
[00:57:05] nataliamotand: I think they just want to paste maybe a random text, select the vocabulary that they want, and then create the cards.
[00:57:14] nataliamotand: I think the cards are going to be the most important thing, instead of the text.
[00:57:19] nataliamotand: So that's my concern about hiding this part.
[00:57:23] nataliamotand: Because I think it's one of the main functions.
[00:57:29] nataliamotand: This kind of feeds the whole study session, because it creates the cards.
[00:57:35] nataliamotand: So that's why it's "Add cards from a text".
[00:57:40] nataliamotand: I think the main thing about this application is the cards.
[00:57:46] nataliamotand: So we should make most things about them.
[00:57:52] nataliamotand: How do you create flashcards?
[00:57:56] nataliamotand: And that's why.
[00:57:59] Customer: Yeah, I agree with you here.
[00:58:03] Customer: So, yeah, they need a quick way to add a text, select words and generate cards.
[00:58:12] nataliamotand: Okay.
[00:58:16] Customer: And it's okay to combine both "Add cards from a text" and "Your texts" here, I guess.
[00:58:32] Customer: Maybe we could still make it look like tabs.
[00:58:45] Customer: So there can be a toggle, or tabs toggle, basically, at the top of the page.
[00:58:54] Customer: "Add cards from a text" is the tab that opens by default.
[00:59:00] Customer: And to the right of it there is "Your texts", the "Your texts" part of the toggle,
[00:59:10] Customer: which the user can click and they will switch to this "Your texts" tab and see the list of texts.
[00:59:21] Customer: In this case, they will not need to scroll the page to discover the list of texts.
[00:59:29] Customer: And they will be able to quickly access this text input field to add a new text.
[00:59:41] Customer: What do you think about this?
[00:59:44] nataliamotand: I think it is a better approach.
[00:59:47] nataliamotand: And this way, since this tab has two main functions, adding the cards and seeing the texts,
[00:59:58] nataliamotand: I think it's good that the user can prioritize which function they want to see in a toggle.
[01:00:05] nataliamotand: It only adds another click.
[01:00:08] nataliamotand: So I think that's a good suggestion.
[01:00:11] nataliamotand: But would you prefer to have a toggle in both of them, or only in "Add cards from a text"?
[01:00:18] nataliamotand: I think we should only have a toggle in this first one,
[01:00:23] nataliamotand: because it's not really necessary to hide the other one, since it's at the bottom, you know?
[01:00:29] Customer: Yes.
[01:00:32] Customer: Okay.
[01:00:35] Customer: I didn't get the second part of the phrase.
[01:00:41] nataliamotand: Since the Your texts box is at the bottom, I think there's really no use in adding a toggle to it so that it's hidden, you know?
[01:00:52] nataliamotand: I would just keep it open, but I don't know if you agree.
[01:00:55] nataliamotand: If you have a different opinion, you can also share it here,
[01:00:59] nataliamotand: so I understand why you think that.
[01:01:02] Customer: Okay.
[01:01:04] Customer: So what I meant is like this.
[01:01:07] Customer: Please look at the top of the page.
[01:01:09] Customer: There are Study and Texts buttons, in the nav bar, or how to call it.
[01:01:16] Customer: So I would suggest to make a similar thing, but inside the box.
[01:01:22] Customer: So "Add cards from a text" will be the first button, which opens this box where they can add the text.
[01:01:31] Customer: And to the right will be the "Your texts" button, which will open the second tab, the second box.
[01:01:43] nataliamotand: Okay.
[01:01:44] nataliamotand: So you want these two on separate pages?
[01:01:48] Customer: Yeah.
[01:01:50] nataliamotand: Okay.
[01:01:51] nataliamotand: Okay.
[01:01:52] nataliamotand: That's good.
[01:01:53] nataliamotand: It's easy to implement also.
[01:01:55] nataliamotand: We can just put a button that redirects to the page.
[01:02:02] nataliamotand: We can have a "New" or "Add" button, and we can just keep Texts the way it is, with Your texts.
[01:02:15] Customer: Okay.
[01:02:17] Customer: I think I confirmed a wrong suggestion.
[01:02:24] Customer: So I don't want a new page at the top of this page.
[01:02:29] Customer: I only want the two, I call them tabs.
[01:02:36] Customer: So Study is a tab, Texts is a tab, like in Firefox or in another browser, when you click a URL you switch to another tab.
[01:02:50] Customer: So I would suggest to have such tabs inside the Texts tab.
[01:02:58] Customer: So right now Texts is opened.
[01:03:01] nataliamotand: Okay.
[01:03:02] Customer: I see the "Add cards from a text" box.
[01:03:06] nataliamotand: Okay.
[01:03:08] Customer: And I suggest to make this "Add cards from a text" a tab as well, inside its box.
[01:03:18] nataliamotand: Okay.
[01:03:19] Customer: Okay.
[01:03:20] Customer: Like a tab button.
[01:03:21] Customer: And then to the right there will be another button, "Your texts".
[01:03:27] Customer: And when it's clicked, the box changes, it shows a list of texts instead of the input field and "Ask for sentences".
[01:03:38] Customer: Basically, you have a tab inside a tab.
[01:03:44] nataliamotand: Okay.
[01:03:45] nataliamotand: But which one do you think is primary?
[01:03:47] nataliamotand: Or, as soon as I click Texts, I only have two buttons and I have to click them, or maybe one should be primary.
[01:03:56] Customer: The primary one is add cards from a text and it opens by default.
[01:04:04] Customer: Like Study opens by default now.
[01:04:10] nataliamotand: Okay.
[01:04:11] nataliamotand: Okay.
[01:04:13] Customer: And then you only have one box here with two buttons to choose the tab.
[01:04:25] nataliamotand: Okay.
[01:04:26] nataliamotand: I don't know if we meant the same thing, but just to make sure we are on the same page,
[01:04:33] nataliamotand: I can do it next week, when I'm implementing.
[01:04:36] nataliamotand: I can take a screenshot of the page and show it to you, what it would look like,
[01:04:42] nataliamotand: so you can give an okay if that's what you meant.
[01:04:46] nataliamotand: But the way I see it right now, the flow is that I click Texts and this opens first.
[01:04:54] nataliamotand: But here we have two buttons, one that will be clicked by default, that is "Add cards",
[01:05:03] nataliamotand: and if I click the button here on the right, then this other box will open, "Your texts".
[01:05:08] Customer: Yes.
[01:05:10] Customer: So that's correct.
[01:05:11] Customer: Yes.
[01:05:13] nataliamotand: Okay.
[01:05:14] nataliamotand: So in this case, I will implement it and I can show it to you in the next sprint review.
[01:05:20] Customer: Okay, great.
[01:05:20] Customer: Thank you.
[01:05:23] nataliamotand: You're welcome.
[01:05:25] Customer: Okay.
[01:05:27] Customer: "The text language", "Your first language".
[01:05:35] nataliamotand: Okay.
[01:05:40] Customer: So what does "Your first language" specify?
[01:05:45] nataliamotand: This is the language that the translation will be made in.
[01:05:49] nataliamotand: So here you click which language the text you're going to paste is in.
[01:05:56] nataliamotand: And here you click which language you want it to be translated to.
[01:06:01] nataliamotand: So you can train.
[01:06:03] nataliamotand: So this is the language you already know.
[01:06:05] nataliamotand: And this is the language you're trying to learn.
[01:06:13] Customer: Okay.
[01:06:16] Customer: Not sure if it should be named "first language".
[01:06:25] Customer: "Language which I know."
[01:06:30] nataliamotand: Okay.
[01:06:34] Customer: I'm not even sure if users will get the idea of this application from the first glance.
[01:06:45] Customer: Maybe it would be nice to explain to them what exactly you want.
[01:06:53] Customer: Yeah, by the way, why ask them for the first language here?
[01:07:00] Customer: I think we only need the text language.
[01:07:05] Customer: And later, a deck will specify which two languages are supported.
[01:07:12] Customer: I mean, not supported, but which two languages are used for cards.
[01:07:23] nataliamotand: So you think it should be like a setting where the user puts which language is their first language,
[01:07:34] nataliamotand: and all texts that they paste are automatically translated to the language that they set.
[01:07:45] Customer: Not really.
[01:07:47] Customer: I think this is not the primary setting.
[01:07:53] Customer: I mean, this setting should go after the text, because it determines which decks the cards can be added to.
[01:08:10] Customer: First, the user pastes the text, and then they specify the pair of languages.
[01:08:15] Customer: Decks are filtered, and then they add cards to those decks, or to a deck.
[01:08:26] Customer: So I would suggest to move the settings to below the text input field.
[01:08:36] Customer: And also explain what it's meant for.
[01:08:47] Customer: Like explain that the text language will be used.
[01:08:58] Customer: I mean, you study the text language, and so on.
[01:09:08] Customer: And you know your first language.
[01:09:11] Customer: "Please select them, and you will see decks compatible with this pair of languages".
[01:09:19] Customer: Something like this.
[01:09:21] nataliamotand: Okay.
[01:09:22] nataliamotand: The way it is right now is already showing like this.
[01:09:27] nataliamotand: We will just move this entire selection to here.
[01:09:31] nataliamotand: Maybe change this to something more specific.
[01:09:37] nataliamotand: Because, for example, the user's first language can be English and they can paste the text in English,
[01:09:43] nataliamotand: and they want to learn the words from that text.
[01:09:47] nataliamotand: So German will not necessarily be the user's first language.
[01:09:51] nataliamotand: So we can just think of a proper title for this specifically.
[01:10:02] Customer: Yep.
[01:10:05] nataliamotand: Okay.
[01:10:07] nataliamotand: "Pick at least one deck".
[01:10:09] Customer: Okay.
[01:10:10] nataliamotand: So that's it for this page.
[01:10:14] Customer: For now, I guess you have three user stories to review, right?
[01:10:20] nataliamotand: Yes, yes.
[01:10:24] nataliamotand: We can move forward with them.
[01:10:28] nataliamotand: And as we go through each acceptance criterion, you can also comment about the page specifically.
[01:10:35] nataliamotand: Because I think this way we can go through the whole application,
[01:10:45] nataliamotand: and you can see everything that you would like to maybe change or clarify.
[01:10:52] nataliamotand: So we can move forward with the first user story.
[01:11:00] Customer: "Mark more words in it".
[01:11:05] Customer: "Given I saved a text, when I open the Texts tab, then I see them and I can open one, edit it and mark more words in it".
[01:11:16] nataliamotand: Yeah.
[01:11:19] Customer: So I think we did not open a text, or did we?
[01:11:24] Customer: Would you please demonstrate it?
[01:11:26] nataliamotand: Okay.
[01:11:30] Customer: Yeah, you selected a word and did not generate a card for it.
[01:11:36] nataliamotand: So here you could see that we selected the word and it's not marked anymore, but it created a card for it when we select this option.
[01:11:58] Customer: Yeah.
[01:12:00] nataliamotand: Okay.
[01:12:04] Customer: And it's shown in the list of cards, right?
[01:12:08] nataliamotand: Yes.
[01:12:09] Customer: Okay, "Morgen".
[01:12:13] Customer: All right.
[01:12:17] Customer: What happens if you untick the Travel deck?
[01:12:23] Customer: Will it still show in this list of cards?
[01:12:27] nataliamotand: Yes, this list of cards is about the texts and not the decks specifically.
[01:12:33] nataliamotand: The decks only open so we add the new cards to it.
[01:12:37] Customer: Okay.
[01:12:44] Customer: Okay.
[01:12:45] Customer: Let's proceed then.
[01:12:47] Customer: Yeah, so you added, you marked a new word.
[01:12:55] Customer: Yeah, editing is...
[01:12:58] nataliamotand: We didn't edit it, but okay.
[01:13:02] Customer: So how does it look when you edit it?
[01:13:10] nataliamotand: Okay, you can just add the text here or create new ones, but right now the flow is that the cards don't lose the association to the original text, even if I edit them out of here, they won't lose their association.
[01:13:29] nataliamotand: So it's something that we talked about previously, and we should change that rule, right?
[01:13:35] Customer: Yep.
[01:13:37] Customer: Also, you show at the top of the page, in the upper right corner, you show "German to English".
[01:13:51] Customer: Does it mean that this text can be used only for German-English decks?
[01:13:59] nataliamotand: Yes, since you don't select the language again, every time you click make cards, it will use the original translation option that you chose when you added the text.
[01:14:14] Customer: Okay.
[01:14:18] Customer: So, since the language pair seems to not be a property of the text, but a property of the deck, I would suggest to make it editable.
[01:14:34] Customer: Basically, let the user select the pair before they select the decks to add cards to.
[01:14:51] nataliamotand: I'm not sure I understood.
[01:14:53] nataliamotand: Okay.
[01:14:54] nataliamotand: Do you mean here, or do you mean here?
[01:14:59] Customer: I mean, here is the initial place where they add a text and the cards.
[01:15:09] Customer: Here, we move this language pair into the card generation process, below the text input.
[01:15:23] Customer: And when they open a text and want to generate a couple of new cards, we should also move this language pair setting into this process of generating new cards.
[01:15:43] Customer: So, to be less abstract, just "Add the new cards to".
[01:15:52] Customer: No, no, please open the text.
[01:15:57] nataliamotand: Okay, yeah.
[01:15:59] nataliamotand: Here.
[01:16:02] nataliamotand: Where is it?
[01:16:04] Customer: Yeah, please scroll down a bit.
[01:16:06] Customer: So here I see "Add the new cards to".
[01:16:09] Customer: You see, with all the decks.
[01:16:13] Customer: I would suggest to add this language pair setting here, so that it can work as a filter.
[01:16:26] Customer: And then, yeah, let the user decide which decks the new cards will go into.
[01:16:38] Customer: One objection can be here.
[01:16:45] Customer: The text language is constant.
[01:16:48] Customer: Okay, I can agree that when the user adds the text, they can specify the language of the text.
[01:16:56] Customer: But if they want to reuse the text to study two languages, then they should be able to specify the second language somewhere here,
[01:17:08] Customer: when they are creating new cards.
[01:17:08] Customer: They should not specify it in one place, when they add the text or edit the text.
[01:17:20] Customer: What do you think?
[01:17:24] nataliamotand: I think we can add, not a feature, but another step in these changes, or in making cards, where the user chooses which language they want the text in the cards that they selected to be translated to.
[01:17:50] nataliamotand: I think that creates one more complication, because maybe they want the same words translated both to German and to English, for example.
[01:18:02] nataliamotand: And then we need to think about how we would select words that are already selected.
[01:18:09] nataliamotand: But we can discuss it with the rest of the team and see the best way to implement this, because I think it's a good concern that you have, especially for people who are learning more than one language at once.
[01:18:28] nataliamotand: I think it's not as simple, but it's something that, if it's important for the user and for you as a client, we can think of a way to do it.
[01:18:45] nataliamotand: But did you understand why it's a little more complex?
[01:18:57] Customer: Okay, I didn't quite get why it's complex from your point of view, but I see one complication here, that they can select... actually no.
[01:19:18] Customer: I wonder if they will ever need to reuse the text.
[01:19:24] Customer: So the text is in a language that they study.
[01:19:28] Customer: It's not the language that they know, because they don't reuse it to study several other languages.
[01:19:40] Customer: So maybe they even will not reuse it.
[01:19:52] Customer: I had a concern that they can select different sets of words in the text to study several languages.
[01:20:02] Customer: But since the text is not in the language that they know, they don't select several sets of words.
[01:20:11] Customer: They only select one set of words for a language that they study.
[01:20:17] Customer: So they will probably not reuse the text.
[01:20:23] Customer: Therefore, it's not necessary to support the reuse of the text.
[01:20:42] Customer: And so we should let them specify the language of the text at some place, and it will not be editable afterwards.
[01:20:57] Customer: But here, when they want to add new cards, we should let them specify the language that they know.
[01:21:06] Customer: So they can decide which pair of languages to use in the deck.
[01:21:26] Customer: Could you please explain the complication that you saw before?
[01:21:32] nataliamotand: Yes.
[01:21:32] nataliamotand: If it's an option for the user to add cards in different languages.
[01:21:41] nataliamotand: For example, right here I have a German text, and I want "Morgen" translated and a card created both for Russian and for English.
[01:21:53] nataliamotand: For example, German is my main language, it's my first language.
[01:21:57] nataliamotand: And I want "Morgen" translated to both Russian and English.
[01:22:02] nataliamotand: When I click here and, for example, there is already an English card for it, how can I click it again,
[01:22:09] nataliamotand: and the product understands that I want a Russian version of it?
[01:22:14] nataliamotand: So the way I see it, to click the same word and have an option to translate it to both languages is right here.
[01:22:24] nataliamotand: I can select beforehand which language I want that translated to.
[01:22:31] nataliamotand: So these will have two states, depending on the language it's selected for.
[01:22:37] nataliamotand: This is my way of handling this thing that the flow right now doesn't handle.
[01:22:46] nataliamotand: But I'm not sure that's what you want.
[01:22:51] Customer: Yeah.
[01:22:51] Customer: So you found a new scenario for this application.
[01:22:58] Customer: You provide the text in the language that you know, your first language,
[01:23:03] Customer: and you generate several cards for several languages from this text, and generate sentences in those languages.
[01:23:23] Customer: I assumed that any text that they provide is in a language that they don't know.
[01:23:30] Customer: They study it.
[01:23:30] Customer: In this case, okay, for example, they study German.
[01:23:42] Customer: In this case, they select a set of words in this German text, and they generate cards for this set of words.
[01:23:56] Customer: And there can be no other set of words for another language, because they study just German.
[01:24:05] Customer: But in your case, for example, they know German and study English and Russian.
[01:24:14] Customer: And they selected these three words to study, in Russian: translate them to Russian and study them.
[01:24:28] Customer: What if they want to study other three words, in English?
[01:24:36] Customer: So they select [inaudible], and then translate this to English and study it.
[01:24:47] Customer: This really does introduce some complications, like you need a set of selected words per language.
[01:24:58] nataliamotand: Yes, I think the best way for us, if you decide it's important to have that in the application,
[01:25:04] nataliamotand: the best thing to do is to make some kind of button here, so the user can let the application know which language they want those cards translated to.
[01:25:20] nataliamotand: So it can check if they already exist and doesn't clash.
[01:25:25] nataliamotand: In this case, for example, it already has a translation for English.
[01:25:31] Customer: I wonder if we should provide this feature at all.
[01:25:41] nataliamotand: This is a feature that we can add as a user story, in case the other, more important things that you want from this application are already implemented.
[01:26:01] nataliamotand: If we have enough time, so things such as login.
[01:26:07] nataliamotand: And I think they should be prioritized, and we can come back to improving this text selection when they are done, or create an issue and set it apart,
[01:26:28] nataliamotand: for this flow to be improved and give the user more options about how to use the product.
[01:26:35] nataliamotand: I think the product should be complete, every flow complete,
[01:26:43] nataliamotand: and when it is, we can improve each of them to give the user more options of how to use the application.
[01:26:52] Customer: Yeah, I agree.
[01:26:56] Customer: Let's follow this approach.
[01:26:59] Customer: Yeah, but for now, assume that they add a text in a language that they study.
[01:27:09] Customer: In a language that they know.
[01:27:11] nataliamotand: Okay.
[01:27:17] Customer: All right, let's proceed.
[01:27:19] nataliamotand: Okay.
[01:27:25] nataliamotand: Okay.
[01:27:29] nataliamotand: Okay, that worked.
[01:27:34] Customer: "Given a text with cards, when I edit or delete the text, then its cards are kept".
[01:27:41] Customer: If you remove a word that is selected, will it be kept?
[01:27:49] nataliamotand: Yes.
[01:27:51] Customer: Will its card be kept?
[01:27:56] nataliamotand: It's not kept in the text, but the card still exists here.
[01:28:05] Customer: So, sorry, which one did you remove?
[01:28:14] nataliamotand: Let me do it again, so we can verify it.
[01:28:18] nataliamotand: Like [inaudible].
[01:28:21] Customer: Okay.
[01:28:22] Customer: Okay, it's there.
[01:28:32] nataliamotand: Okay.
[01:28:37] Customer: So it belongs to a deck and it's there, but it doesn't belong to a text.
[01:28:44] nataliamotand: Yes, so the progress of each card won't be deleted because you deleted the text or removed the card from it.
[01:28:57] Customer: Got it.
[01:28:59] nataliamotand: Okay.
[01:29:03] Customer: What do you think, will the user expect this card to be hidden, or something like this, excluded from the study queue?
[01:29:12] Customer: Or, if they care about the progress, would they expect that it's kept?
[01:29:17] Customer: It just doesn't belong to a text.
[01:29:20] nataliamotand: I think we have two options here.
[01:29:23] nataliamotand: The first one, the user expects the card to be hidden, and the second one, when they don't.
[01:29:28] nataliamotand: I think if we automatically hide the cards that are taken out of the text, the user that didn't want this to happen will find it strange that the cards are not showing up again.
[01:29:41] nataliamotand: So I think we should prioritize the vision of the user who didn't know that this flow would happen, since we don't specify it.
[01:29:52] nataliamotand: And the user who wants to hide it can just come here to Your cards, if that's the case, and hide it.
[01:30:00] nataliamotand: Or maybe they could hide it beforehand, before deleting the sentence that they wanted to, from here.
[01:30:10] nataliamotand: So I guess my opinion is that we shouldn't hide it automatically.
[01:30:16] nataliamotand: Especially if the user doesn't know that this is the normal behavior of the product.
[01:30:25] nataliamotand: Yeah, then it will not be very surprising.
[01:30:30] Customer: Okay, what do you think?
[01:30:30] Customer: Maybe keep the card below the text, like here, after its word is no longer in the text.
[01:30:48] nataliamotand: I think previously I thought that was an option.
[01:30:54] nataliamotand: But since we discussed beforehand, this was something that you expected, that the cards lose their association to the text.
[01:31:05] nataliamotand: So I made a mistake, because I didn't quite understand that this rule was already implemented.
[01:31:13] nataliamotand: But this was something that I thought was what you wanted, in the meeting before, specifically.
[01:31:23] nataliamotand: I thought this was the normal behavior, you know.
[01:31:26] nataliamotand: The card doesn't lose its progress, but it doesn't get associated with the text, since it's not there anymore.
[01:31:34] nataliamotand: So there's no need.
[01:31:43] Customer: But maybe some users would like to search for such cards that they created before from this text, and then maybe accidentally removed from the text.
[01:32:08] Customer: If a card loses this connection to the text it was created from initially, then they will have no way to discover such cards as belonging to this particular text.
[01:32:30] Customer: So I would suggest to keep the association between a card and the text as long as the text is still there, it exists.
[01:32:47] Customer: Yeah, maybe show them somehow, like mark them somehow that the word is not inside the text, like if it was deleted from a text.
[01:33:03] nataliamotand: Okay, we can do that.
[01:33:06] nataliamotand: Okay, not sure how to better show that.
[01:33:15] nataliamotand: Maybe there can be something down here.
[01:33:24] Customer: Yeah, maybe there can be two tabs here as well, like "cards of this text" and "past cards", or I don't know how to call this second tab.
[01:33:46] nataliamotand: Yeah, but what can be the purpose of a tab?
[01:33:52] Customer: So if it has the second tab, the tab just contains the cards with the words that don't belong to the text anymore.
[01:34:06] Customer: I think this title should be "created from this text".
[01:34:11] Customer: And then we have the tab "active" and a tab "not active".
[01:34:16] Customer: But maybe if we change the title, it will solve this problem with the understanding of it.
[01:34:28] Customer: Or maybe, yeah, "still in the text", "no more in the text".
[01:34:35] nataliamotand: Okay.
[01:34:39] Customer: Yeah, this can be tabs, or this can be buttons, like a filter just above the table.
[01:34:56] Customer: But anyway, it would be nice to keep the association while the text itself exists.
[01:35:02] Customer: Maybe the person would like to take a card that they generated before and add a sentence to this text, just to not lose that card.
[01:35:25] Customer: Have some context for it.
[01:35:29] nataliamotand: Okay.
[01:35:33] Customer: No need to complicate this further.
[01:35:35] Customer: Okay, let's proceed.
[01:35:39] Customer: Okay, "given".
[01:35:43] Customer: Yeah, "then its cards are kept".
[01:35:48] Customer: Yeah, "given a card made from a text, when I open the card, then it shows the name of its text".
[01:35:58] nataliamotand: Okay.
[01:36:01] nataliamotand: It was one of the things that we were doing before.
[01:36:05] nataliamotand: You can click the text title and easily access the text.
[01:36:24] Customer: Sorry, I need to text another team to postpone our meeting a bit.
[01:36:31] nataliamotand: Okay.
[01:36:31] nataliamotand: Yeah.
[01:36:34] Customer: Just another game.
[01:36:37] nataliamotand: Of course.
[01:36:37] nataliamotand: Here in Your cards, each card has the association to its text, and it's easily shown to the user, so that when I click the title of the text, I can easily move to the text, where I can edit it or easily access it.
[01:37:02] Customer: Okay, I see.
[01:37:05] Customer: Then, yeah, I think this is done.
[01:37:11] nataliamotand: Yeah, I have a suggestion that we don't close the user story yet, because some of the behavior that we had predicted here before does not afford what you think is important for the product.
[01:37:27] nataliamotand: My suggestion is that we revise it in this next sprint, and show it again against the new acceptance criteria that describe the behavior that we discussed here today.
[01:37:41] Customer: Yeah, this is an option, or you can still mark this acceptance criteria and create a new user story, like more specific one.
[01:37:55] Customer: Because this one was about keeping the text, as far as I can see.
[01:38:00] nataliamotand: Yes.
[01:38:01] Customer: And not about keeping the cards specifically and how to keep them.
[01:38:08] nataliamotand: Okay, that's a good option also.
[01:38:12] nataliamotand: So you accept this user story 15?
[01:38:17] Customer: Yeah, yes.
[01:38:21] nataliamotand: We can move forward.
[01:38:21] nataliamotand: What we have to do is show these two acceptance criteria, which are related to the decks, but we can also show them in the next meeting, since you have other commitments.
[01:38:40] nataliamotand: And the other thing was about the usability tests; I can quickly go through them,
[01:38:46] nataliamotand: so you are aligned with what we are doing in the next sprint.
[01:38:53] nataliamotand: Would you prefer it that way, or some other way?
[01:38:53] nataliamotand: You also, I don't know, you can correct me if I'm wrong, because I am not sure if we have proper rules for this, but you also have access to the production of the application.
[01:39:15] nataliamotand: And I can share these user stories with you.
[01:39:19] nataliamotand: They are viewed this way.
[01:39:21] nataliamotand: And if you would like to test it yourself, you can also do it.
[01:39:26] nataliamotand: But if you prefer that I test with you on a call, we can postpone it to the next meeting.
[01:39:33] nataliamotand: What would you prefer?
[01:39:39] Customer: For the constraint, we have half an hour to finish what we plan.
[01:39:48] Customer: I would prefer to test on a call, maybe this one or the next one.
[01:39:55] Customer: So that we can comment and we can discuss the details that can be changed or should be changed.
[01:40:05] nataliamotand: Okay, I think we can change the order of the meeting.
[01:40:10] nataliamotand: I can quickly go through the usability tests, and then we can go back to these two user stories, so that in case our time runs out, I can just take the user story that wasn't presented and postpone it to the next meeting.
[01:40:28] nataliamotand: But this way we can finish what we have for the meeting and keep discussing while we still have time.
[01:40:35] Customer: Yeah, I agree.
[01:40:37] nataliamotand: Okay, so before user story 20, about the usability tests, I'm just going to tell you what we had planned for it.
[01:40:54] nataliamotand: And I can also share these links with you later, they are documented already.
[01:41:00] nataliamotand: Some of it isn't specified yet, but it will be by the end of the deadline today.
[01:41:07] nataliamotand: So, for the design of our usability tests, we ask you to decide four things by the end of it.
[01:41:15] nataliamotand: And it runs on staging, with people outside of the team.
[01:41:20] nataliamotand: And we don't have the results yet for Week 7, because we're going to run them next week.
[01:41:26] nataliamotand: So the participant of the usability test is a learner of Russian, English or German, 18 years old or older, who is not on our team, not instructed, and has not used the product before.
[01:41:41] nataliamotand: And we need at least three completed sessions, and ideally five is the design target.
[01:41:49] nataliamotand: So the main task for these usability tests is to read a short sentence in a language that you are learning,
[01:41:57] nataliamotand: remember some of its words, get ready to practice them as cards, and answer the first card.
[01:42:05] nataliamotand: And we also have the first secondary task, which is to put the new cards together in a group of your own,
[01:42:14] nataliamotand: that would be the decks, to study later.
[01:42:17] nataliamotand: And the second secondary task is that a card shows a sentence you do not like, and you get a different one.
[01:42:25] nataliamotand: The user can do that intuitively with the application that we already have today.
[01:42:37] Customer: So, try to regenerate.
[01:42:40] nataliamotand: Yes, that's exactly right.
[01:42:44] nataliamotand: So, also about other things of these assignments.
[01:42:51] nataliamotand: The consent records, raw notes and recordings will be kept private.
[01:42:57] nataliamotand: I already created the repository and sent you the link.
[01:43:01] nataliamotand: You said that you joined.
[01:43:01] nataliamotand: So I guess that's okay.
[01:43:04] Customer: That's okay.
[01:43:04] nataliamotand: And I've also created a drive, so we can store the recordings of the meetings that we are going to have with the users, and they will be kept private.
[01:43:17] nataliamotand: And the link of this folder will go through Moodle and will not be posted in the repository.
[01:43:24] Customer: Great.
[01:43:26] nataliamotand: So, by the end of the usability tests, we intend to write the results and findings, and the team will turn each finding into a task.
[01:43:37] nataliamotand: And to show everything we have documented, we will show it to you.
[01:43:41] nataliamotand: So we were wondering what you think the results of these usability tests must be.
[01:43:48] nataliamotand: What should they show you for us to act on it?
[01:43:53] nataliamotand: Do you have any things that we didn't cover here?
[01:43:56] nataliamotand: Maybe more tasks that the user should be able to do?
[01:44:11] Customer: I think the primary task should be a bit extended so the user finds a text and pastes it.
[01:44:26] Customer: The text that they want.
[01:44:26] Customer: Not that you prepare a text.
[01:44:36] nataliamotand: Do you think we should have a library with some demo texts inside the product?
[01:44:52] nataliamotand: Something like that?
[01:44:52] nataliamotand: I'm not sure what you meant.
[01:44:57] Customer: I mean, in a real environment, they will find the text and paste it into the service.
[01:45:10] Customer: And you mentioned that you prepare, the team prepares, a short text of similar length in each of Russian, English and German.
[01:45:24] Customer: Why prepare a text?
[01:45:29] nataliamotand: We did some texts in these three languages, so the user can choose which one of them they want to train.
[01:45:37] nataliamotand: But do you think maybe we should leave it up to the user which text they want to paste in the application beforehand?
[01:45:50] Customer: The source of the text should not be your application.
[01:45:58] Customer: I think we should let them figure out how to get the text and paste it into the application.
[01:46:06] Customer: If they can't do that, then something is wrong.
[01:46:13] Customer: I mean, you can do it like this.
[01:46:20] Customer: Provide them the text on Telegram and don't explain exactly how to paste the text.
[01:46:28] Customer: But it would be more realistic to let them find the text on the Internet and paste it.
[01:46:38] Customer: Maybe you can also track how much it takes to find the text, copy it and so on.
[01:46:48] Customer: Whether it will be convenient for the user to do it like that.
[01:46:55] nataliamotand: Yes.
[01:46:57] nataliamotand: I think so, since it is the idea of the application that the user can use the text that they want to learn, and learn the words from it.
[01:47:08] nataliamotand: I think it's best that we don't give them the text beforehand and they can just search for it.
[01:47:14] nataliamotand: But I think one improvement that we could have in the future, to also bring value to the application, is maybe to add some libraries with some introductory texts or something like that.
[01:47:31] nataliamotand: Like children's stories, or in multiple languages.
[01:47:35] nataliamotand: So the user can start learning from these texts inside the application.
[01:47:41] nataliamotand: And they don't have to go to other sources unless they want to.
[01:47:49] nataliamotand: This is something we can improve later.
[01:47:52] nataliamotand: Because this way, the user doesn't have to go outside of the application to start learning.
[01:47:58] nataliamotand: They can just learn from the product in a way that it is complete.
[01:48:04] Customer: Yeah, I agree.
[01:48:08] Customer: Yeah, I agree that this can be a good approach.
[01:48:13] Customer: Although there are limitations.
[01:48:16] Customer: If you hard-code some texts, then you assume something about the user.
[01:48:23] Customer: There can be a mismatch.
[01:48:27] Customer: Not everyone may enjoy reading or learning words from children's stories.
[01:48:36] nataliamotand: Yes.
[01:48:39] Customer: An approach that another team tries is to let the user specify the level at which they know a language,
[01:48:51] Customer: and maybe go through a free placement test.
[01:48:57] Customer: To learn their level, like A1, A2, B1, B2 or something like this.
[01:49:04] Customer: And then use this level to generate sentences for cards.
[01:49:14] Customer: Such a placement test can be used as well.
[01:49:20] Customer: Like in your case, where we generate texts for a user's level, maybe based on the user's prompt.
[01:49:32] Customer: This way we can avoid hard-coding texts.
[01:49:38] nataliamotand: That's a good suggestion.
[01:49:42] Customer: Okay.
[01:49:42] Customer: So your secondary task is to add cards to a deck.
[01:49:55] Customer: "Study later".
[01:49:58] Customer: "Start: the library with the cards from the main task".
[01:50:01] Customer: "End state: the cards are together in a group the participant made".
[01:50:11] Customer: Okay.
[01:50:11] Customer: "Group the new cards".
[01:50:16] Customer: Okay, you don't call it decks, you call it a group.
[01:50:26] Customer: What for?
[01:50:35] Customer: You use the words "group the new cards" and don't mention the word "deck".
[01:50:43] Customer: Why do you write it like this?
[01:50:46] nataliamotand: Maybe the wording isn't the best, but we wrote it this way because the only way we have to group the cards today is in decks.
[01:50:56] nataliamotand: So the functionality that the user wants is not to have a deck.
[01:51:02] nataliamotand: It's to have cards grouped together by their area and theme, so they can study them.
[01:51:10] nataliamotand: So that's why the word "deck" doesn't appear here beforehand.
[01:51:14] nataliamotand: It's more about the functionality by itself than the way that we present it.
[01:51:20] nataliamotand: That is decks, you know.
[01:51:22] Customer: Yeah.
[01:51:22] Customer: Okay.
[01:51:26] nataliamotand: So what do you think?
[01:51:26] nataliamotand: Can we assume that users know the word "deck" and what it means?
[01:51:37] Customer: I guess "decks", for a user who has already used Anki, for example, is understandable.
[01:51:48] Customer: But for users who maybe haven't, I'm not quite sure.
[01:51:53] Customer: And I don't have an opinion about this yet.
[01:51:57] nataliamotand: Maybe you have suggestions to change the way that we present it?
[01:52:03] Customer: An option can be to explicitly search for users who did not use Anki and see whether they recognize how grouping can work.
[01:52:28] Customer: Another option is to add a help button at the top of the page and clarify some concepts, or just explain what a deck is.
[01:52:43] Customer: Maybe give some other instructions on how the system is intended to be used.
[01:52:53] nataliamotand: Yes, it's also a good option.
[01:52:57] nataliamotand: We can do that first, since we are going to have users testing the product next week.
[01:53:06] nataliamotand: We can observe this also and put it in the record of what we found.
[01:53:16] Customer: Great.
[01:53:19] Customer: And this is your task: "Replace a sentence".
[01:53:23] Customer: "A card shows a sentence you don't like".
[01:53:26] Customer: "Get a different one".
[01:53:29] Customer: "Start: the card of the library is open".
[01:53:31] Customer: "End state: the card shows a different sentence".
[01:53:34] Customer: "Limit: three minutes".
[01:53:36] nataliamotand: Okay.
[01:53:36] nataliamotand: Hopefully the API works at that point.
[01:53:43] Customer: Okay.
[01:53:43] Customer: Yeah, I think this one is enough.
[01:53:59] Customer: It should not be extended.
[01:54:03] Customer: But maybe it can be extended.
[01:54:12] Customer: It can be conducted in two places.
[01:54:15] Customer: So in Your cards and during the session.
[01:54:15] Customer: I don't see here the context.
[01:54:25] Customer: Where is the card of the library open?
[01:54:36] nataliamotand: So the user added... since each library is associated with the user, when they open the app, it doesn't have any cards.
[01:54:46] nataliamotand: But when they create one, it will be associated with their library.
[01:54:51] nataliamotand: So it's just the cards that it's going to show in Your cards, the same way that we use it, you know.
[01:54:59] Customer: Okay.
[01:54:59] Customer: So I mean, there are two modes where you can regenerate a sentence, as far as I remember.
[01:55:10] nataliamotand: Yes, I think even more.
[01:55:12] nataliamotand: You can do it inside the session, and in the Texts tab you can also regenerate them.
[01:55:22] nataliamotand: And in Your cards, you can also do that.
[01:55:25] nataliamotand: So there are three different ways.
[01:55:28] nataliamotand: And in this case we would like the usability test to grasp the intent of the user to change that, and see if they can change it in any of the ways that the application allows it, you know.
[01:55:46] nataliamotand: Where do we want the user to regenerate it?
[01:55:51] nataliamotand: We just want their wish to get a new card fulfilled, you know.
[01:55:56] nataliamotand: So that's why it's not specified.
[01:55:58] nataliamotand: And I don't think maybe we should specify, because we then introduce constraints that we may not be able to see in the time limits that we have.
[01:56:08] nataliamotand: Like, "I want the user to regenerate the cards specifically from the Your cards tab".
[01:56:14] nataliamotand: Then it's too specific, you know.
[01:56:16] nataliamotand: We just want that, if the user wants to regenerate, they can regenerate it from any of the places that we allow it.
[01:56:26] Customer: Right.
[01:56:28] Customer: But then you may not be able to see whether they recognize that they can do it in all of those places.
[01:56:39] Customer: I mean, all of the users may go to one place and regenerate only there, but they may not recognize that they can do this when they are in other places.
[01:56:53] nataliamotand: Yeah, I understand.
[01:56:53] nataliamotand: Do you think this is something that we should measure in the first usability tests?
[01:57:00] Customer: Yes, I think you should measure this.
[01:57:08] Customer: I mean, I think you should ask the user to regenerate in at least two places, like in your system.
[01:57:20] Customer: You can also ask them to navigate to some place in your system where they can regenerate.
[01:57:30] Customer: Like, first go to the Texts tab, open a text, and regenerate there.
[01:57:38] Customer: Something like this.
[01:57:40] Customer: And then go to a session and regenerate there.
[01:57:47] Customer: "Get a different one", I don't know.
[01:57:52] Customer: If regenerate is too specific, maybe, like, use this simpler wording, like, get a different one.
[01:58:02] nataliamotand: Okay, that's an option.
[01:58:02] nataliamotand: We can make it more guided, right?
[01:58:08] Customer: Yep.
[01:58:10] nataliamotand: Okay.
[01:58:13] Customer: And, okay, so you will test...
[01:58:19] Customer: Will you test the whole scenario, the primary scenario?
[01:58:24] Customer: Like adding a text, generating new cards, putting them into a deck, selecting a deck to study,
[01:58:35] Customer: and then fixing the card.
[01:58:39] Customer: I guess, do they start the session, get ready to practice them with cards, and answer the first card?
[01:58:57] nataliamotand: Yeah, okay.
[01:58:59] Customer: Do they run a session?
[01:59:05] nataliamotand: Yes.
[01:59:05] nataliamotand: The main usability task runs from...
[01:59:11] nataliamotand: They create the cards and they get to study the cards, so they start the session.
[01:59:19] Customer: Okay.
[01:59:19] Customer: But they can't run a session without decks, right?
[01:59:32] nataliamotand: No, you have to add the cards to decks.
[01:59:39] Customer: Okay, so do they do the second task as part of the first task?
[01:59:47] nataliamotand: Yeah, they're going to do it together.
[01:59:54] nataliamotand: But here we can improve the second usability task.
[02:00:02] nataliamotand: So, in a way that, this is one of the...
[02:00:06] nataliamotand: Let me show you, I think it will be best.
[02:00:09] nataliamotand: Today, if we have a deck, we can study that deck specifically.
[02:00:14] nataliamotand: So I think that the second usability task can test that.
[02:00:19] nataliamotand: That the user understands that they can study specifically the cards that they grouped in the group that they're going to use.
[02:00:27] nataliamotand: And they can do that either through here, where they automatically go to the study session,
[02:00:33] nataliamotand: or maybe through here, where they select and start a session.
[02:00:37] nataliamotand: And they understand that the deck that they're going to study is the one selected.
[02:00:42] nataliamotand: So we can improve the task itself to make sure that it is completed the way we want it to be.
[02:00:51] Customer: Yep.
[02:00:51] Customer: All right.
[02:00:55] nataliamotand: Is that what you meant?
[02:00:56] Customer: Yes.
[02:00:56] Customer: It would be nice to check both ways.
[02:01:05] nataliamotand: Okay.
[02:01:05] nataliamotand: [inaudible].
[02:01:09] Customer: Yeah, I think that covers pretty much the whole core functionality.
[02:01:17] Customer: So, that's enough, I guess, three tasks.
[02:01:17] Customer: Yeah.
[02:01:25] nataliamotand: Okay.
[02:01:25] nataliamotand: And then we can move forward to the quality requirement.
[02:01:34] nataliamotand: Number eight here.
[02:01:37] nataliamotand: So, the quality requirement is a measure of the median.
[02:01:44] nataliamotand: And it's a single question where the user rates from one to seven,
[02:01:51] nataliamotand: in which one is hard and seven is easy for them to use the application specifically.
[02:02:01] nataliamotand: And the bar, the goal, is at least five out of seven over the three sessions that we're going to have.
[02:02:13] nataliamotand: And this test is manual and planned for the next sprint.
[02:02:20] Customer: Yeah, sounds right.
[02:02:24] Customer: Yeah, I think it's enough.
[02:02:28] nataliamotand: So, that's it for the usability test and the quality requirement that will measure it.
[02:02:28] nataliamotand: And we can move forward with the user stories.
[02:02:40] nataliamotand: I don't think we'll be able to do all the user stories, but we can show you the decks that we built,
[02:02:48] nataliamotand: so you have a vision of it, and it doesn't go completely ignored in this meeting.
[02:02:55] nataliamotand: So, this is the next step that we mentioned, [inaudible], in a way that the user can see what they are going to study today, and what percentage of the cards are not new or forgotten.
[02:03:15] nataliamotand: So here you can see the cards that are due to study and the ones they have already studied, so they have a sense of what their progress is in that area specifically.
[02:03:30] nataliamotand: So here they can also rename the deck in an easy way.
[02:03:30] nataliamotand: And I forgot the word for this, but it's done in a discreet way, so we can just rename it here and save it.
[02:03:50] nataliamotand: And they cannot leave a deck without a name.
[02:03:50] nataliamotand: So that's not a possibility.
[02:03:50] nataliamotand: They can also study the decks right away.
[02:03:50] nataliamotand: They don't have to, in case they're looking at the decks and, right now, I want to study food, then they can just study the cards that are in that deck specifically.
[02:04:14] nataliamotand: And they can also add other cards and easily access them here.
[02:04:14] nataliamotand: So these cards will be brought to this deck.
[02:04:14] nataliamotand: And they can also quickly access the cards; the way that the cards show here is similar to Your cards, the main things that they get to see, and they can also change them here.
[02:04:41] nataliamotand: And about deleting this deck, we brought here two options.
[02:04:41] nataliamotand: The first one, which is selected by default, is that the cards are not deleted, because maybe they just want to delete the deck but keep the cards.
[02:04:41] nataliamotand: But in case they don't see the necessity for those cards anymore, they can also delete the cards as they delete the deck.
[02:05:04] nataliamotand: And that's pretty much it.
[02:05:04] nataliamotand: I ran through here and didn't go through the acceptance criteria, but these are the main things that this page allows.
[02:05:04] nataliamotand: And if you have any considerations, feel free to share them with me.
[02:05:23] Customer: Yeah, first of all, I don't quite get what "forgotten" is.
[02:05:35] Customer: What does "forgotten" mean here?
[02:05:37] nataliamotand: It means that, for example, here in the study, you press "Again", and maybe you didn't answer, so that card is forgotten.
[02:05:49] nataliamotand: It's because I can put here the new one.
[02:05:49] nataliamotand: So you could see that the card that I didn't answer, and didn't answer again before the end of the session, moved from "new" to "forgotten" here.
[02:06:06] nataliamotand: So that's what it means.
[02:06:06] nataliamotand: "New" is the card that was created and never studied, and "review" are the cards that are due today.
[02:06:18] Customer: Okay.
[02:06:18] Customer: And "forgotten" is also a card due today, due this session?
[02:06:26] nataliamotand: Yes.
[02:06:28] Customer: Okay.
[02:06:34] Customer: Then another question is, how does "Study this deck" work?
[02:06:34] Customer: Does it rely on the scheduler, or does it include all cards?
[02:06:48] nataliamotand: No, it relies on the scheduler.
[02:06:48] nataliamotand: You can study the cards that are due today or forgotten, like this.
[02:06:48] nataliamotand: You can't study the cards that are due later, for example.
[02:07:01] Customer: You can't study?
[02:07:05] nataliamotand: You can't.
[02:07:05] nataliamotand: Right now, the application doesn't allow it, but we can change it in a way that, if the user wants to review that deck specifically, then they should be able to learn all the cards and not rely on the scheduler, if that's what you prefer.
[02:07:23] Customer: Yeah, I think this might be a use case, like they prepare for an exam, learn this deck specifically.
[02:07:32] Customer: One option is through the study queue.
[02:07:32] Customer: They select just this deck and then learn the cards from it, and maybe add more cards to study for today.
[02:07:51] Customer: Another option is to mirror the study queue functionality here, inside the deck.
[02:08:07] Customer: But I think it will not be very good to duplicate the study queue functionality.
[02:08:22] Customer: Okay, let's keep it like this.
[02:08:22] Customer: They study this deck, and if they want to study more cards, they need to go to the Study tab and do something with the study queue.
[02:08:42] Customer: Okay, not sure if it will be the most user-friendly way, but let's keep it like this for now.
[02:08:59] Customer: Okay, what can they do with the cards?
[02:08:59] Customer: They can select cards and remove them, right?
[02:09:05] nataliamotand: Yes, it's the same functionality that we have in Your cards, so all the actions are here.
[02:09:10] Customer: Okay, "new sentence" means that they can regenerate, right?
[02:09:21] nataliamotand: Yes.
[02:09:21] nataliamotand: We reached the time limit.
[02:09:21] nataliamotand: I'm sorry about it.
[02:09:34] nataliamotand: We still have a lot of discussion to do, and we can resume next week.
[02:09:41] nataliamotand: About the action points, I'll do as I always do.
[02:09:41] nataliamotand: I will send you the decisions and the action points in the chat, so you can read and see that everything is according to your expectations.
[02:09:56] nataliamotand: And that's it.
[02:09:56] nataliamotand: I would like to thank you for your time and your availability to be in this meeting.
[02:09:56] nataliamotand: Thanks a lot, and we will be in contact.
[02:10:10] Customer: Yeah, thanks a lot for lots of improvement to the system.
[02:10:10] Customer: Good progress.
[02:10:10] Customer: Yeah, thank you for your effort.
[02:10:10] Customer: Until the next meeting.
[02:10:25] nataliamotand: See you.
[02:10:25] nataliamotand: Have a good weekend.
[02:10:25] nataliamotand: Thank you.
[02:10:25] Customer: You too.
[02:10:25] Customer: Goodbye.
[02:10:25] nataliamotand: Bye.
