import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getGroupById } from '../api/groups.js';
import { addExpense } from '../api/expenses.js';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const AddExpense = () => {
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id?.toString();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitAmong, setSplitAmong] = useState([]); // array of selected memberIds
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!groupId) {
      setError('No group selected. Please return to the dashboard.');
      setLoading(false);
      return;
    }

    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const groupData = await getGroupById(groupId);
        setGroup(groupData);
        
        // Default paidBy to current user
        setPaidBy(currentUserId);
        
        // Default splitAmong to all members
        if (groupData?.members) {
          setSplitAmong(groupData.members.map((m) => m._id));
        }

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load group members.');
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  // Handle individual split checkbox toggles
  const handleMemberCheckboxChange = (memberId) => {
    setSplitAmong((prev) => {
      if (prev.includes(memberId)) {
        // Keep at least one checked
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Toggle "Select All" split participants
  const handleToggleSelectAll = () => {
    if (!group?.members) return;
    if (splitAmong.length === group.members.length) {
      // Keep only current user selected, or first if current user is somehow missing
      const fallback = group.members.some(m => m._id === currentUserId) ? [currentUserId] : [group.members[0]._id];
      setSplitAmong(fallback);
    } else {
      setSplitAmong(group.members.map((m) => m._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please enter an expense description.');
      return;
    }

    if (!paidBy) {
      setFormError('Please select who paid for the expense.');
      return;
    }

    if (splitAmong.length === 0) {
      setFormError('Please select at least one person to split the expense with.');
      return;
    }

    setSubmitting(true);
    try {
      await addExpense({
        group: groupId,
        description: description.trim(),
        amount: parsedAmount,
        paidBy,
        splitAmong,
        isSettlement: false,
      });

      setSubmitting(false);

      // SweetAlert2 Success alert
      Swal.fire({
        title: 'Expense Added!',
        text: 'The expense has been shared with your group.',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(`/group/${groupId}`);
    } catch (err) {
      setSubmitting(false);
      setFormError(err.response?.data?.message || 'Failed to add expense.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-primary animate-spin">
              progress_activity
            </span>
            <p className="font-label-caps text-xs text-on-surface-variant/80 tracking-widest font-semibold">
              Loading Group Form...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-error-container/20 border border-error/15 text-error p-6 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-bold mb-2">Error Loading Page</p>
            <p className="text-sm">{error || 'Group details not loaded.'}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allSelected = splitAmong.length === group.members.length;

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Decorative Blobs */}
      <div className="soft-blob blob-primary top-[-5%] left-[-5%] w-[450px] h-[450px]"></div>
      <div className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[500px] h-[500px]" style={{ background: '#80f7e0' }}></div>

      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-8 w-full flex-grow flex flex-col items-center justify-center relative z-10">
        
        {/* Back Link */}
        <div className="w-full max-w-2xl mb-4">
          <Link to={`/group/${groupId}`} className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all text-xs font-semibold font-label-caps tracking-wider">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to {group.name}
          </Link>
        </div>

        {/* Form Card */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl bg-white rounded-2xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(26,26,26,0.06)] relative overflow-hidden border border-primary/5"
        >
          {/* Decorative accent top bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-container to-secondary"></div>
          
          <div className="mb-8">
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-1">Add Expense</h1>
            <p className="font-body-md text-xs text-on-surface-variant">
              Keep your group spending organized and transparent.
            </p>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-6 p-3 bg-error-container/50 border border-error/20 text-error text-xs rounded-xl text-center">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Top Row: Amount & Description */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Amount */}
              <div className="md:col-span-4 space-y-1">
                <label className="block font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="amount">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-currency-display text-sm font-semibold text-on-surface-variant">
                    $
                  </span>
                  <input 
                    className="w-full pl-8 pr-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none font-bold text-on-surface text-sm" 
                    id="amount" 
                    placeholder="0.00" 
                    required 
                    step="0.01"
                    min="0.01"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-8 space-y-1">
                <label className="block font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="description">
                  Description
                </label>
                <input 
                  className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm" 
                  id="description" 
                  placeholder="e.g. Dinner, Airbnb deposit, Train tickets" 
                  required 
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

            </div>

            {/* Row 2: Paid By & Split Among */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Paid By Select */}
              <div className="space-y-1">
                <label className="block font-label-caps text-xs font-semibold text-on-surface-variant ml-1">
                  Paid by
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm cursor-pointer appearance-none"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                  >
                    {group.members?.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m._id === currentUserId ? 'Me' : m.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Split Among Multi-check */}
              <div className="space-y-1">
                <label className="block font-label-caps text-xs font-semibold text-on-surface-variant ml-1">
                  Split among
                </label>
                <div className="bg-surface-container-low rounded-xl p-3 flex flex-wrap gap-3 border border-on-surface/5">
                  {/* Select All pill */}
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input 
                      type="checkbox"
                      className="custom-checkbox w-4.5 h-4.5 rounded-lg border-primary/40 text-primary focus:ring-primary/20 cursor-pointer"
                      checked={allSelected}
                      onChange={handleToggleSelectAll}
                    />
                    <span className={`text-xs font-bold transition-colors ${allSelected ? 'text-primary font-bold' : 'text-on-surface group-hover:text-primary'}`}>
                      All
                    </span>
                  </label>
                  
                  {/* Individual members checks */}
                  {group.members?.map((member) => {
                    const isChecked = splitAmong.includes(member._id);
                    return (
                      <label key={member._id} className="flex items-center gap-1.5 cursor-pointer group">
                        <input 
                          type="checkbox"
                          className="custom-checkbox w-4.5 h-4.5 rounded-lg border-primary/40 text-primary focus:ring-primary/20 cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleMemberCheckboxChange(member._id)}
                        />
                        <span className={`text-xs transition-colors ${isChecked ? 'text-primary font-semibold' : 'text-on-surface group-hover:text-primary'}`}>
                          {member._id === currentUserId ? 'Me' : member.name.split(' ')[0]}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Optional Context Placeholder */}
            <div className="flex items-center gap-4 p-4 bg-surface-container-high/30 rounded-xl border border-dashed border-outline-variant/60">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Receipt Upload
                </p>
                <p className="text-xs text-on-surface-variant/80">
                  Optional receipt photo integration coming soon.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4 border-t border-on-surface/5">
              <button 
                type="button"
                onClick={() => navigate(`/group/${groupId}`)}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors text-center cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] px-8 py-3 rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                {submitting ? 'Adding...' : 'Add Expense'}
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>

          </form>
        </motion.section>

      </main>
    </div>
  );
};

export default AddExpense;
