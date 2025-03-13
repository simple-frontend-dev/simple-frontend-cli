import { Argument, type Command } from "commander";
import { isCancel, cancel, log, multiselect } from "@clack/prompts";
import {
  installSolutions,
  type Solutions,
} from "../solutions/install-solutions.js";
import {
  installPattern,
  SOLUTION_PATTERNS,
} from "../solutions/install-pattern.js";

const PATTERNS = [
  ...SOLUTION_PATTERNS,
  { name: "Pre-push hook", solution: "pre-push" },
  { name: "GitHub Actions workflow", solution: "github-actions" },
] as const;

export function setupCommand({ program }: { program: Command }) {
  return program
    .command("setup")
    .description(
      `Setup a simple frontend pattern. Available patterns are: ${PATTERNS.map(
        (pattern) => pattern.name,
      ).join(", ")}`,
    )
    .addArgument(
      new Argument("[pattern]", "The pattern to setup").choices([
        "format",
        "lint",
        "pre-push",
        "github-actions",
      ]),
    )
    .action(async (pattern) => {
      if (pattern === "pre-push") {
        await installPattern({ pattern: "pre-push" });
      } else if (pattern === "github-actions") {
        await installPattern({ pattern: "github-actions" });
      } else {
        let solutions: Solutions = [];
        if (pattern === "format") {
          solutions = ["prettier"];
        } else if (pattern === "lint") {
          solutions = ["eslint"];
        } else {
          const solutionsSelected = await multiselect({
            message: "Select one or more patterns to setup",
            options: SOLUTION_PATTERNS.map((pattern) => ({
              label: pattern.name,
              value: pattern.solution,
            })),
            required: true,
          });

          if (isCancel(solutionsSelected) || solutionsSelected.length === 0) {
            cancel("No patterns selected");
            return;
          }

          solutions = solutionsSelected;
        }

        await installSolutions({ solutions });
      }

      log.success("Setup complete");
    });
}
