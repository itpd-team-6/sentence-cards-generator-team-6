import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  changeCard,
  changeCardDecks,
  deleteCard,
  deleteCards,
  hideCards,
  newSentence,
  newSentences,
} from "./api.js";
import CardDecksDialog from "./CardDecksDialog.jsx";
import CardEditDialog from "./CardEditDialog.jsx";
import DeckTag from "./DeckTag.jsx";
import Icon, { ICON_PATHS } from "./Icon.jsx";
import Notice, { newNotice } from "./Notice.jsx";
import { hrefOfDeck, hrefOfText } from "./router.js";

// What each icon of a card does. The legend shows these names, and the buttons are named after them for screen readers.
const ACTIONS = [
  { id: "edit", name: "Edit", icon: ICON_PATHS.edit },
  { id: "review", name: "Mark for review", icon: ICON_PATHS.review },
  { id: "hide", name: "Hide", icon: ICON_PATHS.hide },
  { id: "lock", name: "Lock translation", icon: ICON_PATHS.lock },
  { id: "new", name: "New sentence", icon: ICON_PATHS.new },
  { id: "delete", name: "Delete", icon: ICON_PATHS.delete },
];

// The lock of a translation that is not locked: the shackle is open.
const OPEN_LOCK = ICON_PATHS.openLock;

const iconOf = (id) => ACTIONS.find((action) => action.id === id).icon;

// "Working on 2 cards" with one, two and three dots in turn, until the answer comes. A learner who asked for less motion
// sees the three dots still. The dots are hidden from screen readers, which read "Working on 2 cards".
function Working({ count }) {
  const still = useMemo(
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    [],
  );
  const [dots, setDots] = useState(0);
  useEffect(() => {
    if (still) return undefined;
    const timer = setInterval(
      () => setDots((current) => (current + 1) % 4),
      400,
    );
    return () => clearInterval(timer);
  }, [still]);
  return (
    <>
      {`Working on ${count} ${count === 1 ? "card" : "cards"}`}
      <span className="dots" aria-hidden="true">
        {".".repeat(still ? 3 : dots)}
      </span>
    </>
  );
}

// How many decks a card is in: a deck icon and the number, with the names of the decks when the pointer rests on it. The
// words are said to a screen reader. The place is kept when the card is in no deck, so the numbers stay in one column.
function DeckCount({ card }) {
  const all = card.decks ?? [];
  if (all.length === 0) return <span className="deck-count" />;
  return (
    <span
      className="deck-count"
      title={all.map((deck) => deck.title).join(", ")}
    >
      <Icon path={ICON_PATHS.stack} />
      {all.length}
      <span className="visually-hidden">
        {" "}
        {all.length === 1 ? "deck" : "decks"}
      </span>
    </span>
  );
}

// Where a card comes from: the text it was made from, which opens that text, with how many more texts have the word, and
// only the decks the learner ticked that the card is in (FR-020). The place is kept when there is nothing to show, so
// the texts stay in one column.
function Origins({ card, tickedDecks }) {
  const first = card.texts?.[0];
  const decks = (card.decks ?? []).filter((deck) => tickedDecks.has(deck.id));
  const more = (card.texts?.length ?? 0) - 1;
  return (
    <span className="origins">
      {first && (
        <a
          className="text-label"
          href={hrefOfText(first.id)}
          title={first.title}
        >
          {first.title}
        </a>
      )}
      {more > 0 && <span className="more-texts">+{more}</span>}
      {decks.map((deck) => (
        <DeckTag key={deck.id} deck={deck} />
      ))}
    </span>
  );
}

