// src/server/api/routers/mom.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { MoMStatus, ActionItemStatus } from "@prisma/client";

// Skema untuk membuat Action Item baru
const createActionItemSchema = z.object({
  description: z.string(),
  deadline: z.string(),
  pic: z.string(),
});

// Skema untuk membuat MoM baru
const createMomSchema = z.object({
  clientName: z.string(),
  meetingDate: z.string(),
  discussionPoints: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(createActionItemSchema),
});

export const momRouter = createTRPCRouter({
  // Prosedur untuk membuat MoM baru
  create: protectedProcedure
    .input(createMomSchema)
    .mutation(async ({ ctx, input }) => {
      const { clientName, meetingDate, discussionPoints, decisions, actionItems } = input;
      const userId = ctx.session.user.id; // Mendapatkan ID pengguna dari sesi

      const newMom = await ctx.db.mom.create({
        data: {
          clientName,
          meetingDate: new Date(meetingDate),
          discussionPoints: discussionPoints,
          decisions: decisions,
          status: actionItems.length > 0 ? MoMStatus.ACTIVE : MoMStatus.COMPLETED,
          authorId: userId,
          actionItems: {
            create: actionItems.map((item) => ({
              description: item.description,
              deadline: new Date(item.deadline),
              pic: item.pic,
              status: ActionItemStatus.ACTIVE,
            })),
          },
        },
      });

      return newMom;
    }),

  // Prosedur untuk mendapatkan semua MoM
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.mom.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true, // Sertakan data penulis (User)
        actionItems: true, // Sertakan data action items
      },
    });
  }),

  // Prosedur untuk mendapatkan MoM berdasarkan user yang login (untuk AM)
  getMyMoMs: protectedProcedure.query(({ ctx }) => {
    return ctx.db.mom.findMany({
      where: { authorId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        actionItems: true,
      },
    });
  }),
  
  // Prosedur untuk memperbarui status Action Item
  updateActionItemStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.nativeEnum(ActionItemStatus) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.actionItem.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  // Prosedur untuk mendapatkan detail MoM
  getMoMDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.mom.findUnique({
        where: { id: input.id },
        include: {
          author: true,
          actionItems: true,
        },
      });
    }),
});