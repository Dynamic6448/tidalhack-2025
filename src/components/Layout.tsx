// components/Layout.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Plane, AlertTriangle, Upload, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
<<<<<<< Updated upstream
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/aircraft/AC001', icon: Plane, label: 'Aircraft' },
=======
        { path: '/aircraft', icon: Plane, label: 'Aircraft' },
>>>>>>> Stashed changes
        { path: '/anomalies', icon: AlertTriangle, label: 'Anomalies' },
        { path: '/upload', icon: Upload, label: 'Upload' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-slate-200 fixed w-full z-30 top-0">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            <div className="flex items-center ml-2 lg:ml-0">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Plane className="w-6 h-6 text-white" />
                                </div>
                                <span className="ml-3 text-xl font-bold text-slate-800">SkyLog</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:block text-sm text-slate-600">v1.0.0</div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-full bg-white border-r border-slate-200 w-64 transform transition-transform duration-200 ease-in-out z-20 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            location.pathname === item.path ||
                            (item.path.includes('/aircraft') && location.pathname.includes('/aircraft'));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 pt-16 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
