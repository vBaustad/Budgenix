import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AppIcons } from '../icons/AppIcons';

type SectionShellProps = {
  title?: string;
  titleTextColor?: string;
  icon?: LucideIcon;
  iconColor?: string;
  background?: string;  
  refreshable?: boolean;
  minimizable?: boolean;
  className?: string;
  children: ReactNode;
  extraHeaderContent?: React.ReactNode;
};

export default function SectionShell({
  title = '',
  titleTextColor = 'text-primary',
  icon,
  iconColor = 'text-primary',
  background = 'bg-base-100',  
  refreshable = false,
  minimizable = false,
  className = '',
  children,
  extraHeaderContent = null,
}: SectionShellProps) {
  const Icon = icon;
  const [isMinimized, setIsMinimized] = useState(false);
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${background} p-2 rounded-2xl shadow-md m-2 ${className}`}
    >
      <div className="flex items-center justify-between min-h-[2.5rem]">
        <h2 className={`text-xl ${titleTextColor} font-semibold flex items-center gap-2`}>
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />}
          <span>{title}</span>
        </h2>
        <div className="flex items-center gap-2">
          {extraHeaderContent}
          {refreshable && (
          <button
            className={`btn btn-sm btn-ghost hover:bg-primary/10 hover:${titleTextColor}`}
            onClick={() => window.location.reload()}
            aria-label="Refresh section"
            title="Refresh"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
        {minimizable && (
          <button
            className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary"
            onClick={() => setIsMinimized((prev: boolean) => !prev)}
            aria-label={isMinimized ? 'Expand section' : 'Minimize section'}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <AppIcons.down /> : <AppIcons.up />}
          </button>
        )}
        </div>
        
      </div>

      <div>{children}</div>
    </motion.section>
  );
}
