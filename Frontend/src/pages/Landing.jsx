import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency.js';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-between overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="soft-blob blob-primary top-[-10%] left-[-10%] w-[450px] h-[450px]"></div>
      <div className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[550px] h-[550px]" style={{ background: '#80f7e0', opacity: 0.15 }}></div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">SplitEasy</span>
        </div>
        <div className="flex items-center gap-4">
          <Link className="font-label-caps text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors" to="/login">
            Login
          </Link>
          <Link className="bg-primary-container text-[#1a1a1a] px-4 py-2.5 rounded-xl font-label-caps text-xs font-bold hover:scale-[0.98] transition-transform shadow-sm" to="/signup">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Feature Canvas (Public Dashboard Preview) */}
      <main className="max-w-[1200px] mx-auto px-6 py-8 w-full flex-grow flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Side: Explanatory Hero Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6 text-left max-w-lg"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-container/10 border border-primary-container/20 rounded-full text-primary font-semibold text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-sm">payments</span>
            Smart Expense Splitting
          </div>

          <h1 className="font-headline-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            Track Shared Bills, Split Expenses Easily.
          </h1>
          
          <p className="font-body-lg text-on-surface-variant text-sm md:text-base leading-relaxed">
            SplitEasy is the easiest dashboard to track shared household rent, divide vacation budgets, and log couple expenses. Add your members, submit bills, and settle debts instantly without spreadsheet confusion.
          </p>

          <div className="pt-2">
            <Link 
              className="inline-flex items-center justify-center gap-2 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold px-8 py-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide"
              to="/signup"
            >
              Start for Free
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Mock Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-xl bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-2xl relative"
        >
          {/* Glass Overlay indicating this is a Preview */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-3xl z-20 flex items-center justify-center pointer-events-none"></div>
          
          {/* Mock Dashboard Layout */}
          <div className="relative z-10 space-y-6 opacity-85 select-none pointer-events-none">
            
            {/* Header row */}
            <div className="flex justify-between items-center pb-4 border-b border-on-surface/[0.05]">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Dashboard Preview</h3>
                <p className="text-[10px] text-on-surface-variant">See how your groups look</p>
              </div>
              <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
            </div>

            {/* Total Balance block */}
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <span className="font-label-caps text-[8px] font-bold text-on-surface-variant/75 uppercase tracking-wide">
                Net Balance Summary
              </span>
              <p className="font-currency-display text-xl font-bold text-primary mt-1">
                You are owed {formatCurrency(150.00)}
              </p>
            </div>

            {/* Mock Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Mock Card 1 */}
              <div className="relative bg-white p-4 rounded-xl shadow-[0px_4px_15px_rgba(26,26,26,0.03)] flex flex-col gap-3 border border-primary/10">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                  </div>
                  <span className="bg-primary-container/10 text-primary px-2 py-0.5 rounded-full text-[8px] font-bold">Active</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Europe Trip</h4>
                  <p className="text-[10px] text-on-surface-variant">4 members</p>
                </div>
                <div className="mt-2 pt-2 border-t border-on-surface/[0.05]">
                  <span className="text-[10px] text-primary font-bold">You are owed $150.00</span>
                </div>
              </div>

              {/* Mock Card 2 */}
              <div className="relative bg-white p-4 rounded-xl shadow-[0px_4px_15px_rgba(26,26,26,0.03)] flex flex-col gap-3 border border-tertiary/10">
                <div className="absolute top-0 left-0 w-1 h-full bg-tertiary-container"></div>
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 bg-tertiary-container/20 rounded-lg flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">home</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">Roommates</h4>
                  <p className="text-[10px] text-on-surface-variant">3 members</p>
                </div>
                <div className="mt-2 pt-2 border-t border-on-surface/[0.05]">
                  <span className="text-[10px] text-error font-bold">You owe $45.20</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 p-5 text-center border-t border-outline/5">
        <p className="font-label-caps text-xs font-semibold text-on-surface-variant/60 tracking-wider">
          © 2026 SplitEasy Inc. • Privacy • Terms • Security
        </p>
      </footer>
    </div>
  );
};

export default Landing;
