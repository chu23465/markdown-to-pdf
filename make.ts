import html from './debug.html' with {type: 'text'};
import {mkdir, rm} from 'node:fs/promises';

const css = await Bun.file('./page.css').text();
const projectFolder = new URL('./build/', import.meta.url);

try {
  await rm(projectFolder, {recursive: true, force: true});
  console.log(`Removed folder URI - ${projectFolder}`);
  await mkdir(projectFolder, {recursive: true});
  console.log(`Created folder URI ${projectFolder}`);

  let newhtml: string = (html as unknown as string).replace(
    '<script src="index.ts"></script>',
    '<script src="index.js"></script>',
  );
  if (process.env.GITHUB_ACTIONS === 'true') {
    newhtml = newhtml.replace('href="/"', 'href="/markdown-to-pdf/"');
  }
  await Bun.write('./build/index.html', newhtml);
  await Bun.write('./build/page.css', css as unknown as string);

  console.log('Created index.html and page.css');
} catch (err) {
  console.error((err as Error).message);
}
//console.dir(html);
