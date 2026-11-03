
import "dotenv/config";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Google OAuth credentials are missing");
}

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error("GitHub OAuth credentials are missing");
}

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db(
  process.env.DB_NAME || "novelnest-web-application"
);

const baseURL =
  process.env.BETTER_AUTH_URL || "http://localhost:3000";

const trustedOrigins = (
  process.env.CLIENT_SITE_URL || "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
        expirationTime: "15m",
      },
    }),
  ],
});
