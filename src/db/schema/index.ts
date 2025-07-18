import {
  mysqlTable as table,
  index,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const user = table(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("emailVerified").notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_user_name").on(table.name),
    index("idx_user_email").on(table.email),
    index("idx_user_emailVerified").on(table.emailVerified),
  ],
);

export const session = table(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    ipAddress: varchar("ipAddress", { length: 255 }),
    userAgent: varchar("userAgent", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_session_token").on(table.token)],
);

/**
 * The tables below is for OAuth providers
 **/

// export const account = table(
//   "account",
//   {
//     id: varchar("id", { length: 255 }).primaryKey(),
//     userId: varchar("userId")
//       .references(() => user.id, { onDelete: "cascade" })
//       .notNull(),
//     accountId: varchar("accountId", { length: 255 }).notNull(),
//     providerId: varchar("providerId", { length: 255 }).notNull(),
//     accessToken: varchar("accessToken", { length: 255 }).notNull(),
//     refreshToken: varchar("refreshToken", { length: 255 }).notNull(),
//     accessTokenExpiresAt: timestamp("accessTokenExpiresAt").notNull(),
//     refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt").notNull(),
//     scope: varchar("scope", { length: 255 }).notNull(),
//     idToken: varchar("scope", { length: 255 }).notNull(),
//     password: varchar("password", { length: 255 }).notNull(),
//     createdAt: timestamp("createdAt").defaultNow().notNull(),
//     updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
//   },
//   (table) => [
//     index("idx_account_accountId").on(table.accountId),
//     index("idx_account_providerId").on(table.providerId),
//     index("idx_account_accessToken").on(table.accessToken),
//     index("idx_accont_refreshToken").on(table.refreshToken),
//     index("idx_account_scope").on(table.scope),
//     index("idx_account_idToken").on(table.idToken),
//     index("idx_account_password").on(table.password),
//   ],
// );
//
// export const verification = table("verification", {
//   id: varchar("id", { length: 255 }).primaryKey(),
//   identifier: varchar("identifier", { length: 255 }).notNull(),
//   value: varchar("value", { length: 255 }).notNull(),
//   expiresAt: timestamp("expiresAt").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
// });
