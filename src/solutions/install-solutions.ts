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

const spinner = spinnerPrompt();

export async function installSolutions({
  solutions,
}: {
  solutions: ("prettier" | "eslint")[];
}) {
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
    setupPrePushHook({ solutions });
    spinner.stop("Setup pre-push hook solution: lefthook");
  }

  if (solutions.includes("eslint")) {
    await setupEslint();
  }
}
