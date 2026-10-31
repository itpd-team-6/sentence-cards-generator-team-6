# Customer message about the time zone of the study queue (Week 4 action point, issue #156)

This carries out the Week 4 action point "Check how the study queue shows the dates in the time zone of the user, and tell the Customer in the chat what we found" (due 2026-10-30) of the [Week 4 meeting report](../../week-04/meeting-report.md#action-points).
The finding is written in [issue #156](https://github.com/itpd-team-6/sentence-cards-generator-team-6/issues/156).
The message below was sent to the Customer in the group chat, and it is copied word for word from the chat; the Customer's name is replaced by "the Customer".
Times are in UTC+03:00.

## Team message, 2026-10-30 14:35

> Hi [the Customer]! I checked how the study queue handles time zones, as requested in our last meeting.
> Currently, the backend uses the server's local date (`date.today()`) rather than the learner's local date. This means that learners in different time zones may see cards under "Due today" too early or too late around midnight.
> I've documented the finding in #156, and we'll track the fix in a separate issue.

## Customer reply

The Customer answered with a thumbs-up reaction on the message and no written reply.
