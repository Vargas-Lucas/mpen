import { BackButton } from "@/components/BackButton";

export function PageHeader({
  title,
  lede,
  compact = false,
  back = false,
}: {
  title: string;
  lede?: string;
  compact?: boolean;
  back?: boolean;
}) {
  return (
    <section className={compact ? "page-hero is-compact" : "page-hero"}>
      <div className="container">
        {back ? <BackButton /> : null}
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
    </section>
  );
}
