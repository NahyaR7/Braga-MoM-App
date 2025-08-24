// Alamat File: src/server/auth/index.ts

import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth"; // 1. Impor yang lebih lengkap
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { db } from "@/server/db";
import { UserRole } from "@prisma/client";
import { env } from "@/env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }
  interface User {
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
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
        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  // 2. Callback disederhanakan untuk strategi "database"
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
  session: {
    strategy: "database", // Menggunakan strategi database karena ada adapter
  },
  secret: env.AUTH_SECRET,
};

// 3. Ekspor handlers, auth, dll dari NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// 4. Helper untuk mendapatkan sesi di Server Components
export const getServerAuthSession = () => auth();