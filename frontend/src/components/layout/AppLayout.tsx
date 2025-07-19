import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { SystemNotificationModal } from '@/modules/systemNotifications/components/SystemNotificationModal';


export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('budgenix_sidebar_open');
      return stored === null ? true : stored === 'true';
    }
    return true;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // ← Add this


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('budgenix_sidebar_open', sidebarOpen.toString());
    }
  }, [sidebarOpen]);


  return (
    <div className="w-full min-h-screen flex overflow-x-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-16'
        }`}
      >
        <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />

        <div className="flex-1 bg-base-100 overflow-hidden">
          <main>
            <SystemNotificationModal />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
