import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { log } from "@clack/prompts";
import { type Solutions } from "./install-solutions.js";
import { getGithubActionsTemplate } from "../templates/github-actions.js";
import { packageManager } from "../utils/package-manager.js";

export function setupGithubActions({ solutions }: { solutions: Solutions }) {
  try {
    const template = getGithubActionsTemplate({
      agent: packageManager.name,
      solutions,
    });
    writeFileSync(
      resolve("./.github/workflows/quality-checks.yml"),
      template,
      "utf-8",
    );
  } catch (error: unknown) {
    log.error(`Failed to install GitHub Actions workflow: ${error}`);
  }
}
