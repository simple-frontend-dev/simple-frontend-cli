import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { log } from "@clack/prompts";
import { type Solutions } from "./install-solutions.js";
import { appendToWorkflowFile } from "../templates/github-actions.js";
import { packageManager } from "../utils/package-manager.js";

export function setupGithubActions({ solutions }: { solutions: Solutions }) {
  try {
    // step 1: if the folder does not exist, create it
    if (!existsSync(resolve("./.github/workflows"))) {
      mkdirSync(resolve("./.github/workflows"), { recursive: true });
    }

    // step 2: if the file already exists, read it to not override the existing configuration
    let existingWorkflow = "";
    if (existsSync(resolve("./.github/workflows/quality-checks.yml"))) {
      existingWorkflow = readFileSync(
        resolve("./.github/workflows/quality-checks.yml"),
        "utf-8",
      );
    }

    const finalWorkflowConfig = appendToWorkflowFile({
      existingWorkflow,
      solutions,
      agent: packageManager,
    });

    // step 3: write the new workflow configuration to the file by merging the existing configuration with the template one
    writeFileSync(
      resolve("./.github/workflows/quality-checks.yml"),
      finalWorkflowConfig,
      "utf-8",
    );
  } catch (error: unknown) {
    log.error(`Failed to install GitHub Actions workflow: ${error}`);
  }
}
