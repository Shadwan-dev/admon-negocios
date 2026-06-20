import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/formatters';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

export const Card = ({ children, className, hover = false, animate = false }: CardProps) => {
  const Component = animate ? motion.div : 'div';
  
  return (
    <Component
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      })}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200',
        hover && 'hover:shadow-md hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </Component>
  );
};