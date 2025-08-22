// src/app/mom-list/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter as FilterIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MomListPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect jika belum terautentikasi atau masih memuat
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Jika sesi belum tersedia, tampilkan loading atau null untuk mencegah error
  if (status !== 'authenticated') {
    return <div className="text-white text-center">Memuat autentikasi...</div>;
  }

  // Sekarang aman untuk mengakses `session.user`
  // asumsikan file auth Anda sudah diperbaiki untuk menyertakan `role`
  const isHeadOfSales = session?.user?.role === 'HEAD_OF_SALES';

  const { data: moMs, isLoading, error } = isHeadOfSales ? api.mom.getAll.useQuery() : api.mom.getMyMoMs.useQuery();
  const { data: allUsersData, isLoading: isUsersLoading } = api.user.getAll.useQuery();

  const [filteredMoMs, setFilteredMoMs] = useState([]);
  const [filter, setFilter] = useState({ client: '', amName: '', date: '' });
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!moMs) return;
    
    // Logika filtering Anda yang sudah ada
    let tempMoMs = moMs;
    setFilteredMoMs(tempMoMs);
  }, [filter, moMs]);

  const handleViewDetails = (mom) => {
    router.push(`/mom-detail/${mom.id}`);
  };

  if (isLoading || isUsersLoading) return <div className="text-white text-center">Memuat data...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Tambahkan elemen untuk tabel atau daftar MoM di sini */}
      <h1>Daftar MoM</h1>
    </div>
  );
}


    // ... sisa kode lainnya (tampilan tabel(masukkan ke dalam return ()))