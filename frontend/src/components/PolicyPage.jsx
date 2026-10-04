/** Shared layout for the legal/policy pages: title, last-updated date, then headed sections of paragraphs and bullet lists. */
export default function PolicyPage({ title, updated, intro, sections }) {
  return (
    <div className="policy-page">
      <h1>{title}</h1>
      <p className="hint-text">Last updated: {updated}</p>
      {intro && <p>{intro}</p>}
      {sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {(s.paras || []).map((p) => <p key={p}>{p}</p>)}
          {s.list && (
            <ul>
              {s.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
