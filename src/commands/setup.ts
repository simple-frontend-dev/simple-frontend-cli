import type { Command } from "commander";
import { isCancel, cancel, log, multiselect } from "@clack/prompts";
import { installSolutions } from "../solutions/install-solutions.js";

const PATTERNS = [
  { name: "Code formatting", solution: "prettier" },
  { name: "Code linting", solution: "eslint" },
] as const;

export function setupCommand({ program }: { program: Command }) {
  return program
    .command("setup")
    .description(
      `Setup a simple frontend pattern. Available patterns are: ${PATTERNS.map(
        (pattern) => pattern.name,
      ).join(", ")}`,
    )
    .action(async () => {
      const solutions = await multiselect({
        message: "Select one or more patterns",
        options: PATTERNS.map((pattern) => ({
          label: pattern.name,
          value: pattern.solution,
        })),
      });

      if (isCancel(solutions) || solutions.length === 0) {
        cancel("No patterns selected");
        return;
      }

      await installSolutions({ solutions });

      log.success("Setup complete");
    });
}
