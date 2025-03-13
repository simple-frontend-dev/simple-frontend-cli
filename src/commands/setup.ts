import { Argument, type Command } from "commander";
import { isCancel, cancel, log, multiselect } from "@clack/prompts";
import {
  installSolutions,
  type Solutions,
} from "../solutions/install-solutions.js";

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
    .addArgument(
      new Argument("[pattern]", "The pattern to setup").choices([
        "format",
        "lint",
      ]),
    )
    .action(async (pattern) => {
      let solutions: Solutions = [];
      if (pattern === "format") {
        solutions = ["prettier"];
      } else if (pattern === "lint") {
        solutions = ["eslint"];
      } else {
        const solutionsSelected = await multiselect({
          message: "Select one or more patterns to setup",
          options: PATTERNS.map((pattern) => ({
            label: pattern.name,
            value: pattern.solution,
          })),
        });

        if (isCancel(solutionsSelected) || solutionsSelected.length === 0) {
          cancel("No patterns selected");
          return;
        }

        solutions = solutionsSelected;
      }

      await installSolutions({ solutions });

      log.success("Setup complete");
    });
}
