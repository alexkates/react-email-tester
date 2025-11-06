import { EmailPanel } from "@/components/email-panel";
import { getExamples } from "@/server/get-examples";

export default function Home() {
  const templates = getExamples();

  return <EmailPanel defaultTemplates={templates} />;
}
