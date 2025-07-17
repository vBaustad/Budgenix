import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex overflow-x-hidden bg-primary">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Right side */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content wrapper with rounded top-left */}
        <div className="flex-1 bg-base-100 lg:rounded-tl-3xl shadow-md overflow-hidden border-l border-base-300">
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
