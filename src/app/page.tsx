import { EmailPanel } from "@/components/email-panel";
import { getDefaultTemplates } from "@/server/get-default-templates";

export default function Home() {
  const templates = getDefaultTemplates();

  return <EmailPanel defaultTemplates={templates} />;
}
