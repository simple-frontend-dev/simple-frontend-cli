import { test, expect, vi, beforeEach, beforeAll } from "vitest";
import { fs, vol } from "memfs";
import path from "node:path";
import { execSync, spawnSync } from "node:child_process";
import { multiselect, confirm } from "@clack/prompts";
import { program } from "commander";
import { setupCommand } from "../commands/setup";

vi.mock("node:fs", () => vi.importActual<typeof import("memfs")>("memfs"));
vi.mock("node:child_process", () => {
  return {
    execSync: vi.fn(),
    spawnSync: vi.fn(),
  };
});
vi.mock("@clack/prompts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@clack/prompts")>();
  return {
    ...actual,
    multiselect: vi.fn(),
    confirm: vi.fn(),
  };
});
vi.mock("package-manager-detector/detect", () => ({
  detectSync: vi.fn().mockImplementation(() => ({
    agent: "npm",
    name: "npm",
  })),
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeAll(() => {
  vi.spyOn(path, "dirname").mockReturnValue("/root");
  setupCommand({ program });
});

beforeEach(() => {
  vol.reset();
});

test("npm / prettier", async () => {
  vol.fromJSON({
    "/root/package.json": "{}",
    "/root/package-lock.json": "",
  });

  vi.mocked(multiselect).mockResolvedValue(["prettier"]);
  vi.mocked(confirm).mockResolvedValue(false); // no pre-push hooks

  program.parse(["setup"], { from: "user" });

  await flushPromises();

  expect(fs.existsSync("/root/.prettierrc")).toBe(true);
  expect(vi.mocked(execSync)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "npm i prettier --save-dev --save-exact",
  );
});

test("npm / prettier / with pre-push hook", async () => {
  vi.spyOn(path, "dirname").mockReturnValue("/root");

  vol.fromJSON({
    "/root/package.json": "{}",
    "/root/npm-lock.json": "",
  });

  vi.mocked(multiselect).mockResolvedValue(["prettier"]);
  vi.mocked(confirm).mockResolvedValue(true); // with pre-push hooks

  program.parse(["setup"], { from: "user" });

  await flushPromises();

  expect(fs.existsSync("/root/.prettierrc")).toBe(true);
  expect(fs.existsSync("/root/lefthook.yml")).toBe(true);
  expect(fs.readFileSync("/root/lefthook.yml", "utf8")).toContain("pre-push");
  expect(fs.readFileSync("/root/lefthook.yml", "utf8")).toContain("format");
  expect(vi.mocked(execSync)).toHaveBeenCalledTimes(2);
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "npm i prettier --save-dev --save-exact",
  );
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "npm i lefthook --save-dev --save-exact",
  );
});

test("npm / prettier + eslint / with pre-push hook", async () => {
  vi.spyOn(path, "dirname").mockReturnValue("/root");

  vol.fromJSON({
    "/root/package.json": "{}",
    "/root/npm-lock.json": "",
  });

  vi.mocked(multiselect).mockResolvedValue(["prettier", "eslint"]);
  vi.mocked(confirm).mockResolvedValue(true); // with pre-push hooks

  program.parse(["setup"], { from: "user" });

  await flushPromises();

  expect(fs.existsSync("/root/.prettierrc")).toBe(true);
  expect(fs.existsSync("/root/lefthook.yml")).toBe(true);
  expect(fs.readFileSync("/root/lefthook.yml", "utf8")).toContain("pre-push");
  expect(fs.readFileSync("/root/lefthook.yml", "utf8")).toContain("format");
  expect(fs.readFileSync("/root/lefthook.yml", "utf8")).toContain("lint");
  expect(vi.mocked(execSync)).toHaveBeenCalledTimes(2);
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "npm i prettier --save-dev --save-exact",
  );
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "npm i lefthook --save-dev --save-exact",
  );
  expect(vi.mocked(spawnSync)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(spawnSync)).toHaveBeenCalledWith(
    "npm",
    ["init", "@eslint/config@latest"],
    { stdio: "inherit" },
  );
});
