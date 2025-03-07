import { log } from "@clack/prompts";
import open from "open";

const ESLINT_SETUP_URL =
  "https://eslint.org/docs/latest/use/getting-started#quick-start";

export async function setupEslint() {
  log.info(`For eslint installation and setup, follow: ${ESLINT_SETUP_URL}`);

  await open(ESLINT_SETUP_URL);
}
