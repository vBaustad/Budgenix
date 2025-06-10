import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';


export default function AppLayout() {
    return (
        <div className="flex">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main section */}
            <div className="flex-1 lg:pl-62 bg-budgenix-gradient">
                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:pl-64 z-40">
                    <Topbar />
                </div>
                {/* Scrollable content below topbar */}
                <main className="pt-14 min-h-screen overflow-y-auto bg-budgenix-gradient transition-all">
                    <Outlet /> {/* Here your pages render */}
                </main>
            </div>
        </div>
    );
}
