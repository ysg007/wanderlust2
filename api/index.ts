let appPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = (async () => {
      const { startServer } = await import("../dist/server.cjs");
      return startServer();
    })();
  }

  const app = await appPromise;
  return app(req, res);
}
