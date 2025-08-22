// // src/app/api/auth/[...nextauth]/route.ts

// import NextAuth from "next-auth";
// import { authOptions } from "@/server/auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };





// src/app/api/auth/[...nextauth]/route.ts

import { handlers } from "@/server/auth"; // Correct import path

export const { GET, POST } = handlers;