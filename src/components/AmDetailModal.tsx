// src/components/AmDetailModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';

const AmDetailModal = ({ am, onClose }) => {
  return (
    <Dialog open={!!am} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{am?.name}'s Details</DialogTitle>
        </DialogHeader>
        <div className="text-white">
          {/* Konten modal untuk detail AM */}
          <p>Ini adalah modal detail untuk Account Manager.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AmDetailModal;