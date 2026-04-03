import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, ArrowRight, Wallet } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            toast.success('Login successful!');
            navigate('/');
        } else {
            toast.error(result.message);
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
                        <Wallet className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight">Master Your <span className="text-primary-200">Finances</span> Today.</h2>
                    <p className="text-primary-100 mt-6 text-lg leading-relaxed">
                        Join thousands of smart investors using Zorvyn to track, analyze, and grow their wealth with our modern financial analytics platform.
                    </p>
                    
                    <div className="mt-12 flex items-center gap-6 p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-primary-300 border-2 border-primary-600 flex items-center justify-center text-primary-900 font-bold text-xs ring-4 ring-primary-600/20">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-white">Join 10k+ active users worldwide</p>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="flex flex-col justify-center items-center p-4 sm:p-8 bg-white lg:bg-slate-50/20 min-h-screen lg:min-h-0">
                <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="lg:hidden p-3 bg-primary-50 rounded-2xl w-fit mx-auto mb-5">
                            <Wallet className="w-7 h-7 text-primary-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 mt-2 font-medium text-sm sm:text-base">Log in to manage your financial dashboard</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full h-full space-y-6">
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
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="label-text mb-0">Secure Password</label>
                                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input 
                                    type="password" 
                                    className="input-field pl-11 h-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                                    Log In to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-8 border-t border-slate-100 w-full text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline underline-offset-4 decoration-2">
                                Start Your Free Trial
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="mt-8 text-xs text-slate-400 font-medium">© 2026 Zorvyn Finance. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginPage;
