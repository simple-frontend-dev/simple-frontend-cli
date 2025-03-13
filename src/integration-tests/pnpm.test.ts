import { test, expect, vi, beforeEach, beforeAll } from "vitest";
import { fs, vol } from "memfs";
import path from "node:path";
import { execSync } from "node:child_process";
import { multiselect, confirm } from "@clack/prompts";
import { program } from "commander";
import { setupCommand } from "../commands/setup";

vi.mock("node:fs", () => vi.importActual<typeof import("memfs")>("memfs"));
vi.mock("node:child_process", () => {
  return {
    execSync: vi.fn(),
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
    agent: "pnpm",
    name: "pnpm",
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

test("pnpm / prettier", async () => {
  vol.fromJSON({
    "/root/package.json": "{}",
    "/root/pnpm-lock.json": "",
  });

  vi.mocked(multiselect).mockResolvedValue(["prettier"]);
  vi.mocked(confirm).mockResolvedValue(false); // no pre-push hooks

  program.parse(["setup"], { from: "user" });

  await flushPromises();

  expect(fs.existsSync("/root/.prettierrc")).toBe(true);
  expect(vi.mocked(execSync)).toHaveBeenCalledTimes(1);
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "pnpm add prettier --save-dev --save-exact",
  );
});

test("pmpm / prettier / with pre-push hook", async () => {
  vi.spyOn(path, "dirname").mockReturnValue("/root");

  vol.fromJSON({
    "/root/package.json": "{}",
    "/root/pnpm-lock.json": "",
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
    "pnpm add prettier --save-dev --save-exact",
  );
  expect(vi.mocked(execSync)).toHaveBeenCalledWith(
    "pnpm add lefthook --save-dev --save-exact",
  );
});
