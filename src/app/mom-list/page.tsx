// src/app/mom-list/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter as FilterIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Asumsi tipe data MoM
// Anda bisa mendapatkan tipe data ini dari tRPC Anda,
// misalnya dari file src/server/api/routers/mom.ts
interface MoM {
    id: string;
    // ... properti lainnya sesuai dengan data yang Anda ambil
    author: {
        name: string | null;
        id: string;
        email: string | null;
        role: string;
    };
    actionItems: any[]; // Sesuaikan dengan tipe yang benar
    // Tambahkan properti lain yang ada di objek MoM
}

export default function MomListPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status !== 'authenticated') {
        return <div className="text-white text-center">Memuat autentikasi...</div>;
    }

    const isHeadOfSales = session?.user?.role === 'HEAD_OF_SALES';

    const { data: moMs, isLoading, error } = isHeadOfSales ? api.mom.getAll.useQuery() : api.mom.getMyMoMs.useQuery();
    const { data: allUsersData, isLoading: isUsersLoading } = api.user.getAll.useQuery();

    // Perbaikan: Berikan tipe data eksplisit ke useState
    const [filteredMoMs, setFilteredMoMs] = useState<MoM[]>([]);
    const [filter, setFilter] = useState({ client: '', amName: '', date: '' });
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (!moMs) return;
        
        // Logika filtering Anda yang sudah ada
        let tempMoMs = moMs;
        setFilteredMoMs(tempMoMs);
    }, [filter, moMs]);

    const handleViewDetails = (mom: MoM) => {
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