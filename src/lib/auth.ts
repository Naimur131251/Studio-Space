import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  `mongodb://${process.env.DB_URI}:${process.env.DB_PASS}@ac-k03dstd-shard-00-00.kgxk25v.mongodb.net:27017,ac-k03dstd-shard-00-01.kgxk25v.mongodb.net:27017,ac-k03dstd-shard-00-02.kgxk25v.mongodb.net:27017/?ssl=true&replicaSet=atlas-6jagwq-shard-0&authSource=admin`,
);

const db = client.db("studio-space");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
