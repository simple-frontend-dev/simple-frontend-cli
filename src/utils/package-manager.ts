import { detectSync } from "package-manager-detector/detect";
import { resolveCommand } from "package-manager-detector/commands";
import type { DetectResult, Agent } from "package-manager-detector";
import { execSync } from "node:child_process";

class PackageManagerDetector {
  public packageManager: DetectResult;

  constructor() {
    const packageManager = detectSync();
    if (!packageManager) {
      throw new Error("No able to detetct your package manager");
    }
    this.packageManager = packageManager;
  }
}

export const packageManager = new PackageManagerDetector().packageManager;

function getDevDependencyArg(agent: Agent) {
  switch (agent) {
    case "npm":
      return "--save-dev";
    case "pnpm":
      return "--save-dev";
    case "yarn":
      return "--dev";
    case "bun":
      return "--dev";
    default:
      return "--save-dev";
  }
}

function getExactArg(agent: Agent) {
  switch (agent) {
    case "npm":
      return "--save-exact";
    case "pnpm":
      return "--save-exact";
    case "yarn":
      return "--exact";
    case "bun":
      return "--exact";
    default:
      return "--save-exact";
  }
}

export function installPackage({
  packageName,
  agent,
}: {
  packageName: string;
  agent: Agent;
}) {
  const resolvedCommand = resolveCommand(agent, "add", [
    packageName,
    getDevDependencyArg(agent),
    getExactArg(agent),
  ]);
  if (!resolvedCommand) {
    throw new Error(`Failed to resolve ${packageName} command for ${agent}`);
  }
  const { command, args } = resolvedCommand;
  const commandString = `${command} ${args.join(" ")}`;
  execSync(commandString);
}
