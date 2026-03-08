#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import * as p from '@clack/prompts';
import { downloadTemplate } from 'giget';
import pc from 'picocolors';
import mri from 'mri';

async function main() {
  const argv = mri(process.argv.slice(2));
  
  let targetDir = argv._[0];

  const defaultProjectName = targetDir || 'prestige-project';

  p.intro(pc.bgCyan(pc.black(' create-prestige ')));

  if (!targetDir) {
    const project = await p.group({
      dir: () => p.text({
        message: 'Project name:',
        initialValue: defaultProjectName,
        placeholder: defaultProjectName,
      })
    }, {
      onCancel: () => {
        p.cancel('Operation cancelled.');
        process.exit(1);
      }
    });
    
    targetDir = project.dir.trim() || defaultProjectName;
  }

  const root = path.join(process.cwd(), targetDir);

  if (fs.existsSync(root) && fs.readdirSync(root).length > 0) {
    const overwrite = await p.confirm({
      message: `Target directory "${targetDir}" is not empty. Remove existing files and continue?`,
      initialValue: false
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel('Operation cancelled.');
      process.exit(1);
    }

    fs.rmSync(root, { recursive: true, force: true });
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const s = p.spinner();
  s.start(`Scaffolding project in ${root}...`);

  try {
    // Fetching the demo app as a template from the prestige repo
    await downloadTemplate('github:lukonik/prestige/apps/demo', {
      dir: root,
      force: true,
    });

    const pkgPath = path.join(root, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      pkg.name = path.basename(root);
      // Clean up package.json for the template
      delete pkg.private;
      
      const cleanDeps = (deps: Record<string, string>) => {
        if (!deps) return;
        for (const [key, value] of Object.entries(deps)) {
          if (value.startsWith('workspace:')) {
            deps[key] = 'latest';
          } else if (value.startsWith('catalog:')) {
            deps[key] = 'latest';
          }
        }
      };

      cleanDeps(pkg.dependencies);
      cleanDeps(pkg.devDependencies);
      
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\\n");
    }

    s.stop(`Project scaffolded successfully in ${root}`);

    let nextSteps = '';
    if (root !== process.cwd()) {
      nextSteps += `cd ${path.relative(process.cwd(), root)}\n`;
    }
    nextSteps += `pnpm install\npnpm run dev`;

    p.note(nextSteps, 'Next steps');
    
    p.outro(`Problems? Open an issue at ${pc.cyan('https://github.com/lukonik/prestige/issues')}`);

  } catch (error) {
    s.stop('Failed to download template');
    p.log.error(String(error));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
