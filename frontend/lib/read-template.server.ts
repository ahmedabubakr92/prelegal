import "server-only";
import { readFile } from "fs/promises";
import path from "path";

/**
 * The repo's root `templates/` directory is the single source of truth for
 * legal template text, shared across this Next.js app and any future
 * frontends. Read directly off disk rather than duplicating the content.
 */
export async function readMndaTemplate(): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "..",
    "templates",
    "Mutual-NDA.md"
  );
  return readFile(templatePath, "utf-8");
}
