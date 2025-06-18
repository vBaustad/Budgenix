import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 lg:pl-64 bg-budgenix-gradient">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="transition-all overflow-y-auto min-h-screen bg-budgenix-gradient w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
