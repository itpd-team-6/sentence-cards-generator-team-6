// The time a card takes is not measured: every card counts as 30 seconds, and the estimate is always shown as "about"
// (DEC-066).
export const SECONDS_PER_CARD = 30;

// "about 1 min" for one card, "about 2 min" for three; a part of a minute counts as a whole one.
export function estimate(cardCount) {
  const minutes = Math.ceil((cardCount * SECONDS_PER_CARD) / 60);
  return `about ${minutes} min`;
}

// A greeting for the hour of the day (0 to 23).
export function greeting(hour) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}
