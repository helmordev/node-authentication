import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./lib/auth";
import { PORT } from "./config/env";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { Context, Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { databaseConnection } from "./config/database";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(secureHeaders());
app.use(logger());
app.use(
  "*",
  cors({
    origin: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
    maxAge: 600,
  }),
);
app.use("*", async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.onError(errorHandlerMiddleware);

app.on(["POST", "GET"], "/api/auth/**", (c: Context) =>
  auth.handler(c.req.raw),
);

databaseConnection().then(() => {
  serve(
    {
      fetch: app.fetch,
      port: Number(PORT) | 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
});
