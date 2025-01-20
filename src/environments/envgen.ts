import { parseArgs } from 'node:util';
import { writeFile } from 'node:fs/promises';
import { factory, SyntaxKind, NodeFlags, createPrinter, NewLineKind } from 'typescript';

declare const process: {
  env: {
    HATENA_API_KEY: string;
  };
  exit: (code: number) => void;
};

function generateEnvFileAST(hatenaBlogApi: string): string {
  const envObject = factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('env'),
          undefined,
          undefined,
          factory.createAsExpression(
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  factory.createIdentifier('hatenaBlogApi'),
                  factory.createStringLiteral(hatenaBlogApi),
                ),
              ],
              true,
            ),
            factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  const sourceFile = factory.createSourceFile(
    [envObject],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  );

  const printer = createPrinter({ newLine: NewLineKind.LineFeed });
  return printer.printFile(sourceFile);
}

async function main() {
  const hatenaBlogApi = process.env.HATENA_API_KEY;
  if (!hatenaBlogApi) {
    throw new Error('HATENA_API_KEY is not set');
  }

  const args = parseArgs({
    options: {
      output: { type: 'string', short: 'o' },
    },
  });
  const outputFile = args.values.output;
  if (!outputFile) {
    throw new Error('Usage: bun run src/environments/envgen.ts -o <outputFile>');
  }
  const code = generateEnvFileAST(hatenaBlogApi);
  await writeFile(outputFile, code);
  console.log(`Generated ${outputFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
