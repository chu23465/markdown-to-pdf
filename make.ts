import html from './debug.html' with {type: 'text'};
import {mkdir, rm} from 'node:fs/promises';

const css = await Bun.file('./github.button.css').text();
const projectFolder = new URL('./build/', import.meta.url);

try {
  await rm(projectFolder, {recursive: true, force: true});
  console.log(`Removed folder URI - ${projectFolder}`);
  await mkdir(projectFolder, {recursive: true});
  console.log(`Created folder URI ${projectFolder}`);

  const newhtml = (html as unknown as string).replace(
    '<script src="index.ts"></script>',
    '<script src="index.js"></script>',
  );

  await Bun.write('./build/index.html', newhtml);
  await Bun.write('./build/github.button.css', css as unknown as string);

  console.log('Created index.html and github.button.css');
} catch (err) {
  console.error((err as Error).message);
}
//console.dir(html);
