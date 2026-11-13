export const LANGUAGES = [
  { code: "ru", name: "Russian" },
  { code: "en", name: "English" },
  { code: "de", name: "German" },
];

// Three languages fit as buttons, so the learner sees them all and picks one with one click.
// Clicking the chosen language again, or pressing Space on it, clears it.
// `taken` is the language chosen in the other picker: the text and the cards need two different languages.
export default function LanguagePicker({
  label,
  name,
  value,
  onChange,
  taken,
}) {
  return (
    <fieldset className="picker">
      <legend className="field-label">{label}</legend>
      <div className="options">
        {LANGUAGES.map((language) => (
          <label className="option" key={language.code}>
            <input
              type="radio"
              name={name}
              value={language.code}
              checked={value === language.code}
              disabled={language.code === taken}
              onChange={() => onChange(language.code)}
              onClick={() => value === language.code && onChange("")}
              onKeyDown={(event) => {
                if (event.key === " " && value === language.code) {
                  event.preventDefault();
                  onChange("");
                }
              }}
            />
            <span>{language.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
