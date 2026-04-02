import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import RecordsPage from './pages/records/RecordsPage';
import RecordForm from './pages/records/RecordForm';

// Role Guard for Routes
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // If not authorized for this specific role-protected route, 
        // redirect to a page they CAN see (Records) instead of looping to Home.
        return <Navigate to="/records" replace />;
    }

    return children;
};

// Logic to determine which landing page to show based on role
const DashboardHome = () => {
    const { user } = useAuth();
    
    if (user?.role === 'viewer') {
        return <Navigate to="/records" replace />;
    }
    
    return (
        <ProtectedRoute roles={['analyst', 'admin']}>
            <DashboardPage />
        </ProtectedRoute>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Private Dashboard Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Dashboard Home - Analyst and Admin only */}
                        <Route index element={<DashboardHome />} />
                        
                        {/* Records List - All roles */}
                        <Route path="records" element={<RecordsPage />} />
                        
                        {/* Record CRUD - Admin only */}
                        <Route 
                            path="records/new" 
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <RecordForm />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="records/edit/:id" 
                            element={
                                <ProtectedRoute roles={['admin']}>
                                    <RecordForm />
                                </ProtectedRoute>
                            } 
                        />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
