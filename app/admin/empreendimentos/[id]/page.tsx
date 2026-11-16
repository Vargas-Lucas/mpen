import { notFound } from "next/navigation";
import { DevelopmentForm } from "@/components/DevelopmentForm";
import { requireEditor } from "@/lib/auth";
import { getDevelopmentById } from "@/lib/data";
import { developmentFormValues } from "@/lib/development-content";

export default async function EditDevelopmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salvo?: string }>;
}) {
  await requireEditor();
  const { id } = await params;
  const query = await searchParams;
  const item = await getDevelopmentById(Number(id));
  if (!item) notFound();

  return <DevelopmentForm values={developmentFormValues(item)} saved={query.salvo === "1"} />;
}
