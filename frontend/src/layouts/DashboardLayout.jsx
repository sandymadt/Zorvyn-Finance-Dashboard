import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    ReceiptText, 
    PlusCircle, 
    LogOut, 
    Menu, 
    X,
    User as UserIcon,
    ChevronRight,
    Wallet
} from 'lucide-react';
import clsx from 'clsx';

const SidebarLink = ({ to, icon: Icon, children, currentPath, onClick }) => {
    const isActive = currentPath === to;
    return (
        <Link
            to={to}
            onClick={onClick}
            className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                isActive 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                    : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
            )}
        >
            <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
            <span>{children}</span>
            {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
        </Link>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen w-full bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Fixed to the left */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white border-r border-slate-200 transition-transform duration-300 transform lg:translate-x-0 pt-8",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo Section */}
                <div className="flex items-center gap-2 px-8 mb-10">
                    <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-600/10">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">Zorvyn <span className="text-primary-600">Finance</span></span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
                    <SidebarLink to="/" icon={LayoutDashboard} currentPath={location.pathname} onClick={() => setIsSidebarOpen(false)}>
                        Overview
                    </SidebarLink>
                    <SidebarLink to="/records" icon={ReceiptText} currentPath={location.pathname} onClick={() => setIsSidebarOpen(false)}>
                        Records
                    </SidebarLink>
                    {isAdmin && (
                        <SidebarLink to="/records/new" icon={PlusCircle} currentPath={location.pathname} onClick={() => setIsSidebarOpen(false)}>
                            Add Record
                        </SidebarLink>
                    )}
                </nav>

                {/* Profile/Logout Section */}
                <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
                    <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{user?.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-72 min-h-screen">
                {/* Header for Mobile */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md lg:hidden border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary-600" />
                        <span className="font-black text-slate-900 tracking-tight">Zorvyn</span>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 shadow-sm"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in relative">
                    <div className="mb-10 hidden lg:block">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {location.pathname === '/' ? 'Dashboard Overview' : 
                             location.pathname.includes('/records/new') ? 'New Transaction' :
                             location.pathname.includes('/records/edit') ? 'Modify Transaction' :
                             location.pathname.includes('/records') ? 'Records & Audit' : 'Finance Center'}
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">✨ Welcome back, {user?.name}. Manage your assets with precision.</p>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
