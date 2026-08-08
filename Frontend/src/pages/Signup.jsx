import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!terms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setSubmitting(true);
    try {
      await registerUser(name, email, password);
      setSubmitting(false);

      // SweetAlert2 Success message
      Swal.fire({
        title: 'Account Created!',
        text: 'Registered successfully. Welcome to SplitEasy!',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 2000,
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
        style={{ background: 'linear-gradient(135deg, #80f7e0 0%, #17e8a6 100%)', opacity: 0.15 }}
      ></div>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-[480px]">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mb-4 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="material-symbols-outlined text-on-primary-container text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">SplitEasy</h1>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">Expense sharing made effortless.</p>
          </div>

          {/* Signup Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card bg-surface-container-lowest rounded-[24px] p-8 shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-outline/10"
          >
            <h2 className="font-headline-sm text-xl font-bold text-on-surface mb-6">Create your account</h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-error-container/50 border border-error/20 text-error text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs font-semibold text-on-surface-variant block ml-1" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: '20px' }}>
                    person
                  </span>
                  <input 
                    className="w-full bg-white border border-outline/20 rounded-xl py-3 pl-12 pr-4 font-body-md text-sm outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20 text-on-surface" 
                    id="name" 
                    placeholder="John Doe" 
                    required 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs font-semibold text-on-surface-variant block ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: '20px' }}>
                    mail
                  </span>
                  <input 
                    className="w-full bg-white border border-outline/20 rounded-xl py-3 pl-12 pr-4 font-body-md text-sm outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20 text-on-surface" 
                    id="email" 
                    placeholder="name@example.com" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs font-semibold text-on-surface-variant block ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: '20px' }}>
                    lock
                  </span>
                  <input 
                    className="w-full bg-white border border-outline/20 rounded-xl py-3 pl-12 pr-12 font-body-md text-sm outline-none transition-all placeholder:text-outline-variant focus:border-primary focus:ring-1 focus:ring-primary/20 text-on-surface" 
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
                <p className="font-label-caps text-[10px] text-outline text-right mt-1">Must be at least 8 characters</p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 py-1">
                <input 
                  className="mt-1 rounded border-outline/30 text-primary focus:ring-primary-container custom-checkbox w-4 h-4 cursor-pointer" 
                  id="terms" 
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                />
                <label className="font-body-md text-xs text-on-surface-variant leading-tight cursor-pointer" htmlFor="terms">
                  I agree to the{' '}
                  <a className="text-primary font-semibold hover:underline" href="#terms">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a className="text-primary font-semibold hover:underline" href="#privacy">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {/* CTA Button */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 group cursor-pointer mt-6" 
                type="submit"
                disabled={submitting}
              >
                <span className="font-body-lg text-sm">{submitting ? 'Registering...' : 'Create Account'}</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </motion.button>
            </form>


          </motion.div>

          {/* Login Link */}
          <p className="text-center mt-6 font-body-md text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link className="text-primary font-bold hover:underline ml-1" to="/login">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* Footer Information */}
      <footer className="py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline/5 text-outline text-xs font-semibold">
        <span className="font-label-caps">© 2026 SplitEasy Inc.</span>
        <div className="flex gap-6 font-label-caps">
          <a className="hover:text-primary transition-colors" href="#help">
            Help
          </a>
          <a className="hover:text-primary transition-colors" href="#security">
            Security
          </a>
          <a className="hover:text-primary transition-colors" href="#contact">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
