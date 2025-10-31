import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const TEMPLATES_DIR = join(process.cwd(), "src/templates");

export function getTemplate(id: string): string {
  return readFileSync(join(TEMPLATES_DIR, `${id}.tsx`), "utf-8");
}

export function getAllTemplates(): Record<string, string> {
  const files = readdirSync(TEMPLATES_DIR).filter((file) =>
    file.endsWith(".tsx")
  );

  return files.reduce(
    (acc, file) => {
      acc[`/${file}`] = readFileSync(join(TEMPLATES_DIR, file), "utf-8");
      return acc;
    },
    {} as Record<string, string>
  );
}
