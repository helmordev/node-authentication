import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./lib/auth";
import { PORT } from "./config/env";
import { Context } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

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

app.on(["POST", "GET"], "/api/auth/**", (c: Context) =>
  auth.handler(c.req.raw),
);

serve(
  {
    fetch: app.fetch,
    port: Number(PORT) | 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
