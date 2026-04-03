import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
    ChevronLeft, 
    Save, 
    X, 
    Loader2, 
    IndianRupee, 
    Calendar, 
    AlignLeft, 
    Layers, 
    TrendingUp,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const RecordForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: '',
        type: 'expense',
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            fetchRecord();
        }
    }, [id]);

    const fetchRecord = async () => {
        setIsFetching(true);
        try {
            const response = await api.get(`/records/${id}`);
            const data = response.data.data;
            setFormData({
                amount: data.amount,
                type: data.type,
                category: data.category,
                date: new Date(data.date).toISOString().split('T')[0],
                note: data.note || ''
            });
        } catch (error) {
            toast.error('Failed to load record details');
            navigate('/records');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (user?.role !== 'admin') {
            return toast.error('Unauthorized: Only admins can perform this action');
        }

        setIsLoading(true);
        try {
            if (isEdit) {
                await api.put(`/records/${id}`, formData);
                toast.success('Transaction updated');
            } else {
                await api.post('/records', formData);
                toast.success('Entry added successfully');
            }
            navigate('/records');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Retrieving record audit...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <div>
                     <Link to="/records" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm group transition-all">
                        <div className="p-1 bg-white border border-slate-200 rounded-lg group-hover:border-primary-200 group-hover:bg-primary-50">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to Ledger
                    </Link>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-4">
                        {isEdit ? 'Modify Entry' : 'New Transaction'}
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Fill in the metrics for your financial record</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 card p-6 sm:p-10 !rounded-[24px] sm:!rounded-[32px] shadow-2xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="label-text">Transactional Amount</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                            <IndianRupee className="w-4 h-4" />
                                        </div>
                                        <input 
                                            type="number" 
                                            name="amount"
                                            className="input-field pl-12 h-14 text-lg font-black"
                                            placeholder="00.00"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            min="0.01"
                                            step="0.01"
                                        />
                                    </div>
                                    <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entry will be logged in INR currency</p>
                                </div>

                                <div>
                                    <label className="label-text">Accounting Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            className={clsx(
                                                "h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-black transition-all",
                                                formData.type === 'income' 
                                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10" 
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                            )}
                                            onClick={() => setFormData({...formData, type: 'income'})}
                                        >
                                            <TrendingUp className="w-4 h-4" />
                                            Credit / Income
                                        </button>
                                        <button
                                            type="button"
                                            className={clsx(
                                                "h-14 rounded-2xl border-2 flex items-center justify-center gap-2 font-black transition-all",
                                                formData.type === 'expense' 
                                                    ? "bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-500/10" 
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                            )}
                                            onClick={() => setFormData({...formData, type: 'expense'})}
                                        >
                                            <AlignLeft className="w-4 h-4" />
                                            Debit / Expense
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="label-text">Category Classification</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                        <select 
                                            name="category"
                                            className="input-field pl-12 h-14 appearance-none cursor-pointer font-bold"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="salary">Salary / Earnings</option>
                                            <option value="food">Health & Food</option>
                                            <option value="rent">Rent / Property</option>
                                            <option value="entertainment">Entertainment</option>
                                            <option value="travel">Logistics / Travel</option>
                                            <option value="other">Miscellaneous</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label-text">Effective Date</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input 
                                            type="date" 
                                            name="date"
                                            className="input-field pl-12 h-14 font-bold"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="label-text">Audit Narrative / Note</label>
                            <textarea 
                                name="note"
                                className="input-field min-h-[150px] p-5 !rounded-3xl resize-none text-base"
                                placeholder="Describe the purpose of this transaction..."
                                value={formData.note}
                                onChange={handleChange}
                                maxLength={200}
                            />
                            <p className="mt-2 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.note.length}/200</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="btn-primary h-12 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-3 text-base sm:text-lg shadow-2xl shadow-primary-600/30"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        {isEdit ? 'Finalize Changes' : 'Execute Entry'}
                                    </>
                                )}
                            </button>
                            <Link 
                                to="/records" 
                                className="h-14 px-8 flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info Section */}
                <div className="space-y-6">
                    <div className="card !bg-primary-900 border-none p-8 !rounded-[32px] text-white">
                        <ShieldAlert className="w-10 h-10 text-primary-400 mb-6" />
                        <h4 className="text-xl font-black tracking-tight mb-4">Audit Transparency</h4>
                        <p className="text-primary-100 text-sm leading-relaxed mb-6 font-medium">
                            Every accounting entry is indexed and timestamped with your user ID. Inaccurate data can lead to skewed analytics on your dashboard.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Ensure amount precision',
                                'Classify correct category',
                                'Review before submitting'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-primary-300 uppercase tracking-widest">
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordForm;
