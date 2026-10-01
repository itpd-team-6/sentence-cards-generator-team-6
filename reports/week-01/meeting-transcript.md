# Kickoff meeting transcript

**Date:** 2026-09-30
**Participants:** nataliamotand, AbdelrahmanAbdel-Aal, Customer

The recording starts during the Customer's answer to question 1 of the [meeting script](meeting-script.md).
The opening, the three permission questions, our presentation of the problem and question 1 itself were not recorded.
The transcript was produced with an AI transcription tool from the recording and checked by the team (see [ai-usage.md](ai-usage.md)).
Each line carries the start time of the turn it belongs to.

[00:00:00] Customer: I want to use some text to learn some words earlier in the deck than others.

[00:00:00] Customer: And I also want to make it open source, so that others can contribute code or use it in their own language setting.

[00:00:00] Customer: Yeah, that's basically it.

[00:00:36] nataliamotand: Okay.

[00:00:36] nataliamotand: The next question is that I imagine you used the deck while studying.

[00:00:36] nataliamotand: When you did, what was different in using the deck that you built with songs2anki, compared to the way you used to learn words before?

[00:01:00] Customer: Before that, I found a couple of decks on AnkiWeb, a site where decks are published by many people using Anki.

[00:01:00] Customer: That deck contained just words.

[00:01:00] Customer: One side of the flashcard was a word in German, and the other one was a translation.

[00:01:00] Customer: Although it was okay at the beginning, studying separate words, later I realized that I want to learn how to speak German, not just learn separate words.

[00:01:00] Customer: I wanted to learn how to construct sentences.

[00:01:00] Customer: Therefore, I switched my approach to learning whole sentences.

[00:01:00] Customer: I needed to find short sentences somewhere.

[00:01:00] Customer: There was a site called Tatoeba, where people create sentences in multiple languages and map sentences to their translations in different languages.

[00:01:00] Customer: I checked the sentences and noticed that some of them were too long.

[00:01:00] Customer: And I couldn't find a way to find sentences that contained exactly the words that I wanted to learn.

[00:01:00] Customer: So I decided to make lists of words and compose sentences for them.

[00:01:00] Customer: The first attempt was using a frequency list of words, because I wanted to learn the most commonly used words.

[00:01:00] Customer: However, I noticed that in that generic frequency list, some of the words that I wanted were missing completely.

[00:01:00] Customer: So I thought I wouldn't be able to learn all the words that I want, even if I covered the whole list.

[00:01:00] Customer: So I switched to a more customized approach.

[00:01:00] Customer: I thought about the content in German that I enjoyed, and I listened to many songs in German.

[00:01:00] Customer: I decided that I want to understand the songs better, and to do that, I need to understand each word.

[00:01:00] Customer: So I found all the texts for the songs, marked the words that I knew, and started learning the remaining words that I didn't know.

[00:01:00] Customer: That's how songs2anki appeared.

[00:04:12] nataliamotand: Okay, thanks for the answer, it's very complete.

[00:04:12] nataliamotand: Moving forward, besides you, has anyone else used songs2anki or a deck made with it?

[00:04:12] nataliamotand: And if the answer is yes, who were they and how did it go in their experience?

[00:04:34] Customer: I'm not aware of anyone using exactly songs2anki.

[00:04:34] Customer: But I know some people used an earlier version of the deck, which is based on the frequency list of words.

[00:04:34] Customer: It's available on AnkiWeb, and it has a couple of hundred downloads.

[00:04:34] Customer: I can't say whether people used the deck to learn German [inaudible].

[00:05:19] nataliamotand: The catalog mentions both learners and teachers.

[00:05:19] nataliamotand: In your experience, what do you think a teacher should be able to do with the student's vocabulary cards?

[00:05:38] Customer: The teacher should be able to edit both the sentence in the target language that the student learns and the sentence in the language that the student knows.

[00:05:38] Customer: Language models may produce pretty good sentences.

[00:05:38] Customer: However, some of them may sound unnatural, be totally wrong, or state wrong facts.

[00:05:38] Customer: So the teacher's task is to edit sentences and their translations, so that the student learns the correct mapping between languages.

[00:06:38] nataliamotand: Okay, thanks for the answer.

[00:06:38] nataliamotand: About the workflow, could you walk us through the last time that you added new words to your deck?

[00:06:38] nataliamotand: What did you do step by step, and which step took the most time?

[00:07:08] Customer: The last time I added new words was last year, when I was composing the deck.

[00:07:08] Customer: The exact procedure is described in the songs2anki README.

[00:07:08] Customer: If I need to add a new text, a new set of words to my deck, I find the text I want to take words from and add it to the YAML file with all song texts.

