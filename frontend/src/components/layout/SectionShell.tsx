import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SectionShellProps = {
  title?: string;
  icon?: LucideIcon;
  refreshable?: boolean;
  className?: string;
  children: ReactNode;
};

export default function SectionShell({
  title = '',
  icon,
  refreshable = false,
  className = '',
  children,
}: SectionShellProps) {
  const Icon = icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full bg-base-100 p-4 rounded-2xl shadow-md m-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl text-primary font-semibold flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" aria-hidden="true" />}
          <span>{title}</span>
        </h2>

        {refreshable && (
          <button
            className="btn btn-sm btn-ghost hover:bg-primary/10 hover:text-primary"
            onClick={() => window.location.reload()}
            aria-label="Refresh section"
            title="Refresh"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div>{children}</div>
    </motion.section>
  );
}
