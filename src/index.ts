import { Elysia } from "elysia";
import { watch } from "fs";
import { staticPlugin } from "@elysiajs/static";

// @TODO: report missing types in OnRequest
// the path is not defined in the OnRequest callback arguments
const plugin = <T extends string>(config: { prefix: T }) =>
  new Elysia({
    name: "hmr-plugin",
    seed: config,
  }).onRequest(async ({ path, error, set }) => {
    if (path.endsWith(".js")) {
      set.headers = {
        "Content-Type": "application/javascript",
      };

      const client = await Bun.file("./src/client.js").text();
      const content = await Bun.file(`.${path}`).text();
      return `${client}
      hmrClient(import.meta);
      ${content}`;
    }
  });

const activeWS = new Set();

const app = new Elysia()
  .use(plugin({ prefix: "hmr" }))
  .use(staticPlugin())
  .get("/", () => "Hello Elysia")
  .ws("/ws", {
    // message(ws, message) {
    //   ws.send(message);
    // },
    open(ws) {
      ws.send({ msg: "Hello from Elysia" });
      activeWS.add(ws);
    },
    close(ws) {
      activeWS.delete(ws);
    },
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

const watcher = watch(
  `${import.meta.env.PWD}/public`,
  async (event, filename) => {
    const payload = {
      type: "file:changed",
      file: `/public/${filename}`,
    };

    activeWS.forEach((ws) => ws.send(payload));
  },
);

process.on("SIGINT", () => {
  // close watcher when Ctrl-C is pressed
  console.log("Closing watcher...");
  watcher.close();

  process.exit(0);
});
