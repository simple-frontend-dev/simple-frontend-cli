const nodelts = {
  lib: ["es2023"],
  module: "node16",
  target: "es2022",
  strict: true,
  esModuleInterop: true,
  skipLibCheck: true,
  moduleResolution: "node16",
};

const strictest = {
  strict: true,
  allowUnusedLabels: false,
  allowUnreachableCode: false,
  exactOptionalPropertyTypes: true,
  noFallthroughCasesInSwitch: true,
  noImplicitOverride: true,
  noImplicitReturns: true,
  noPropertyAccessFromIndexSignature: true,
  noUncheckedIndexedAccess: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  isolatedModules: true,
  checkJs: true,
  esModuleInterop: true,
  skipLibCheck: true,
};

const totalTs = {
  module: "NodeNext",
  sourceMap: true,
  /* AND if you're building for a library: */
  declaration: true,
  /* AND if you're building for a library in a monorepo: */
  composite: true,
  declarationMap: true,
  /* If NOT transpiling with TypeScript: */
  module: "preserve",
  noEmit: true,
};
