// src/components/StatCard.tsx

import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils'; // Anda mungkin harus menggantinya dengan '~/lib/utils'

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn('flex items-center space-x-4 p-6 shadow-md', color)}>
        <div className="rounded-full p-3 bg-white bg-opacity-20">{icon}</div>
        <CardContent className="p-0 flex flex-col justify-center">
          <h3 className="text-white text-sm font-medium">{title}</h3>
          <p className="text-white text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;