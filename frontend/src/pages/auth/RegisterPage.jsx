import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, Wallet, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('viewer');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (name.trim().length < 2) {
            return toast.error('Full name must be at least 2 characters long');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters long');
        }

        setIsLoading(true);
        const result = await register({ name: name.trim(), email: email.trim(), password, role });
        setIsLoading(false);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.message || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans">
            {/* Left Section - Hero/Branding */}
            <div className="hidden lg:flex flex-col justify-center px-20 bg-primary-600 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl" />

                <div className="relative z-10 max-w-lg">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl w-fit mb-8 shadow-2xl border border-white/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight">Secure Your <span className="text-primary-200">Future</span>.</h2>
                    <p className="text-primary-100 mt-6 text-lg leading-relaxed">
                        Start your journey with Zorvyn. Manage your assets, track every penny, and generate professional reports in seconds.
                    </p>
                    
                    <div className="mt-12 grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                            <p className="text-3xl font-black text-white">$2.5B+</p>
                            <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mt-1">Managed Daily</p>
                        </div>
                        <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                            <p className="text-3xl font-black text-white">99.9%</p>
                            <p className="text-xs font-bold text-primary-200 uppercase tracking-widest mt-1">System Uptime</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Signup Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-white lg:bg-slate-50/20 py-16">
                <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center mb-8">
                         <div className="lg:hidden p-3 bg-primary-50 rounded-2xl w-fit mx-auto mb-6">
                            <Wallet className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
                        <p className="text-slate-500 mt-2 font-medium">Join our community of elite investors</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div>
                            <label className="label-text">Full Legal Name</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <UserIcon className="w-4 h-4" />
                                </span>
                                <input 
                                    type="text" 
                                    className="input-field pl-11 h-12"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label-text">Business Email</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                    type="email" 
                                    className="input-field pl-11 h-12"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label-text">Define Role</label>
                            <select 
                                className="input-field h-12"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="viewer">Viewer (Read-only)</option>
                                <option value="analyst">Analyst (View Stats)</option>
                                <option value="admin">Admin (Full Control)</option>
                            </select>
                            <p className="mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Note: Roles define your platform permissions</p>
                        </div>

                        <div>
                            <label className="label-text">Secure Password</label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                    type="password" 
                                    className="input-field pl-11 h-12"
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn-primary w-full h-12 flex items-center justify-center gap-2 mt-4 text-base tracking-wide"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Free Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-slate-100 w-full text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline underline-offset-4 decoration-2">
                                Sign In Instead
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-xs text-slate-400 font-medium">© 2026 Zorvyn Finance. All rights reserved.</p>
            </div>
        </div>
    );
};

export default RegisterPage;
