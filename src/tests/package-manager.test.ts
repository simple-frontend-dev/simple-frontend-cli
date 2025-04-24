import { test, expect } from "vitest";
import { getExecCommand } from "../utils/package-manager";

test("getExecCommand for prettier with pnpm", () => {
  const command = getExecCommand("pnpm", "prettier", [
    "--check",
    "--ignore-unknown",
    "src",
  ]);
  expect(command).toBe("pnpm exec prettier --check --ignore-unknown src");
});

test("getExecCommand for prettier with npm", () => {
  const command = getExecCommand("npm", "prettier", [
    "--check",
    "--ignore-unknown",
    "src",
  ]);
  expect(command).toBe("npm exec prettier -- --check --ignore-unknown src");
});

test("getExecCommand for prettier with yarn", () => {
  const command = getExecCommand("yarn", "prettier", [
    "--check",
    "--ignore-unknown",
    "src",
  ]);
  expect(command).toBe("yarn exec prettier -- --check --ignore-unknown src");
});

test("getExecCommand for prettier with bun", () => {
  const command = getExecCommand("bun", "prettier", [
    "--check",
    "--ignore-unknown",
    "src",
  ]);
  expect(command).toBe("bunx prettier --check --ignore-unknown src");
});

test("getExecCommand for eslint with pnpm", () => {
  const command = getExecCommand("pnpm", "eslint", ["--no-warn-ignore", "src"]);
  expect(command).toBe("pnpm exec eslint --no-warn-ignore src");
});

test("getExecCommand for eslint with npm", () => {
  const command = getExecCommand("npm", "eslint", ["--no-warn-ignore", "src"]);
  expect(command).toBe("npm exec eslint -- --no-warn-ignore src");
});
test("getExecCommand for eslint with yarn", () => {
  const command = getExecCommand("yarn", "eslint", ["--no-warn-ignore", "src"]);
  expect(command).toBe("yarn exec eslint -- --no-warn-ignore src");
});

test("getExecCommand for eslint with bun", () => {
  const command = getExecCommand("bun", "eslint", ["--no-warn-ignore", "src"]);
  expect(command).toBe("bunx eslint --no-warn-ignore src");
});
