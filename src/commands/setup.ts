import { Argument, type Command } from "commander";
import { isCancel, cancel, log, multiselect } from "@clack/prompts";
import { packageManagerError } from "../utils/package-manager.js";
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
      // This is a nicer user experience than throwing an exception for the CLI
      if (packageManagerError) {
        log.error(packageManagerError);
        return;
      }

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
