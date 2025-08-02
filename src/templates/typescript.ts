export const typeScriptConfigurationLibrary = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    moduleResolution: "NodeNext",
    module: "NodeNext",
    sourceMap: true,
    declaration: true,
    outDir: "./dist",
    rootDir: "./src",
  },
  include: ["./src"],
};

export const typeScriptConfigurationServer = {
  extends: [
    "@tsconfig/node-lts/tsconfig.json",
    "@tsconfig/strictest/tsconfig.json",
  ],
  compilerOptions: {
    rootDir: "./src",
    outDir: "./dist",

    moduleDetection: "force",
    verbatimModuleSyntax: true,
    rewriteRelativeImportExtensions: true,
    erasableSyntaxOnly: true,

    types: ["node"],
    sourceMap: true,

    forceConsistentCasingInFileNames: true,
    noUncheckedSideEffectImports: true,
  },
  include: ["./src"],
};