[00:07:08] Customer: The script extracts the lemmas from all of those words and presents them as a list.

[00:07:08] Customer: Then I mark the words that I know and exclude them from the list.

[00:07:08] Customer: Then the script finds the missing parts of the words.

[00:07:08] Customer: When you have a lemma, the initial form of a word, the script finds the matching article: whether the word is masculine, neuter, or feminine.

[00:07:08] Customer: Or it turns a lemma into a singular form.

[00:07:08] Customer: After that, it adds those words to another list, a CSV file where each word has a corresponding sentence in the target language and in the known language, and so on.

[00:07:08] Customer: Then the script iterates: it calls the language model to produce new cards and filters them.

[00:07:08] Customer: So there are two main points where I need to step into the work of the script.

[00:07:08] Customer: First, I need to mark the words that I know and which I don't know.

[00:07:08] Customer: Second, I have to run the steps of the script one by one.

[00:07:08] Customer: I can't just let the script go from end to end.

[00:07:08] Customer: Both of those parts take quite a long time, and they could be optimized using an app.

[00:10:31] nataliamotand: Okay.

[00:10:31] nataliamotand: I took a look at the songs2anki repository, and I couldn't find how you produced the audio for the demo deck in the scripts.

[00:10:31] nataliamotand: Maybe you did it in parallel and imported it into Anki.

[00:10:31] nataliamotand: How does the audio pipeline work?

[00:10:59] Customer: First, I composed the deck, and it was text only.

[00:10:59] Customer: Then I imported it into Anki.

[00:10:59] Customer: Then I ran the HyperTTS add-on for the Anki desktop version, and it produced the audio in the target language and the known language.

[00:10:59] Customer: In HyperTTS, you can select which provider to use for producing the audio.

[00:10:59] Customer: I used Google TTS because it was free.

[00:10:59] Customer: On GitHub, there are some modifications of HyperTTS that enable other providers, like Microsoft Edge.

[00:12:05] nataliamotand: Okay.

[00:12:05] nataliamotand: The README also says that `deck.csv` has some words without cards, and when I looked, it was about 1,500 out of 4,700.

[00:12:05] nataliamotand: I brought an example, found with AI assistance: "die Krone".

[00:12:05] nataliamotand: It's there with no sentence.

[00:12:05] nataliamotand: And yet, when we sent it to ChatGPT with your prompt, it got a valid sentence on the first try.

[00:12:05] nataliamotand: I didn't run the scripts because I don't have a Linux machine.

[00:12:05] nataliamotand: But I did simulate the workflow of songs2anki with Gemini [sic: the simulation used ChatGPT], and it gave valid sentences for the same words on the first try.

[00:12:05] nataliamotand: So why didn't these specific words get a sentence in songs2anki, and was that a problem for your learning?

[00:12:05] nataliamotand: Did you understand the question? I can repeat it.

[00:13:30] Customer: Maybe I understood.

[00:13:30] Customer: I'm going to reiterate my initial goal.

[00:13:30] Customer: My goal was to learn unknown words from songs, preferably as fast as possible.

[00:13:30] Customer: I started this project in 2024.

[00:13:30] Customer: At that time, I couldn't make a model produce sentences that covered several of those words at once.

[00:13:30] Customer: It could make a sentence for one word, but it couldn't produce a sentence that covers, say, three of the words that I wanted to learn.

[00:13:30] Customer: Therefore, I focused on this approach: for one word, I produced a sentence that contains that word, so that I learn that word in context.

[00:13:30] Customer: Regarding your question, I would like you to repeat it if I haven't answered it yet.

[00:15:03] nataliamotand: Moving forward, about Anki specifically.

[00:15:03] nataliamotand: When you reviewed your cards, what annoyed you most about them?

[00:15:03] nataliamotand: Do you remember a specific card, or something you'd like to improve?

[00:15:23] Customer: Excuse me, did I answer your previous question?

[00:15:37] nataliamotand: Yes, you did.

[00:15:42] Customer: Okay.

[00:15:42] Customer: Could you repeat your next question?

[00:15:54] nataliamotand: When you were using Anki and reviewed your cards, was there something that annoyed you most about them, that you would want to change in the project we are developing?

[00:16:13] Customer: The most annoying part was that I had to look at the CSV in VS Code.

[00:16:13] Customer: It was very inconvenient.

[00:16:13] Customer: I would prefer a nice-looking table on a website.

[00:16:13] Customer: Also, removing bad sentences that should be regenerated was quite annoying.

[00:16:13] Customer: I had to paste some characters, search for the lines that contained those characters, and then remove those lines from the CSV.

[00:16:13] Customer: It was pretty inconvenient.

