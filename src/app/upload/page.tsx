// src/app/upload/page.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { processMoMText } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';

export default function UploadMoMPage() {
  const [meetingNotes, setMeetingNotes] = useState('');
  const [structuredMoM, setStructuredMoM] = useState(null);
  const [clientName, setClientName] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();

  const createMom = api.mom.create.useMutation({
    onSuccess: () => {
      alert("MoM berhasil disimpan!");
      router.push('/mom-list');
    },
    onError: (err) => {
      alert('Gagal menyimpan MoM: ' + err.message);
    },
  });

  const handleProcessNotes = () => {
    // ... kode yang sama
  };

  const handleSaveMoM = () => {
    if (structuredMoM && clientName && status === 'authenticated') {
      const actionItems = structuredMoM.actionItems.map(item => ({
        description: item.description,
        pic: item.pic,
        deadline: item.deadline,
      }));

      createMom.mutate({
        clientName: clientName,
        meetingDate: new Date().toISOString(),
        discussionPoints: structuredMoM.discussionPoints,
        decisions: structuredMoM.decisions,
        actionItems: actionItems,
      });
    } else {
      alert('Mohon isi nama klien dan proses catatan rapat terlebih dahulu.');
    }
  };

  // ... sisa kode lainnya
}