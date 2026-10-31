# Customer message about the Piper licence (Week 4 action point, issue #157)

This carries out the Week 4 action point "Read the licence of Piper and of the voices we would use,
and tell the Customer whether they allow commercial use" (due 2026-10-30).
The finding is written in [`docs/research/audio-options.md`](../../../docs/research/audio-options.md),
in the "Licence of the voices" part of the Piper section.
The message below is sent to the Customer in the group chat; its sending time is filled in below once it is sent, and the Customer's reply is added here word for word when it arrives.
Times are in UTC+03:00.

## Team message, 2026-10-30 18:07

> Hi [the Customer], a short note from the Week 4 action point on the Piper licence.
> The Piper engine is open source (MIT on the old repository, GPL-3.0 on the active one), and both allow commercial use.
> The voices are a separate matter: each voice carries the licence of the dataset it was trained on, and they differ, so not all allow commercial use.
> For example, the Russian voices `denis` and `dmitri` are CC0 and the German `thorsten` is CC0 (commercial use allowed), while the Russian `ruslan` is CC BY-NC-SA 4.0 and the English `lessac` is a research-only licence (commercial use not allowed), and the Russian `irina` has an unknown licence.
> Question for you: does the product need a voice that allows commercial use, or is non-commercial use enough? Your answer decides which voices we may ship.

## Customer reply

The Customer answered in the group chat.

| Time             | Message                                                |
| ---------------- | ------------------------------------------------------ |
| 2026-10-31 11:30 | "It doesn't need a license that allows commercial use" |

So a voice that allows only non-commercial use is acceptable, and the licence does not rule out any of the voices read above; the choice of voice is decided by quality, not by the licence.
