// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }


// src/lib/utils.ts

// Helper function untuk memformat tanggal
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi simulasi AI untuk memproses teks MoM
export const processMoMText = (text) => {
  const parts = text.split('\n');
  const who = parts.find(p => p.toLowerCase().startsWith('who:'))?.substring(4).trim() || 'Tidak Diketahui';
  const when = parts.find(p => p.toLowerCase().startsWith('when:'))?.substring(5).trim() || formatDate(new Date());
  const discussionPoints = parts.filter(p => p.toLowerCase().startsWith('poin:'))
    .map(p => p.substring(5).trim());
  const decisions = parts.filter(p => p.toLowerCase().startsWith('keputusan:'))
    .map(p => p.substring(10).trim());
  const actionItems = parts.filter(p => p.toLowerCase().startsWith('ai:'))
    .map(p => {
      const match = p.match(/ai: (.+?) \(pic: (.+?), deadline: (.+?)\)/i);
      return match ? { description: match[1], pic: match[2], deadline: match[3], status: 'Aktif' } : null;
    }).filter(item => item !== null);

  return {
    who,
    when,
    discussionPoints,
    decisions,
    actionItems,
  };
};