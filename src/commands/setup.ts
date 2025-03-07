import type { Command } from "commander";
import {
  log,
  multiselect,
  isCancel,
  cancel,
  confirm,
  spinner as spinnerPrompt,
} from "@clack/prompts";
import { setupPrePushHook } from "../solutions/pre-push-hook.js";
import { setupPrettier } from "../solutions/prettier.js";
import { setupEslint } from "../solutions/eslint.js";

const PATTERNS = [
  { name: "Code formatting", solution: "prettier" },
  { name: "Code linting", solution: "eslint" },
] as const;

const spinner = spinnerPrompt();

export async function setupCommand({ program }: { program: Command }) {
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

      solutions.forEach(async (solution) => {
        if (solution === "prettier") {
          setupPrettier();
        }
      });

      log.success(`Successfully setup: ${solutions.join(", ")}`);

      const prePushHookConfirm = await confirm({
        message: "Setup formatting pre-push hook? (recommended)",
      });
      if (isCancel(prePushHookConfirm)) {
        cancel("Pre=push hook setup cancelled");
        return;
      }
      if (prePushHookConfirm) {
        spinner.start("Setting up pre-push hook solution: lefthook");
        solutions.forEach((solution) => {
          setupPrePushHook({ solution });
        });
        spinner.stop("Setup pre-push hook solution: lefthook");
      }

      if (solutions.includes("eslint")) {
        await setupEslint();
      }
    });
}
