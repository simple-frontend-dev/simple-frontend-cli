export const typeScriptConfigurationLibrary = {
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

    sourceMap: true,
    declaration: true,
    declarationMap: true,

    forceConsistentCasingInFileNames: true,
    noUncheckedSideEffectImports: true,
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

    types: ["node"],

    moduleDetection: "force",
    verbatimModuleSyntax: true,
    rewriteRelativeImportExtensions: true,
    erasableSyntaxOnly: true,

    sourceMap: true,

    forceConsistentCasingInFileNames: true,
    noUncheckedSideEffectImports: true,
  },
  include: ["./src"],
};
