import { startServer } from "../server.ts";

let appPromise: ReturnType<typeof startServer> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = startServer();
  }

  const app = await appPromise;
  return app(req, res);
}
