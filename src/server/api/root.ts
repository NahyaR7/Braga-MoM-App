// src/server/api/routers/root.ts

import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { momRouter } from "@/server/api/routers/mom";
import { userRouter } from "@/server/api/routers/user";

export const appRouter = createTRPCRouter({
  post: postRouter,
  mom: momRouter,
  user: userRouter, // Tambahkan router user di sini
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);



// // import { postRouter } from "~/server/api/routers/post";
// // import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

// // /**
// //  * This is the primary router for your server.
// //  *
// //  * All routers added in /api/routers should be manually added here.
// //  */
// // export const appRouter = createTRPCRouter({
// //   post: postRouter,
// // });

// // // export type definition of API
// // export type AppRouter = typeof appRouter;

// // /**
// //  * Create a server-side caller for the tRPC API.
// //  * @example
// //  * const trpc = createCaller(createContext);
// //  * const res = await trpc.post.all();
// //  *       ^? Post[]
// //  */
// // export const createCaller = createCallerFactory(appRouter);


// // src/server/api/root.ts

// import { momRouter } from "~/server/api/routers/mom"; // <-- Panggil buku resep MoM kita
// import { createTRPCRouter } from "~/server/api/trpc";

// /**
//  * Ini adalah "Menu Utama" restoran kita.
//  * Semua buku resep harus didaftarkan di sini.
//  */
// export const appRouter = createTRPCRouter({
//   mom: momRouter, // <-- "Tolong tambahkan semua resep dari buku MoM ke menu utama kita."
// });

// export type AppRouter = typeof appRouter;