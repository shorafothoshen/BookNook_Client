import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins"

const client = new MongoClient(process.env.MONGODB_CONNECTION_BASE_URL!);
const db = client.db("booknook");

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,  
  },

  socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET as string, 
        }
    },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  session: {
  cookieCache: {
    enabled: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    strategy: "jwt",
    refreshCache: true,
  },
},
 plugins: [
        jwt(), 
    ]
});