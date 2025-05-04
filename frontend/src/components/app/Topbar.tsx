import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
    const { logout } = useAuth();

    return (
        <div className="flex justify-between items-center bg-gray-800 p-4 border-b border-gray-700">
            <h1 className="text-lg font-bold">Dashboard</h1>
            <button
                onClick={logout}
                className="bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded text-sm font-semibold">
                Log Out
            </button>
        </div>
    );
}
