import Sidebar from './Sidebar';
import Topbar from './Topbar'; // add your Topbar here
import { Outlet } from 'react-router-dom';


export default function AppLayout() {
    return (
        <div className="flex bg-base-200 text-base-content">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main section */}
            <div className="flex-1 lg:pl-72 bg-base-200">
                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:left-72 z-40">
                    <Topbar />
                </div>
                {/* Scrollable content below topbar */}
                <main className="pt-14 min-h-screen overflow-y-auto">
                    <Outlet /> {/* Here your pages render */}
                </main>
            </div>
        </div>
    );
}
