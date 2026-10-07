export function PageHeader({ title, lede }: { title: string; lede?: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
    </section>
  );
}
