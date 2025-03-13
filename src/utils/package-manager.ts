import { detectSync } from "package-manager-detector/detect";
import { resolveCommand } from "package-manager-detector/commands";
import type { DetectResult, AgentName } from "package-manager-detector";
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

function getDevDependencyArg(agent: AgentName) {
  switch (agent) {
    case "yarn":
    case "bun":
      return "--dev";
    default:
      return "--save-dev";
  }
}

function getExactArg(agent: AgentName) {
  switch (agent) {
    case "yarn":
    case "bun":
      return "--exact";
    default:
      return "--save-exact";
  }
}

export function getExecCommand(agent: AgentName) {
  switch (agent) {
    case "bun":
      return "bunx";
    default:
      return `${agent} exec`;
  }
}

export function getCreateCommand(agent: AgentName) {
  switch (agent) {
    case "npm":
      return "init";
    default:
      return "create";
  }
}

export function installPackage({
  packageName,
  agent,
}: {
  packageName: string;
  agent: AgentName;
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
