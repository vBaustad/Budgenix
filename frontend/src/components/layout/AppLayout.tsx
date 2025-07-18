import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // ← Add this

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
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
