import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarHeight, setTopbarHeight] = useState(56); // default fallback (14 * 4 = 56px)

  useEffect(() => {
    if (topbarRef.current) {
      const observer = new ResizeObserver(() => {
        setTopbarHeight(topbarRef.current?.offsetHeight || 56);
      });
      observer.observe(topbarRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="flex">


        {/* Scrollable content with dynamic topbar offset */}
        <main
          className="transition-all overflow-y-auto min-h-screen bg-budgenix-gradient"
          style={{ paddingTop: `${topbarHeight}px` }}
        >
          <Outlet />
        </main>
      </div>
  );
}
