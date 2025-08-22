// src/app/login/page.tsx
// Halaman Login & Daftar Akun

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const { status } = useSession();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      alert("Akun berhasil dibuat. Silakan login.");
      setIsLoginMode(true);
      setError('');
    },
    onError: (err) => {
      setError(err.message || 'Gagal membuat akun.');
    },
  });

  // FIX: Tambahkan tipe `React.FormEvent<HTMLFormElement>` pada parameter `e`
  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Email atau password salah.');
      } else {
        router.push('/dashboard');
      }
    } else {
      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        return;
      }
      createUser.mutate({ name, email, password });
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#5D697A] flex items-center justify-center">Loading...</div>;
  }
  
  if (status === 'authenticated') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#5D697A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#383838]">
            {isLoginMode ? 'Selamat Datang' : 'Daftar Akun'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLoginMode ? 'Masuk ke dashboard Anda' : 'Buat akun baru untuk memulai'}
          </p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLoginMode && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-[#383838]">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F66B34] focus:border-[#F66B34]"
                  placeholder="Nama Lengkap"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <label className="block text-sm font-medium text-[#383838]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F66B34] focus:border-[#F66B34]"
              placeholder="email@sales.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#383838]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#F66B34] focus:border-[#F66B34]"
              placeholder="password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F66B34] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F66B34]"
          >
            {isLoginMode ? 'Login' : 'Daftar'}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          {isLoginMode ? (
            <p>Belum punya akun? <span onClick={() => setIsLoginMode(false)} className="text-[#F66B34] hover:underline cursor-pointer">Daftar sekarang</span></p>
          ) : (
            <p>Sudah punya akun? <span onClick={() => setIsLoginMode(true)} className="text-[#F66B34] hover:underline cursor-pointer">Login</span></p>
          )}
        </div>
      </motion.div>
    </div>
  );
};