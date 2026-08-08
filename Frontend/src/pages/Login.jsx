import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await loginUser(email, password);
      setSubmitting(false);

      // SweetAlert2 Success message
      Swal.fire({
        title: 'Welcome Back!',
        text: 'Logged in successfully.',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (err) {
      setSubmitting(false);
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="soft-blob blob-primary top-[-10%] left-[-10%] w-[400px] h-[400px]"></div>
      <div 
        className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[500px] h-[500px]"
        style={{ background: 'linear-gradient(135deg, #006b5d 0%, #17e8a6 100%)', opacity: 0.15 }}
      ></div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] bg-white rounded-[24px] shadow-[0px_4px_20px_rgba(26,26,26,0.06)] p-8 flex flex-col items-center border border-outline/5"
        >
          {/* Logo Section */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-primary tracking-tight">SplitEasy</h1>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">Effortless group expense tracking</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-error-container/50 border border-error/20 text-error text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative rounded-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  mail
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm" 
                  id="email" 
                  placeholder="name@company.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="font-label-caps text-xs font-semibold text-on-surface-variant" htmlFor="password">
                  Password
                </label>
                <a className="font-label-caps text-xs text-primary hover:underline transition-all" href="#forgot">
                  Forgot?
                </a>
              </div>
              <div className="relative rounded-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-12 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer" 
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Login'}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </motion.button>


          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="font-body-md text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link className="text-primary font-bold hover:underline transition-all ml-1" to="/signup">
                Signup
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Floating Decorative Illustrations (Desktop Only) */}
        <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-surface rounded-full p-4 shadow-xl border border-white/50 opacity-40 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="w-full h-full rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden">
            <img 
              className="w-48 h-48 object-contain" 
              alt="Floating piggy bank illustration" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLywW6xSSOc_qJsfkpe11zIkYFKasjb8CNoOAsK9VMjebp1dY8AGl6Ti1RHPFOTgVRZYGBuLFzBf_Jwt8rUr85C3ZlAEZa2Ef3XT4PX7EqGhWRa8ZvP4RsclEGQ5Axd_-41ETIeaiIvkQE1j8bIvlC0hQHiuuzPO4p9EsiMCK4bq7FfPR40gJimfllQw4Yd5C7sxR_ll-J2WNBv_dTvM8rsQA5UhwC5nmaCcn1Xhy23Tp7m38Et4LXDw"
            />
          </div>
        </div>
        <div className="hidden lg:block absolute right-12 top-1/3 -translate-y-1/2 w-48 h-48 bg-surface rounded-full p-4 shadow-xl border border-white/50 opacity-30 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="w-full h-full rounded-full bg-secondary-container/20 flex items-center justify-center overflow-hidden">
            <img 
              className="w-32 h-32 object-contain" 
              alt="Geometric chart illustration" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ERhqfhx8TncyBS20EX4eTJlsCDBo6xjydBDWMeXT9_OTwj5cNkDSnLwlxXRk3SHbQdsxyCfj2sTr-ySzWi1RFKDil7O_MNb1OSZ2_OqUHininDBDoTMDNpPUnH7YT5BVjlYl7n5DzHzhoqIErp1Qpb_qGoErH0vHc5W1jZnYbmtS_GpcMginJmKRSZD8bPqUaMTYKR-IF5uGhSbsXzLcjCFSgwc_dkS6f-_lV4eRI5KivQvtSkACVw"
            />
          </div>
        </div>
      </main>

      {/* Footer for Login Page */}
      <footer className="relative z-10 p-4 text-center">
        <p className="font-label-caps text-xs font-semibold text-on-surface-variant/60 tracking-wider">
          © 2026 SplitEasy Inc. • Privacy • Terms • Security
        </p>
      </footer>
    </div>
  );
};

export default Login;