// The cards of all the texts, as a table the learner reviews: edit a sentence, mark it for review, hide it from study,
// ask for a new sentence or delete the card. Each action is an icon, and a legend in the top right corner of the box,
// which stays in view while the table scrolls, says what the icons do. A box in the first column selects cards, and the
// box in its header selects all the cards or none. While cards are selected, a bar under the table, in view at the bottom
// of the window, acts on them: a new sentence for each, hide them from study or show them again, or delete them after
// the learner confirms. Without a selection the bar is not there, and the table does not move when it appears.
//
// With `groups`, the cards are listed in groups, each under its title and its number of cards, and a card that is in two
// groups shows in both. `toolbar` is what goes under the title, such as the search and the filters. With `showTexts`, a card shows the text it
// came from, which opens that text, and the decks the learner ticked that it is in. `emptyMessage` is said when there are
// no cards to list.
export default function CardsTable({
  cards,
  onCardsChange,
  title = "Your cards",
  toolbar = null,
  showTexts = false,
  tickedDecks = new Set(),
  emptyMessage = "No cards left.",
  decks = [],
  onDecksChange = () => {},
  groups = null,
}) {
  const [editingId, setEditingId] = useState(null); // the id of the card being edited
  const [editError, setEditError] = useState(""); // the problem with what the learner wrote in the editor
  const [busy, setBusy] = useState(null); // { id, what } while the product answers; every button waits
  const [notes, setNotes] = useState({}); // card id -> the message about that card, or null when it went away
  const [ticked, setTicked] = useState(new Set()); // ids of the cards selected for an action on several cards
  const [confirming, setConfirming] = useState(false); // asking whether to delete the selected cards
  const [batchNotice, setBatchNotice] = useState(null); // the problem with an action on several cards
  const [changingDecks, setChangingDecks] = useState(false); // the box for the decks of the selected cards is open
  const [decksError, setDecksError] = useState(""); // the problem with the decks the learner chose
  const [opened, setOpened] = useState(new Set()); // ids of the cards whose line is open
  const [folded, setFolded] = useState(new Set()); // keys of the groups the learner closed
  const deleteDialog = useRef(null);
  const anchor = useRef(null); // where the control the learner clicked was, before the list changed its height
  const spacer = useRef(null);

  // Closing a group or a line makes the page shorter, and the browser then moves the page. The control the learner clicked
  // is kept where it was: the page is given the height it lost, until the list changes in another way, and the scroll is
  // put back (the learner does not like the page to move).
  const keepPlace = (control, change) => {
    anchor.current = {
      top: control.getBoundingClientRect().top,
      height: document.documentElement.scrollHeight,
      scroll: window.scrollY,
    };
    change();
  };
  useLayoutEffect(() => {
    const before = anchor.current;
    anchor.current = null;
    if (!before || !spacer.current) return;
    const lost = before.height - document.documentElement.scrollHeight;
    const current = parseFloat(spacer.current.style.height) || 0;
    if (lost === 0) return;
    spacer.current.style.height = `${Math.max(0, current + lost)}px`;
    window.scrollTo(0, before.scroll);
  });
  useEffect(() => {
    if (spacer.current) spacer.current.style.height = "0px";
  }, [cards, groups]);

  const setNote = (id, message) =>
    setNotes((current) => ({
      ...current,
      [id]: message ? newNotice(message) : null,
    }));
  const replace = (card) =>
    onCardsChange(cards.map((item) => (item.id === card.id ? card : item)));
  const working = (card, what) => busy?.id === card.id && busy.what === what;

  // Runs one action on a card. A failure leaves the card as it was and shows the message under it.
  async function act(card, what, work) {
    setBusy({ id: card.id, what });
    setNote(card.id, "");
    try {
      await work();
    } catch (error) {
      setNote(card.id, error.message);
    } finally {
      setBusy(null);
    }
  }

  const toggleFlag = (card) =>
    act(card, "flag", async () =>
      replace(await changeCard(card.id, { flagged: !card.flagged })),
    );

  // A locked translation is not changed by the product, whatever happens to the sentence (DEC-014).
  const toggleLock = (card) =>
    act(card, "lock", async () =>
      replace(
        await changeCard(card.id, {
          translation_locked: !card.translation_locked,
        }),
      ),
    );

  const toggleHidden = (card) =>
    act(card, "hide", async () =>
      replace(await changeCard(card.id, { hidden: !card.hidden })),
    );

  const untick = (ids) =>
    setTicked(
      (current) => new Set([...current].filter((id) => !ids.includes(id))),
    );

  const toggleTick = (card) =>
    setTicked((current) => {
      const next = new Set(current);
      if (!next.delete(card.id)) next.add(card.id);
      return next;
    });

  const allTicked =
    cards.length > 0 && cards.every((card) => ticked.has(card.id));
  const chosen = cards.filter((card) => ticked.has(card.id));
  const asking = confirming && chosen.length > 0; // the question "delete these cards?" is on the screen

  // The question is a modal box: the rest of the page waits until the learner answers it.
  useEffect(() => {
    const dialog = deleteDialog.current;
    if (!dialog) return;
    if (asking && !dialog.open) dialog.showModal();
    if (!asking && dialog.open) dialog.close();
  }, [asking, cards.length]);

  // The editor closes when the card goes away, for instance after it was deleted.
  const editedCard = editingId && cards.find((card) => card.id === editingId);

  // Runs an action on the selected cards. Every button waits, as for one card; `what` says which action is running.
  async function actOnChosen(what, work) {
    setBusy({ id: 0, what });
    setBatchNotice(null);
    try {
      await work();
    } catch (error) {
      setBatchNotice(newNotice(error.message));
    } finally {
      setBusy(null);
    }
  }

  const askForNewSentences = () =>
    actOnChosen("sentences", async () => {
      const ids = chosen.map((card) => card.id);
      const answered = await newSentences(ids);
      onCardsChange(
        cards.map(
          (card) => answered.find((item) => item.id === card.id) ?? card,
        ),
      );
      setEditingId(null);
      // One message for all the cards, with the reason the model gave for the first one, not one message for each.
      const failed = answered.filter((item) => item.error);
      if (failed.length) {
        setBatchNotice(
          newNotice(
            `${failed.length} of ${ids.length} cards kept their sentence. ${failed[0].error}`,
          ),
        );
      }
    });

  const hideChosen = (hidden) =>
    actOnChosen("hide", async () => {
      const answered = await hideCards(
        chosen.map((card) => card.id),
        hidden,
      );
      onCardsChange(
        cards.map(
          (card) => answered.find((item) => item.id === card.id) ?? card,
        ),
      );
    });

  // Puts the selected cards in some decks and takes them out of others. A failure leaves the box open with the reason.
  async function saveDecks(add, remove) {
    setBusy({ id: 0, what: "decks" });
    setDecksError("");
    try {
      const answered = await changeCardDecks(
        chosen.map((card) => card.id),
        add,
        remove,
      );
      onCardsChange(
        cards.map(
          (card) => answered.find((item) => item.id === card.id) ?? card,
        ),
      );
      setChangingDecks(false);
      onDecksChange();
    } catch (error) {
      setDecksError(error.message);
    } finally {
      setBusy(null);
    }
  }

  async function deleteChosen() {
    await actOnChosen("delete", async () => {
      const ids = chosen.map((card) => card.id);
      await deleteCards(ids);
      onCardsChange(cards.filter((card) => !ids.includes(card.id)));
      untick(ids);
      setEditingId(null);
    });
    setConfirming(false);
  }

  const askForNewSentence = (card) =>
    act(card, "new", async () => {
      replace(await newSentence(card.id));
      setEditingId(null);
    });

  const remove = (card) =>
    act(card, "delete", async () => {
      await deleteCard(card.id);
      onCardsChange(cards.filter((item) => item.id !== card.id));
      untick([card.id]);
      setEditingId(null);
    });

  const startEditing = (card) => {
    setEditError("");
    setEditingId(card.id);
  };

  // Saves what the editor sends: only the fields that changed. A failure leaves the editor open with the reason.
  async function save(card, fields) {
    setBusy({ id: card.id, what: "save" });
    setEditError("");
    try {
      replace(await changeCard(card.id, fields));
      setEditingId(null);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setBusy(null);
    }
  }

  if (cards.length === 0) {
    return (
      <>
        {showTexts ? (
          <h2 className="visually-hidden">{title}</h2>
        ) : (
          <div className="cards-header">
            <h2>{title}</h2>
          </div>
        )}
        {toolbar}
        <p className="hint">{emptyMessage}</p>
      </>
    );
  }

  // One entry for each row of the list: the title of a group, or a card with the group it is listed in.
  const rows = groups
    ? groups.flatMap((head) => [
        { head },
        ...head.cards.map((card) => ({ card, group: head.key })),
      ])
    : cards.map((card) => ({ card }));

  const toggleOpen = (id, control) =>
    keepPlace(control, () =>
      setOpened((current) => {
        const next = new Set(current);
        if (!next.delete(id)) next.add(id);
        return next;
      }),
    );

  const toggleFold = (key, control) =>
    keepPlace(control, () =>
      setFolded((current) => {
        const next = new Set(current);
        if (!next.delete(key)) next.add(key);
        return next;
      }),
    );

  // The lock of a translation: the shackle is open until the learner locks it.
  const lockButton = (card) => (
    <button
      type="button"
      className="secondary icon lock"
      disabled={busy || !card.translation}
      title={
        card.translation_locked
          ? "Unlock the translation"
          : "Lock the translation"
      }
      aria-label={
        card.translation_locked
          ? `Unlock the translation of ${card.word}`
          : `Lock the translation of ${card.word}`
      }
      aria-pressed={card.translation_locked}
      onClick={() => toggleLock(card)}
    >
      <Icon path={card.translation_locked ? iconOf("lock") : OPEN_LOCK} />
    </button>
  );

  const translationLine = (card) => (
    <span className="translation-line">
      <span>
        {card.translation ?? <span className="empty">No translation yet.</span>}
      </span>
      {lockButton(card)}
    </span>
  );

  // The buttons of a card. In the list they have their names next to the icons, so the name of the button is what it says.
  const actionButtons = (card, regenerating, labelled) => (
    <>
      <button
        type="button"
        className="secondary icon"
        disabled={busy}
        title="Edit"
        aria-label={labelled ? undefined : `Edit ${card.word}`}
        onClick={() => startEditing(card)}
      >
        <Icon path={iconOf("edit")} />
        {labelled && "Edit"}
      </button>
      <button
        type="button"
        className="secondary icon"
        disabled={busy}
        title="Mark for review"
        aria-label={labelled ? undefined : `Mark ${card.word} for review`}
        aria-pressed={card.flagged}
        onClick={() => toggleFlag(card)}
      >
        <Icon path={iconOf("review")} filled={card.flagged} />
        {labelled && "Mark for review"}
      </button>
      <button
        type="button"
        className="secondary icon"
        disabled={busy}
        title={card.hidden ? "Show in study" : "Hide from study"}
        aria-label={
          labelled
            ? undefined
            : card.hidden
              ? `Show ${card.word} in study`
              : `Hide ${card.word} from study`
        }
        aria-pressed={card.hidden}
        onClick={() => toggleHidden(card)}
      >
        <Icon path={iconOf("hide")} filled={card.hidden} />
        {labelled && (card.hidden ? "Show in study" : "Hide from study")}
      </button>
      <button
        type="button"
        className="secondary icon"
        disabled={busy}
        title="New sentence"
        aria-label={
          labelled
            ? undefined
            : regenerating
              ? `Asking for a new sentence for ${card.word}`
              : `New sentence for ${card.word}`
        }
        aria-busy={regenerating}
        onClick={() => askForNewSentence(card)}
      >
        <Icon path={iconOf("new")} spinning={regenerating} />
        {labelled && "New sentence"}
      </button>
      <button
        type="button"
        className="secondary icon"
        disabled={busy}
        title="Delete"
        aria-label={labelled ? undefined : `Delete ${card.word}`}
        onClick={() => remove(card)}
      >
        <Icon path={iconOf("delete")} />
        {labelled && "Delete"}
      </button>
    </>
  );

  const isRegenerating = (card) =>
    working(card, "new") || (busy?.what === "sentences" && ticked.has(card.id));

  // "Your cards": one compact line for each card, with its word, its sentence, the text it came from and its state. A click
  // on the line opens it, and then it shows the translation, with its lock, and the buttons that change the card.
  // Only the keys of the groups on the screen count: the ones left from another way of grouping are not here.
  const foldedHere = groups
    ? groups.filter((head) => folded.has(head.key)).length
    : 0;

  const list = (
    <>
      <div className="list-head">
        <input
          type="checkbox"
          className="queue-check"
          id="select-all-cards"
          checked={allTicked}
          ref={(box) =>
            box && (box.indeterminate = chosen.length > 0 && !allTicked)
          }
          disabled={busy}
          onChange={() =>
            setTicked(
              allTicked ? new Set() : new Set(cards.map((card) => card.id)),
            )
          }
        />
        <label htmlFor="select-all-cards">Select all cards</label>
        {groups && (
          <span className="fold-all">
            <button
              type="button"
              onClick={(event) =>
                keepPlace(event.currentTarget, () => setFolded(new Set()))
              }
              disabled={foldedHere === 0}
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={(event) =>
                keepPlace(event.currentTarget, () =>
                  setFolded(new Set(groups.map((head) => head.key))),
                )
              }
              disabled={foldedHere === groups.length}
            >
              Collapse all
            </button>
          </span>
        )}
      </div>
      <ul className="card-list" aria-label={title}>
        {rows.map(({ head, card, group }) => {
          if (head) {
            const isFolded = folded.has(head.key);
            return (
              <li key={head.key} className="group-head">
                <button
                  type="button"
                  aria-expanded={!isFolded}
                  onClick={(event) => toggleFold(head.key, event.currentTarget)}
                >
                  <Icon path={ICON_PATHS.chevron} />
                  <span className="group-title-text">{head.title}</span>
                  <span className="group-count">{head.cards.length}</span>
                </button>
              </li>
            );
          }
          if (group && folded.has(group)) return null;
          const key = group ? `${group}-${card.id}` : String(card.id);
          const isOpen = opened.has(card.id);
          const detail = `card-detail-${key}`;
          const classes = [
            "card-row",
            card.flagged && "flagged",
            card.hidden && "hidden-card",
            isOpen && "open",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={key} className={classes}>
              <div className="card-line">
                <input
                  type="checkbox"
                  className="queue-check"
                  aria-label={`Select ${card.word}`}
                  checked={ticked.has(card.id)}
                  onChange={() => toggleTick(card)}
                />
                <button
                  type="button"
                  className="card-main"
                  aria-expanded={isOpen}
                  aria-controls={isOpen ? detail : undefined}
                  onClick={(event) => toggleOpen(card.id, event.currentTarget)}
                >
                  <span className="card-word">{card.word}</span>
                  <span className="card-sentence">
                    {card.sentence ?? (
                      <span className="empty">No sentence yet.</span>
                    )}
                  </span>
                </button>
                <DeckCount card={card} />
                <Origins card={card} tickedDecks={tickedDecks} />
                <span className="card-status">
                  {card.flagged && (
                    <button
                      type="button"
                      className="status-button"
                      disabled={busy}
                      title="Marked for review. Click to unmark"
                      aria-label={`Unmark ${card.word} for review`}
                      onClick={() => toggleFlag(card)}
                    >
                      <Icon path={iconOf("review")} filled />
                    </button>
                  )}
                  {card.hidden && (
                    <button
                      type="button"
                      className="status-button"
                      disabled={busy}
                      title="Hidden from study. Click to show it again"
                      aria-label={`Show ${card.word} in study`}
                      onClick={() => toggleHidden(card)}
                    >
                      <Icon path={iconOf("hide")} />
                    </button>
                  )}
                </span>
                <button
                  type="button"
                  className="card-chevron"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={(event) => toggleOpen(card.id, event.currentTarget)}
                >
                  <Icon path={ICON_PATHS.chevron} />
                </button>
              </div>
              {isOpen && (
                <div className="card-detail" id={detail}>
                  {card.decks?.length > 0 && (
                    <p className="detail-decks">
                      <span>{card.decks.length === 1 ? "Deck" : "Decks"}</span>
                      {card.decks.map((deck) => (
                        <a key={deck.id} href={hrefOfDeck(deck.id)}>
                          {deck.title}
                        </a>
                      ))}
                    </p>
                  )}
                  {translationLine(card)}
                  <div className="detail-actions">
                    {actionButtons(card, isRegenerating(card), true)}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div ref={spacer} aria-hidden="true" />
    </>
  );

  return (
    <>
      {showTexts ? (
        <h2 className="visually-hidden">{title}</h2>
      ) : (
        <div className="cards-header">
          <h2>{title}</h2>
          <ul className="legend" aria-label="What the icons do">
            {ACTIONS.map((action) => (
              <li key={action.id}>
                <Icon path={action.icon} /> {action.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {toolbar}
      {batchNotice && (
        <Notice notice={batchNotice} onDismiss={() => setBatchNotice(null)} />
      )}
      {cards.map((card) => {
        const note = notes[card.id];
        // The message is away from the row, so it names the word it is about.
        return (
          note && (
            <Notice
              key={card.id}
              notice={{ ...note, text: `${card.word}: ${note.text}` }}
              onDismiss={() => setNote(card.id, "")}
            />
          )
        );
      })}
      <dialog
        ref={deleteDialog}
        className="modal"
        aria-labelledby="delete-title"
        onClose={() => setConfirming(false)}
        onClick={(event) =>
          event.target === event.currentTarget && !busy && setConfirming(false)
        }
      >
        <h3 id="delete-title">
          Delete {chosen.length} {chosen.length === 1 ? "card" : "cards"}?
        </h3>
        <p>This cannot be undone.</p>
        <div className="modal-actions">
          <button
            type="button"
            className="secondary"
            autoFocus
            disabled={busy}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary"
            disabled={busy}
            onClick={deleteChosen}
          >
            {busy?.what === "delete"
              ? "Deleting..."
              : `Delete ${chosen.length}`}
          </button>
        </div>
      </dialog>
      {changingDecks && chosen.length > 0 && (
        <CardDecksDialog
          cards={chosen}
          decks={decks}
          saving={busy?.what === "decks"}
          error={decksError}
          onSave={saveDecks}
          onCancel={() => setChangingDecks(false)}
        />
      )}
      {editedCard && (
        <CardEditDialog
          key={editedCard.id}
          card={editedCard}
          saving={working(editedCard, "save")}
          error={editError}
          onSave={(fields) => save(editedCard, fields)}
          onCancel={() => setEditingId(null)}
        />
      )}
      {showTexts ? (
        list
      ) : (
        <div
          className="cards-scroll"
          tabIndex={0}
          role="region"
          aria-label={title}
        >
          <table className="cards">
            <colgroup>
              <col className="col-select" />
              <col className="col-word" />
              <col />
              <col />
              <col className="col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="select-cell">
                  <input
                    type="checkbox"
                    className="queue-check"
                    aria-label="Select all cards"
                    checked={allTicked}
                    ref={(box) =>
                      box &&
                      (box.indeterminate = chosen.length > 0 && !allTicked)
                    }
                    disabled={busy}
                    onChange={() =>
                      setTicked(
                        allTicked
                          ? new Set()
                          : new Set(cards.map((card) => card.id)),
                      )
                    }
                  />
                </th>
                <th scope="col">Word</th>
                <th scope="col">Sentence</th>
                <th scope="col">Translation</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            {rows.map(({ head, card, group }) => {
              if (head) {
                return (
                  <tbody key={head.key} className="group-head">
                    <tr>
                      <th colSpan={5} scope="colgroup">
                        {head.title}
                        <span className="group-count">{head.cards.length}</span>
                      </th>
                    </tr>
                  </tbody>
                );
              }
              return (
                <tbody
                  key={group ? `${group}-${card.id}` : card.id}
                  className={
                    [card.flagged && "flagged", card.hidden && "hidden-card"]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                >
                  <tr>
                    <td className="select-cell">
                      <input
                        type="checkbox"
                        className="queue-check"
                        aria-label={`Select ${card.word}`}
                        checked={ticked.has(card.id)}
                        onChange={() => toggleTick(card)}
                      />
                    </td>
                    <th scope="row">
                      {card.word}
                      {card.flagged && (
                        <span className="badge">Marked for review</span>
                      )}
                      {card.hidden && (
                        <span className="badge hidden-badge">
                          Hidden from study
                        </span>
                      )}
                    </th>
                    <td data-label="Sentence">
                      {card.sentence ?? (
                        <span className="empty">No sentence yet.</span>
                      )}
                    </td>
                    <td data-label="Translation">{translationLine(card)}</td>
                    <td>
                      <div className="row-actions">
                        {actionButtons(card, isRegenerating(card), false)}
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      )}
      {chosen.length > 0 && (
        <div
          className="bulk-bar"
          role="toolbar"
          aria-label="Select cards and act on the selected ones"
        >
          <div className="bulk-group">
            <span className="bulk-count" aria-live="polite">
              {chosen.length} selected of {cards.length} shown
            </span>
            <button
              type="button"
              className="queue-pill"
              disabled={busy || allTicked}
              onClick={() => setTicked(new Set(cards.map((card) => card.id)))}
            >
              Select all
            </button>
            <button
              type="button"
              className="queue-pill"
              disabled={busy || chosen.length === 0}
              onClick={() => setTicked(new Set())}
            >
              Clear selection
            </button>
          </div>
          <div className="bulk-group">
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={askForNewSentences}
            >
              {busy?.what === "sentences" ? (
                <Working count={chosen.length} />
              ) : (
                "New sentences"
              )}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => hideChosen(true)}
            >
              Hide
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => hideChosen(false)}
            >
              Show
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => {
                setDecksError("");
                setChangingDecks(true);
              }}
            >
              Decks
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy || chosen.length === 0}
              onClick={() => setConfirming(true)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </>
  );
}
