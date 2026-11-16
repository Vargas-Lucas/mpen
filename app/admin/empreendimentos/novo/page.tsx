import { DevelopmentForm } from "@/components/DevelopmentForm";
import { requireEditor } from "@/lib/auth";
import { developmentFormValues } from "@/lib/development-content";

export default async function NewDevelopmentPage() {
  await requireEditor();
  return <DevelopmentForm values={developmentFormValues(null)} />;
}
