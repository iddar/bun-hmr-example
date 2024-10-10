# A HMR Server with Bun/Elysia

This is a simple example of how to use Bun and Elysia to create a HMR server.

## Running the example

clone the repository and run the following commands:

```bash
bun install
bun run src/index.ts
```

Then open your browser at `http://localhost:3000/public/`.
To see the HMR in action, open  the file `public/child.js` and save that file. The rID number should change.
