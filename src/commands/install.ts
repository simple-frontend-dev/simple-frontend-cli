import type { Command } from "commander";
import {
  log,
  multiselect,
  isCancel,
  cancel,
  confirm,
  spinner as spinnerPrompt,
} from "@clack/prompts";
import { setupPrePushHook } from "../solutions/pre-push-hook.ts";
import { setupPrettier } from "../solutions/prettier.ts";
import { setupEslint } from "../solutions/eslint.ts";

const PATTERNS = [
  { name: "Code formatting", solution: "prettier" },
  { name: "Code linting", solution: "eslint" },
] as const;

const spinner = spinnerPrompt();

export async function installCommand({ program }: { program: Command }) {
  return program
    .command("install")
    .description(
      `Install a simple frontend pattern. Available patterns are: ${PATTERNS.map(
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

      log.success(`Successfully installed: ${solutions.join(", ")}`);

      const prePushHookConfirm = await confirm({
        message: "Install formatting pre-push hook? (recommended)",
      });
      if (isCancel(prePushHookConfirm)) {
        cancel("Pattern installation cancelled");
        return;
      }
      if (prePushHookConfirm) {
        spinner.start("Installing pre-push hook solution: lefthook");
        solutions.forEach((solution) => {
          setupPrePushHook({ solution });
        });
        spinner.stop("Installed pre-push hook solution: lefthook");
      }

      if (solutions.includes("eslint")) {
        await setupEslint();
      }
    });
}
