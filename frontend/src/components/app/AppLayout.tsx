import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar'; // add your Topbar here

type AppLayoutProps = {
    children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex bg-base-100 text-base-content">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main section */}
            <div className="flex-1 lg:pl-72">
                {/* Fixed Topbar */}
                <div className="fixed top-0 right-0 left-0 lg:left-72 z-40">
                    <Topbar />
                </div>

                {/* Scrollable content below topbar */}
                <main className="pt-14 min-h-screen overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