[00:16:13] Customer: I would like to have buttons to flag sentences that I don't like, to remove them quickly, or to mark them for regeneration.

[00:17:19] nataliamotand: Okay.

[00:17:19] nataliamotand: songs2anki uses a paid OpenAI model.

[00:17:19] nataliamotand: For this project, is it fine to depend on a paid AI service, or should the product only work with free models?

[00:17:50] Customer: If you can find a decent free model, then it's fine that you use it.

[00:17:50] Customer: Otherwise, I can provide an API key for a cheap model, like [inaudible] Flash, for example, or something else.

[00:18:16] nataliamotand: Sure, thanks for the clarification.

[00:18:16] nataliamotand: About the scope: if by the end of the course the product could do only one thing really well, what would it be?

[00:18:16] nataliamotand: This is for us to identify the most important part of the project for you.

[00:18:58] Customer: For a student, I guess it would be the sentences editor, the cards editor.

[00:18:58] Customer: Where you can choose the sentences that you want to learn or don't want to learn, rearrange them, et cetera.

[00:18:58] Customer: After you have everything in place, it's easy to export them to a CSV.

[00:18:58] Customer: So yeah, the editor seems to be the most important part.

[00:19:46] nataliamotand: The catalog also lists teacher review, re-prioritizing words, and three interface languages: English, German, and Russian.

[00:19:46] nataliamotand: If one of them had to wait until after the course, which one would you drop first?

[00:19:46] nataliamotand: If you want, I can repeat the three options.

[00:20:18] Customer: Which one would I drop first?

[00:20:18] Customer: What are the three options?

[00:20:31] nataliamotand: The three options are teacher review, re-prioritizing words, and the three interface languages.

[00:20:31] nataliamotand: If you had to choose one of them not to prioritize, which one would it be?

[00:20:54] Customer: Teacher review, re-prioritizing.

[00:20:54] Customer: The most important feature would be re-prioritizing.

[00:21:12] nataliamotand: Okay, thanks.

[00:21:12] nataliamotand: The catalog describes the problem as updating an Anki collection, saying that updating the cards by hand is tedious.

[00:21:12] nataliamotand: Should the product add the cards to the learner's existing Anki collection, or can the review happen only inside our app?

[00:21:50] Customer: The review should happen inside your app.

[00:21:50] Customer: Support for importing from Anki would be a nice-to-have feature, but it is not required.

[00:22:07] nataliamotand: Okay, that was it for our questions.

[00:22:07] nataliamotand: The assignment also mentions key improvements: questions that we prepared and then rewrote to follow the Mom Test.

[00:22:07] nataliamotand: Should we go through these questions with you here in the meeting, or is it something that we only put in our repository for the assignment?

[00:22:51] Customer: It's only for the assignment; you don't need to discuss it with me.

[00:22:51] Customer: It should have been done earlier, before the meeting, when you prepare the questions for the meeting.

[00:23:12] nataliamotand: Okay, so I believe that's it.

[00:23:12] nataliamotand: If you have any more information you'd like to add, or something you would like us to know, feel free to use this time to tell us.

[00:23:12] nataliamotand: I'd also like to apologize for the technical troubles with Google Meet and for going past the timebox that we had agreed on.

[00:23:12] nataliamotand: I'll do my best so that it doesn't happen again.

[00:23:12] nataliamotand: Thanks for the time.

[00:24:09] Customer: I don't think I have anything to discuss yet.

[00:24:09] Customer: Thanks a lot for organizing this meeting in advance.

[00:24:09] Customer: The technical problems were on my side too.

[00:24:09] Customer: I suggest that we use this platform, Kontur Talk, for the next meetings, if it's convenient.

[00:24:38] nataliamotand: AbdelrahmanAbdel-Aal, would you like to add something, or should we close the meeting?

[00:24:45] AbdelrahmanAbdel-Aal: No, I just want to thank the Customer for the time and for answering our questions.

[00:24:45] AbdelrahmanAbdel-Aal: Thanks so much.

[00:24:54] nataliamotand: Thank you, we'll be in touch.

[00:24:57] Customer: Thank you.

[00:24:57] Customer: By the way, we have distributed the remaining two students, and one of them should join your team.

[00:25:09] nataliamotand: I texted him, and he's getting to know the project.

[00:25:09] nataliamotand: He already knows that he's in our group; he couldn't attend the meeting today, but he'll attend the next ones.

[00:25:09] nataliamotand: I've also added him to the repository on GitHub and will update him on the progress so far.

[00:25:09] nataliamotand: I guess that's it, we'll see you on Friday in class.

[00:25:09] nataliamotand: Thank you for the time.

[00:25:52] Customer: Thank you, bye.
