import { BackButton } from "@/components/BackButton";

export function PageHeader({
  title,
  lede,
  compact = false,
  back = false,
  className,
}: {
  title: string;
  lede?: string;
  compact?: boolean;
  back?: boolean;
  className?: string;
}) {
  return (
    <section className={[compact ? "page-hero is-compact" : "page-hero", className].filter(Boolean).join(" ")}>
      <div className="container">
        {back ? <BackButton /> : null}
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
    </section>
  );
}
