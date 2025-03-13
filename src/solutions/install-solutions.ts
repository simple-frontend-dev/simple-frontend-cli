import {
  log,
  isCancel,
  cancel,
  confirm,
  spinner as spinnerPrompt,
} from "@clack/prompts";
import { setupPrePushHook } from "./pre-push-hook.js";
import { setupPrettier } from "./prettier.js";
import { setupEslint } from "./eslint.js";
import { setupEslintConfigPrettier } from "./eslint-config-prettier.js";

export type Solutions = ("prettier" | "eslint")[];

const spinner = spinnerPrompt();

export async function installSolutions({
  solutions,
}: {
  solutions: Solutions;
}) {
  solutions.forEach(async (solution) => {
    if (solution === "prettier") {
      setupPrettier();
    }
    if (solution === "eslint") {
      await setupEslint();
    }
  });

  if (solutions.includes("prettier") && solutions.includes("eslint")) {
    log.info(
      "Installing eslint-config-prettier to turn off ESLint rules that conflict with Prettier",
    );
    setupEslintConfigPrettier();
  }

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
    setupPrePushHook({ solutions });
    spinner.stop("Setup pre-push hook solution: lefthook");
  }
}
