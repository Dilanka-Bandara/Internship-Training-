import { app } from "./app.js";
import { env } from "./config/environment.js";
import { prisma } from "./database/connection.js";

const server = app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

// Close connections cleanly on Ctrl+C or when the process is stopped.
async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
