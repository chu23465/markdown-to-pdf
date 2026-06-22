// Purely AI generated and fixed
// Google Search AI

// 1. Import the capitalized Glob class from bun
import {Glob} from 'bun';
import fs from 'node:fs';

const buildDir = './';
// 2. Instantiate the Glob scanner class
const glob = new Glob('./build/*');

const vfsObject: Record<string, string> = {};

// 3. Scan the build directory using the class instance
for (const file of glob.scanSync({cwd: buildDir})) {
  // reconstruct the correct local file path
  try {
    const fullPath = `${buildDir}/${file}`;

    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      // Read the binary safely as base64
      const content = fs.readFileSync(fullPath, {encoding: 'base64'});

      vfsObject[`${file.split('\\')[2]}`] = content;
    }
  } catch (error) {
    console.log((error as Error).message);
  }
}

const fileContent = `export default ${JSON.stringify(vfsObject, null, 2)};`;
await Bun.write('./vfs-data.ts', fileContent);
console.log('VFS successfully generated natively!');
