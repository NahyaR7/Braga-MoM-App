// Alamat File: src/app/_components/AuthProvider.tsx

"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

// Komponen ini membungkus aplikasi Anda dengan SessionProvider dari NextAuth
// agar hook seperti useSession() dapat berfungsi di sisi klien.
export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
