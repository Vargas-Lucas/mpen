export function PageHeader({
  title,
  lede,
  compact = false,
}: {
  title: string;
  lede?: string;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "page-hero is-compact" : "page-hero"}>
      <div className="container">
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
    </section>
  );
}
