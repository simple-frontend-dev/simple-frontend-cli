import { Argument, type Command } from "commander";
import { isCancel, cancel, log, multiselect, select } from "@clack/prompts";
import {
  installSolutions,
  type Solutions,
} from "../solutions/install-solutions.js";
import {
  installPattern,
  SOLUTION_PATTERNS,
} from "../solutions/install-pattern.js";

const SOLUTIONS = [
  ...SOLUTION_PATTERNS,
  { name: "TypeScript", solution: "typescript" },
] as const;

const PATTERNS = [
  ...SOLUTIONS,
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
        "typescript",
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
          const lintSolution = await select({
            message: "Select a solutions to setup:",
            options: [
              {
                label:
                  "eslint (recommended for entreprise setup with custom rules)",
                value: "eslint",
              },
              {
                label: "oxlint (recommended for performance)",
                value: "oxlint",
              },
            ],
          });

          if (isCancel(lintSolution)) {
            cancel("No linting solutions selected");
            return;
          }
          solutions = [lintSolution];
        } else if (pattern === "typescript") {
          solutions = ["typescript"];
        } else {
          const solutionsSelected = await multiselect({
            message: "Select one or more patterns to setup:",
            options: SOLUTIONS.map((pattern) => ({
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
