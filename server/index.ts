import { createServer } from "vite";

async function startServer() {
  const server = await createServer({
    server: {
      host: "0.0.0.0",
      port: 5000,
    },
  });

  await server.listen();
  console.log(`Server running on http://0.0.0.0:5000`);
}

startServer().catch(console.error);