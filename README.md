# markdowntopdf
For me: config env, start:

```
bun init markdown2pdf (Select blank)
bun add -d gts
bunx gts init
bun add -d @types/bun
bunx jsr install @nick/comrak --npm
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Scripts - lint, fix, typecheck

```
bun run <scriptname>
```
This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
