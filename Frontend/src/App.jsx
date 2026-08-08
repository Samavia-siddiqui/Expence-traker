import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth as useAuthHook } from './hooks/useAuth.js';
import { AuthProvider as ContextProvider } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GroupDetail from './pages/GroupDetail.jsx';
import AddExpense from './pages/AddExpense.jsx';
import Profile from './pages/Profile.jsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuthHook();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="font-label-caps text-xs text-on-surface-variant font-bold tracking-widest">
            Loading SplitEasy...
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Wrapper (redirects logged-in users to dashboard)
const PublicRoute = ({ children }) => {
  const { token, loading } = useAuthHook();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px] text-primary animate-spin">
            progress_activity
          </span>
          <p className="font-label-caps text-xs text-on-surface-variant font-bold tracking-widest">
            Loading SplitEasy...
          </p>
        </div>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/group/:id" 
            element={
              <ProtectedRoute>
                <GroupDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-expense" 
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
