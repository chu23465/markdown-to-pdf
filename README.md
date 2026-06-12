# Markdown to PDF converter

<!--- [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)--->

![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=black&labelColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![WebAssembly](https://img.shields.io/badge/webassembly-%23654FF0.svg?style=for-the-badge&logo=webassembly&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white&labelColor=ff73a8&color=ff73a8)



Convertes a Markdown string/file to HTML using [`comrak-wasm`](https://github.com/nberlette/comrak-wasm), styles using [`GitHub Markdown CSS`](https://github.com/sindresorhus/github-markdown-css). Automatically lints to [`Google TypeScript`](https://google.github.io/styleguide/tsguide.html) standard using [`gts`](https://github.com/google/gts).

To run locally, first clone the repository:

```bash
git clone https://github.com/chu23465/markdown-to-pdf
```

Then, to install dependencies:

```bash
cd markdown-to-pdf
bun install
```

There's a known [bug](https://github.com/oven-sh/bun/issues/10169) in bun (Windows) that surfaces as a `EINVAL lockfile error`. If the working project directory is not in the primary drive where the OS install is located, it sometimes errors out. If that happens during install:

```bash
bunx jsr install @nick/comrak --npm
```

To run in Debug mode:

```bash
bun run ./debug.html
```


Various helper scripts 

``` bash
bun run <scriptname>
```

Scripts:-

|Script Name| Function|
|-------------|---------------------------|
| devDebug    | Lints and runs debug.html |
| debugBundle | Debug bundler |
| bundle      | Production ready `build` folder for distribution |
| prodTest    | Tests production build in browser |
| lint        | Google TypeScript standard linting using [`gts`](https://github.com/google/gts) |
| clean       | Clean `gts` output files |
| fix         | Formats files according to Google TypeScript |
| typecheck   | Type checking using `tsc` |


This project was created using `bun init`. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
