import { EmailPanel } from "@/components/email-panel";
import { getAllTemplates } from "@/lib/get-template";

export default function Home() {
  const templates = getAllTemplates();

  return <EmailPanel templates={templates} />;
}
