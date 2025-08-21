// src/app/hos-dashboard/page.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '@/components/StatCard';
import CalendarView from '@/components/CalendarView';
import AmDetailModal from '@/components/AmDetailModal';
import { Users as UsersIcon, Briefcase as BriefcaseIcon, ClipboardCheck as ClipboardCheckIcon, List as ListIcon, Calendar as CalendarIcon } from 'lucide-react';
import { api } from '@/trpc/react';

export default function HosDashboard() {
  const [selectedAm, setSelectedAm] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const { data: moMs, isLoading: isMoMsLoading } = api.mom.getAll.useQuery();
  const { data: allUsers, isLoading: isUsersLoading } = api.user.getAll.useQuery();

  if (isMoMsLoading || isUsersLoading) return <div className="text-white text-center">Memuat data...</div>;
  if (!moMs || !allUsers) return null;

  const totalAm = allUsers.filter(u => u.role === 'AM').length;
  const totalMeetings = moMs.length;
  const totalActiveActionItems = moMs.flatMap(m => m.actionItems).filter(ai => ai.status === 'ACTIVE').length;

  const onOpenAmDetail = (am) => setSelectedAm(am);

  const onOpenMomDetail = (mom) => {
    // ... logika navigasi
  };

  return ();
}

    // ... sisa kode lainnya (tampilan dashboard(masukkan di dalam return())));