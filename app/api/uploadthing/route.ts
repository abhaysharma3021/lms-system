import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const runtime = "nodejs";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
    isDev: process.env.NODE_ENV !== "production",
  },
});
