// src/app/hos-dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '@/components/StatCard';
import CalendarView from '@/components/CalendarView';
import AmDetailModal from '@/components/AmDetailModal';
import { Users as UsersIcon, Briefcase as BriefcaseIcon, ClipboardCheck as ClipboardCheckIcon, List as ListIcon, Calendar as CalendarIcon } from 'lucide-react';
import { api, type RouterOutputs } from '@/trpc/react'; // Pastikan RouterOutputs diimpor

export default function HosDashboard() {
  const [selectedAm, setSelectedAm] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  // Menggunakan useSuspenseQuery untuk fetching data
  const { data: moMs, isLoading: isMoMsLoading } = api.mom.getAll.useQuery();
  const { data: allUsers, isLoading: isUsersLoading } = api.user.getAll.useQuery();

  if (isMoMsLoading || isUsersLoading) return <div className="text-white text-center">Memuat data...</div>;
  if (!moMs || !allUsers) return null;

  // Definisikan tipe data untuk MoM dan User
  type AllMoMs = RouterOutputs['mom']['getAll'];
  type AllUsers = RouterOutputs['user']['getAll'];

  // Terapan tipe data pada variabel
  const totalAm = (allUsers as AllUsers).filter(u => u.role === 'AM').length;
  const totalMeetings = (moMs as AllMoMs).length;
  const totalActiveActionItems = (moMs as AllMoMs).flatMap(m => m.actionItems).filter(ai => ai.status === 'ACTIVE').length;

  const onOpenAmDetail = (am: any) => setSelectedAm(am); // Tambahkan tipe 'any' sementara jika struktur belum final

  const onOpenMomDetail = (mom: any) => {
    // ... logika navigasi
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard Head of Sales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Account Managers"
          value={totalAm}
          icon={<UsersIcon size={24} />}
          color="bg-indigo-600"
        />
        <StatCard 
          title="Total Rapat (MoM)"
          value={totalMeetings}
          icon={<BriefcaseIcon size={24} />}
          color="bg-green-600"
        />
        <StatCard 
          title="Action Items Aktif"
          value={totalActiveActionItems}
          icon={<ClipboardCheckIcon size={24} />}
          color="bg-yellow-600"
        />
        {/* Tambahkan StatCard lain sesuai kebutuhan */}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tampilan Rapat</h2>
        <div className="space-x-2">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-500' : 'bg-gray-700'}`}
          >
            <ListIcon size={20} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-md ${viewMode === 'calendar' ? 'bg-indigo-500' : 'bg-gray-700'}`}
          >
            <CalendarIcon size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h3 className="text-xl font-medium mb-4">Daftar Rapat</h3>
              {/* Tempat untuk tabel daftar MoM */}
              <div className="text-center text-gray-400">Tabel MoM akan ditampilkan di sini</div>
            </div>
          )}
          {viewMode === 'calendar' && (
            <CalendarView moMs={moMs} onOpenMomDetail={onOpenMomDetail} />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedAm && (
          <AmDetailModal
            am={selectedAm}
            onClose={() => setSelectedAm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}