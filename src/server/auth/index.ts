// // src/server/auth/index.ts

// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { type GetServerSidePropsContext } from "next";
// import {
//   getServerSession,
//   type NextAuthOptions,
//   type DefaultSession,
// } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcrypt";

// import { env } from "@/env";
// import { db } from "@/server/db";
// import { UserRole } from "@prisma/client";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: DefaultSession["user"] & {
//       id: string;
//       role: UserRole; // <--- INI ADALAH BAGIAN KRITIS YANG HILANG ATAU TIDAK TERDETEKSI
//     };
//   }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  */
// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   providers: [
//     // ... (providers lainnya)
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const user = await db.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//         });

//         if (!user || !user.password) {
//           throw new Error("Invalid credentials");
//         }

//         const isPasswordValid = await compare(
//           credentials.password,
//           user.password,
//         );

//         if (!isPasswordValid) {
//           throw new Error("Invalid credentials");
//         }
        
//         // Pastikan objek user yang dikembalikan memiliki properti role
//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role, // <--- INI SANGAT PENTING
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     // Callback `jwt` untuk menambahkan role ke token JWT
//     jwt: async ({ token, user }) => {
//       if (user) {
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     // Callback `session` untuk mengambil role dari token dan menambahkannya ke sesi
//     session: ({ session, token }) => {
//       session.user.role = token.role as UserRole;
//       return session;
//     },
//   },
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import `authOptions` in every file.
//  */
// export const getServerAuthSession = (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   return getServerSession(ctx.req, ctx.res, authOptions);
// };




// src/server/auth/index.ts

import NextAuth from "next-auth"; // Import NextAuth
import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/server/db";
import { UserRole } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole; // <--- This ensures the 'role' property is recognized
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // ... (other providers)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // <--- Crucial: Return the 'role' property
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role as UserRole;
      return session;
    },
  },
};

/**
 * Generate handlers from authOptions for use in API routes.
 */
export const { handlers } = NextAuth(authOptions);