import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/formatters';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  bg: string;
  index: number;
}

export const MetricCard = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  bg,
  index
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-lg', bg)}>
          <span className={cn('w-6 h-6', color)}>{icon}</span>
        </div>
        <span className={cn(
          'text-sm font-medium',
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        )}>
          {change}
          {trend === 'up' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );
};