import { betterAuth } from "better-auth";
import { db } from "@/config/database";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { user, session } from "@/db/schema";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user,
      session,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `
    Welcome to ${process.env.APP_NAME}!

    Hello ${user.name || "there"}!

    Thank you for signing up! To complete your registration, please verify your email address by clicking this link:

    ${url}

    If you didn't create an account, please ignore this email.
  `,
      });
    },
  },
  advanced: {
    cookiePrefix: "my-auth-app", // name as you want
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },
});
