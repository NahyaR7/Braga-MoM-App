// src/app/dashboard/page.tsx

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/StatCard';
import { Users as UsersIcon, ClipboardCheck as ClipboardCheckIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { api, type RouterOutputs } from '@/trpc/react'; // Import RouterOutputs

export default function AmDashboard() {
  const { data: moMs, isLoading, error } = api.mom.getMyMoMs.useQuery();
  const { mutate: updateStatus } = api.mom.updateActionItemStatus.useMutation();

  if (isLoading) return <div className="text-white text-center">Memuat data...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;
  if (!moMs) return null;

  // Mendefinisikan tipe data untuk MoM yang diambil dari TRPC
  // Ini adalah solusi untuk error 'implicitly has an 'any' type'
  type MoMWithActionItems = RouterOutputs['mom']['getMyMoMs'][number];

  const amMoMs: MoMWithActionItems[] = moMs;
  const totalMeetings = amMoMs.length;
  
  // TypeScript sekarang tahu bahwa m memiliki properti actionItems
  const allActionItems = amMoMs.flatMap(m => m.actionItems);
  
  const activeActionItems = allActionItems.filter(ai => ai.status === 'ACTIVE').length;
  const nearingDeadlineItems = allActionItems.filter(
    ai => ai.status === 'ACTIVE' && new Date(ai.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleUpdateActionItemStatus = (actionItemId: string, newStatus: string) => {
    updateStatus({ id: actionItemId, status: newStatus });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard AM</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard
          title="Rapat Bulan Ini"
          value={totalMeetings}
          icon={<UsersIcon className="h-6 w-6 text-white" />}
          color="border-l-[#F66B34] bg-[#F66B34]"
        />
        <StatCard
          title="Action Item Aktif"
          value={activeActionItems}
          icon={<ClipboardCheckIcon className="h-6 w-6 text-white" />}
          color="border-l-[#F2D639] bg-[#F2D639]"
        />
      </div>
      {/* ... sisa kode lainnya (Action Item Mendekati Deadline, Action Item Lists) */}
    </motion.div>
  );
}