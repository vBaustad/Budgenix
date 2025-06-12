import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 lg:pl-64 bg-budgenix-gradient">
        {/* Topbar */}
        <div ref={topbarRef} className="fixed top-0 right-0 lg:left-64 z-40">
          <Topbar />
        </div>

        {/* Scrollable content with dynamic topbar offset */}
        <main
          className="transition-all overflow-y-auto min-h-screen bg-budgenix-gradient"
          style={{ paddingTop: `${topbarHeight}px` }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
