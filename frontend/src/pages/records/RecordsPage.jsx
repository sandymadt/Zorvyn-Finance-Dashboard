import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
    Plus, 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Edit2, 
    Trash2, 
    Loader2, 
    ReceiptText,
    ArrowUpCircle,
    ArrowDownCircle,
    Calendar,
    ArrowRight
} from 'lucide-react';
import clsx from 'clsx';

const RecordsPage = () => {
    const { user } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        search: ''
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchRecords();
    }, [page, filters.type, filters.category]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                ...filters
            }).toString();
            
            const response = await api.get(`/records?${queryParams}`);
            setRecords(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error('Failed to fetch records');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        
        try {
            await api.delete(`/records/${id}`);
            toast.success('Record deleted');
            fetchRecords();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete record');
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); // Reset to first page on filter change
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchRecords();
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ReceiptText className="w-8 h-8 text-primary-600" />
                        Finances & History
                    </h2>
                    <p className="text-slate-500 mt-1.5 font-medium text-sm">Detailed transaction log and financial history</p>
                </div>
                {isAdmin && (
                    <Link to="/records/new" className="btn-primary flex items-center justify-center gap-2 h-12 px-6 shadow-xl shadow-primary-600/20">
                        <Plus className="w-5 h-5" />
                        <span>New Entry</span>
                    </Link>
                )}
            </div>

            {/* Filters and Search Bar */}
            <div className="card grid grid-cols-1 md:grid-cols-4 gap-4 p-5">
                <form onSubmit={handleSearchSubmit} className="relative group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </span>
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search in notes..." 
                        className="input-field pl-11 h-11"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </form>

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <ArrowUpCircle className="w-4 h-4" />
                    </span>
                    <select 
                        name="type"
                        className="input-field pl-11 h-11 appearance-none cursor-pointer"
                        value={filters.type}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Types</option>
                        <option value="income">Income Only</option>
                        <option value="expense">Expense Only</option>
                    </select>
                </div>

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <Filter className="w-4 h-4" />
                    </span>
                    <select 
                        name="category"
                        className="input-field pl-11 h-11 appearance-none cursor-pointer"
                        value={filters.category}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Categories</option>
                        <option value="salary">Salary</option>
                        <option value="food">Health & Food</option>
                        <option value="rent">Rent / Bills</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <button 
                    onClick={fetchRecords}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                    Apply Filter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Table Area */}
            <div className="card overflow-hidden !p-0">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Date & Info</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                                <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                                {isAdmin && <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 relative">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-32">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                                            <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing transactions...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : records.length > 0 ? (
                                records.map((record) => (
                                    <tr key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-white transition-colors">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{record.note?.substring(0, 30) || 'No note attached'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3.5 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-xs font-black uppercase tracking-widest border border-primary-100">
                                                {record.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={clsx("w-2 h-2 rounded-full", record.type === 'income' ? "bg-emerald-500" : "bg-rose-500")} />
                                                <span className={clsx(
                                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                                    record.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                                )}>
                                                    {record.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={clsx("px-6 py-5 text-sm font-black text-right", record.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                                            <span className="opacity-50 mr-1">{record.type === 'income' ? '+' : '-'}</span>
                                            ₹{record.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link to={`/records/edit/${record._id}`} className="p-2.5 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 border border-slate-100 transition-all rounded-xl">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(record._id)} className="p-2.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 transition-all rounded-xl">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-32 text-center">
                                        <div className="max-w-xs mx-auto">
                                            <Loader2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transaction history discovered</p>
                                            <p className="text-slate-400 mt-2 text-sm italic">Try adjusting your filters or add a new entry.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-5 bg-slate-50/50 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Page <span className="text-slate-900 font-black">{page}</span> of <span className="text-slate-900 font-black">{totalPages || 1}</span>
                    </p>
                    <div className="flex gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordsPage;
