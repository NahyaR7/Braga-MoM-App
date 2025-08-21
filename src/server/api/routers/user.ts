// src/server/api/routers/user.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;
      const hashedPassword = await hash(password, 10);

      // Cek apakah email sudah terdaftar
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new Error("Email sudah terdaftar.");
      }

      const newUser = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword, // Simpan password yang sudah di-hash
          role: UserRole.AM, // Default role untuk pengguna baru
        },
      });

      return newUser;
    }),
});