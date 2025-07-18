import { detect } from "package-manager-detector/detect";
import { resolveCommand } from "package-manager-detector/commands";
import type { AgentName } from "package-manager-detector";
import { execSync } from "node:child_process";

const packageManagerDetected = await detect();
if (!packageManagerDetected) {
  throw new Error(
    "Unable to detect your package manager: simplefrontend CLI needs to run in an existing project root folder which is already installed (where you should have a `package.json` and an existing lock file).",
  );
}
export const packageManager = packageManagerDetected.name;

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

export function getExecCommand(
  agent: AgentName,
  packageName: string,
  args: string[],
): string {
  switch (agent) {
    case "bun":
      return ["bunx", packageName, ...args].join(" ");
    case "pnpm":
      return ["pnpm", "exec", packageName, ...args].join(" ");
    default:
      return [agent, "exec", packageName, "--", ...args].join(" ");
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

export function getLockFileIgnorePattern(agent: AgentName) {
  switch (agent) {
    case "npm":
      return "package-lock.json";
    case "pnpm":
      return "pnpm-lock.yaml";
    case "yarn":
      return "yarn.lock";
    case "bun":
      return "bun.lock\nbun.lockb";
    default:
      return "";
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
