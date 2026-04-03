import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    PieChart as PieIcon, 
    BarChart3, 
    ArrowUpRight, 
    ArrowDownRight,
    Loader2,
    Calendar,
    Activity
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import clsx from 'clsx';

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

const SummaryCard = ({ title, amount, type, icon: Icon, percentage }) => {
    const isIncome = type === 'income';
    const isExpense = type === 'expense';
    const isBalance = type === 'balance';

    return (
        <div className="card group relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
                        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    <div className="mt-4 flex items-center gap-2">
                        <span className={clsx(
                            "flex items-center text-xs font-black px-2 py-1 rounded-lg",
                            isIncome ? "bg-emerald-50 text-emerald-600" : 
                            isExpense ? "bg-rose-50 text-rose-600" : "bg-primary-50 text-primary-600"
                        )}>
                            {isIncome ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                             isExpense ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <Activity className="w-3 h-3 mr-1" />}
                            {percentage}%
                        </span>
                        <span className="text-xs font-bold text-slate-400">vs last month</span>
                    </div>
                </div>
                <div className={clsx(
                    "p-4 rounded-2xl shadow-sm border transition-transform group-hover:scale-110 duration-300",
                    isIncome ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                    isExpense ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-primary-50 border-primary-100 text-primary-600"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {/* Background Decoration */}
            <div className={clsx(
                "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20",
                isIncome ? "bg-emerald-400" : isExpense ? "bg-rose-400" : "bg-primary-400"
            )} />
        </div>
    );
};

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await api.get('/dashboard/summary');
            setSummary(response.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-primary-100 rounded-full" />
                </div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Crunching your data...</p>
            </div>
        );
    }

    const { totalIncome, totalExpenses, netBalance } = summary?.summary || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    
    // Prepare data for bar chart
    const barData = [
        { name: 'Income', amount: totalIncome },
        { name: 'Expenses', amount: totalExpenses }
    ];

    // Prepare data for pie chart
    const pieData = summary?.categoryBreakdown?.map(item => ({
        name: `${item._id.category} (${item._id.type})`,
        value: item.total
    })) || [];

    return (
        <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-10">
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <SummaryCard 
                    title="Total Income" 
                    amount={totalIncome} 
                    type="income" 
                    icon={TrendingUp} 
                    percentage={12.5} 
                />
                <SummaryCard 
                    title="Total Expenses" 
                    amount={totalExpenses} 
                    type="expense" 
                    icon={TrendingDown} 
                    percentage={4.2} 
                />
                <SummaryCard 
                    title="Net Balance" 
                    amount={netBalance} 
                    type="balance" 
                    icon={Wallet} 
                    percentage={8.1} 
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
                {/* Bar Chart - Comparison */}
                <div className="lg:col-span-3 card h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-600" />
                                Growth Analysis
                            </h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Income vs Expenditures</p>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl">
                             <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        padding: '12px 16px'
                                    }}
                                />
                                <Bar 
                                    dataKey="amount" 
                                    radius={[10, 10, 0, 0]} 
                                    barSize={60}
                                >
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Breakdown */}
                <div className="lg:col-span-2 card h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-primary-600" />
                                Allocation
                            </h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Category Distribution</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                         contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                        }}
                                    />
                                    <Legend 
                                        layout="horizontal" 
                                        verticalAlign="bottom" 
                                        align="center"
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 font-medium text-sm italic">
                                No data available for breakdown
                            </div>
                        )}
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-6">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Total</p>
                            <p className="text-xl font-black text-slate-900">₹{(totalIncome + totalExpenses).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="card overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Your last 5 transactions</p>
                    </div>
                    <Link to="/records" className="text-xs sm:text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 sm:px-4 py-2 rounded-xl transition-colors whitespace-nowrap">
                        View All
                    </Link>
                </div>

                {/* Mobile card list */}
                <div className="sm:hidden space-y-3">
                    {summary?.recentRecords?.map((record) => (
                        <div key={record._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                    record.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'
                                )}>
                                    <span className={clsx("w-2 h-2 rounded-full", record.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500')} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700 uppercase tracking-wide">{record.category}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{new Date(record.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <p className={clsx("text-sm font-black", record.type === 'income' ? 'text-emerald-600' : 'text-rose-600')}>
                                {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString('en-IN')}
                            </p>
                        </div>
                    ))}
                    {(!summary?.recentRecords || summary.recentRecords.length === 0) && (
                        <p className="text-center text-slate-400 italic text-sm py-6">No recent transactions found.</p>
                    )}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-y border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Type</th>
                                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {summary?.recentRecords?.map((record) => (
                                <tr key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-600">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                                            {record.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            record.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            <span className={clsx("w-1.5 h-1.5 rounded-full", record.type === 'income' ? "bg-emerald-500" : "bg-rose-500")} />
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className={clsx(
                                        "px-6 py-4 text-sm font-black text-right",
                                        record.type === 'income' ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                            {(!summary?.recentRecords || summary.recentRecords.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic text-sm">
                                        No recent transactions found. Start by adding a new record!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
