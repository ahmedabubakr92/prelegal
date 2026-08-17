import MndaCreator from "@/components/MndaCreator";
import { readMndaTemplate } from "@/lib/read-template.server";

export default async function Home() {
  const templateMarkdown = await readMndaTemplate();

  return (
    <div className="flex-1 bg-zinc-50">
      <MndaCreator templateMarkdown={templateMarkdown} />
    </div>
  );
}
