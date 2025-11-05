import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const TEMPLATES_DIR = join(process.cwd(), "src/data/default-templates");

export function getDefaultTemplates(): Record<string, string> {
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
