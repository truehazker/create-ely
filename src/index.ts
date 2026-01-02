#!/usr/bin/env bun
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import * as clack from '@clack/prompts';

async function main() {
  console.clear();

  clack.intro('create-elysiajs');

  // Check if project name was passed as argument
  const args = process.argv.slice(2);
  const projectNameArg = args[0];

  const projectType = await clack.select({
    message: 'What would you like to create?',
    options: [
      {
        value: 'backend',
        label: 'Backend only',
        hint: 'ElysiaJS API with PostgreSQL',
      },
      {
        value: 'monorepo',
        label: 'Monorepo',
        hint: 'Backend + Frontend (React + TanStack Router)',
      },
    ],
  });

  if (clack.isCancel(projectType)) {
    clack.cancel('Operation cancelled');
    process.exit(0);
  }

  let projectName: string | symbol;

  // If project name was provided as argument and is valid, use it
  if (projectNameArg && /^[a-z0-9-]+$/.test(projectNameArg)) {
    projectName = projectNameArg;
  } else {
    // Otherwise, prompt for it
    projectName = await clack.text({
      message: 'Project name:',
      placeholder: 'my-elysia-app',
      validate: (value) => {
        if (!value) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(value))
          return 'Project name must contain only lowercase letters, numbers, and hyphens';
        return undefined;
      },
    });

    if (clack.isCancel(projectName)) {
      clack.cancel('Operation cancelled');
      process.exit(0);
    }
  }

  const targetDir = join(process.cwd(), projectName as string);

  if (existsSync(targetDir)) {
    clack.cancel(`Directory "${String(projectName)}" already exists`);
    process.exit(1);
  }

  const spinner = clack.spinner();
  spinner.start('Creating project...');

  try {
    const templateDir = join(
      import.meta.dir,
      '..',
      'templates',
      projectType as string,
    );

    // Cross-platform recursive copy function
    function copyRecursive(src: string, dest: string, exclude: string[] = []) {
      const stats = statSync(src);

      if (stats.isDirectory()) {
        if (!existsSync(dest)) {
          mkdirSync(dest, { recursive: true });
        }

        const entries = readdirSync(src);
        for (const entry of entries) {
          // Skip excluded directories/files
          if (exclude.includes(entry)) {
            continue;
          }

          const srcPath = join(src, entry);
          const destPath = join(dest, entry);
          copyRecursive(srcPath, destPath, exclude);
        }
      } else {
        const destDir = dirname(dest);
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        copyFileSync(src, dest);
      }
    }

    // Copy template files (excluding node_modules and .git)
    copyRecursive(templateDir, targetDir, ['node_modules', '.git']);

    spinner.stop('Project created successfully!');

    const s = clack.spinner();
    s.start('Installing dependencies...');

    // Install dependencies
    const installProc = Bun.spawn(['bun', 'install'], {
      cwd: targetDir,
      stdout: 'inherit',
      stderr: 'inherit',
    });
    await installProc.exited;

    if (installProc.exitCode !== 0) {
      throw new Error('Failed to install dependencies');
    }

    s.stop('Dependencies installed!');

    const nextSteps =
      projectType === 'monorepo'
        ? `  cd ${String(projectName)}
  bun run dev:backend  # Start backend on http://localhost:3000
  bun run dev:frontend # Start frontend on http://localhost:5173`
        : `  cd ${String(projectName)}
  bun run dev          # Start backend on http://localhost:3000`;

    clack.outro(`
Success! Your ElysiaJS project is ready.

Next steps:
${nextSteps}

Check out the README.md for more information.
    `);
  } catch (error) {
    spinner.stop('Failed to create project');
    clack.cancel(
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
