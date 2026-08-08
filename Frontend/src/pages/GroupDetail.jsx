import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ExpenseItem from '../components/ExpenseItem.jsx';
import { getGroupById, addGroupMember } from '../api/groups.js';
import { getGroupExpenses, getGroupBalances, deleteExpense, addExpense } from '../api/expenses.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import { useAuth } from '../hooks/useAuth.js';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const GroupDetail = () => {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id?.toString();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Settle Up Modal State
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settlePayer, setSettlePayer] = useState('');
  const [settleRecipient, setSettleRecipient] = useState('');
  const [settleAmount, setSettleAmount] = useState('');
  const [submittingSettle, setSubmittingSettle] = useState(false);
  const [settleError, setSettleError] = useState('');

  const fetchAllGroupData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch details, expenses, and balances in parallel
      const [groupData, expensesData, balancesData] = await Promise.all([
        getGroupById(groupId),
        getGroupExpenses(groupId),
        getGroupBalances(groupId),
      ]);

      setGroup(groupData);
      setExpenses(expensesData);
      setBalances(balancesData);
      
      // Initialize default modal values if members are available
      if (groupData?.members?.length > 0) {
        setSettlePayer(currentUserId);
        const firstOther = groupData.members.find(m => m._id !== currentUserId);
        setSettleRecipient(firstOther?._id || '');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load group details.');
      setLoading(false);
    }
  };

  const handleAddMemberPrompt = () => {
    Swal.fire({
      title: 'Add Group Member',
      input: 'email',
      inputLabel: "Enter the user's email address",
      inputPlaceholder: 'friend@example.com',
      showCancelButton: true,
      confirmButtonColor: '#006c4b',
      cancelButtonColor: '#6b7b71',
      confirmButtonText: 'Add Member',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write an email address!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          Swal.fire({
            title: 'Adding member...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
          await addGroupMember(groupId, result.value);
          
          Swal.fire({
            title: 'Member Added!',
            text: `${result.value} has been added to the group.`,
            icon: 'success',
            confirmButtonColor: '#006c4b',
            timer: 2000,
            showConfirmButton: false
          });
          
          fetchAllGroupData();
        } catch (err) {
          Swal.fire({
            title: 'Failed to Add Member',
            text: err.response?.data?.message || 'Something went wrong.',
            icon: 'error',
            confirmButtonColor: '#006c4b'
          });
        }
      }
    });
  };

  useEffect(() => {
    fetchAllGroupData();
  }, [groupId]);

  // Copy join code to clipboard
  const handleCopyCode = () => {
    if (!group?.joinCode) return;
    navigator.clipboard.writeText(group.joinCode);
    
    // Toast notification
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Join code copied!',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Delete expense handler
  const handleDeleteExpense = async (expenseId, description) => {
    Swal.fire({
      title: 'Delete Expense?',
      text: `Are you sure you want to delete "${description}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ba1a1a',
      cancelButtonColor: '#6b7b71',
      confirmButtonText: 'Yes, delete it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteExpense(expenseId);
          Swal.fire({
            title: 'Deleted!',
            text: 'The expense has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          fetchAllGroupData();
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.response?.data?.message || 'Failed to delete expense',
            icon: 'error',
            confirmButtonColor: '#006c4b',
          });
        }
      }
    });
  };

  // Quick Settle up from balance list
  const handleQuickSettle = (memberId, memberName, amount, owesYou) => {
    const absAmount = Math.abs(amount);
    const debtorId = owesYou ? memberId : currentUserId;
    const creditorId = owesYou ? currentUserId : memberId;
    const description = owesYou 
      ? `Settle up: ${memberName} paid Me` 
      : `Settle up: Me paid ${memberName}`;

    Swal.fire({
      title: 'Record Settlement?',
      text: owesYou 
        ? `Did ${memberName} pay you ${formatCurrency(absAmount)} to settle their debt?`
        : `Did you pay ${memberName} ${formatCurrency(absAmount)} to settle your debt?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#006c4b',
      cancelButtonColor: '#6b7b71',
      confirmButtonText: 'Yes, record it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await addExpense({
            group: groupId,
            description,
            amount: absAmount,
            paidBy: debtorId,
            splitAmong: [creditorId],
            isSettlement: true,
          });

          Swal.fire({
            title: 'Recorded!',
            text: 'Settlement logged successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          
          fetchAllGroupData();
        } catch (err) {
          Swal.fire({
            title: 'Error',
            text: err.response?.data?.message || 'Failed to log settlement',
            icon: 'error',
            confirmButtonColor: '#006c4b',
          });
        }
      }
    });
  };

  // Manual Settle Up form submit
  const handleManualSettleSubmit = async (e) => {
    e.preventDefault();
    setSettleError('');

    if (!settlePayer || !settleRecipient) {
      setSettleError('Payer and Recipient must be selected');
      return;
    }

    if (settlePayer === settleRecipient) {
      setSettleError('Payer and Recipient cannot be the same person');
      return;
    }

    const amountNum = parseFloat(settleAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setSettleError('Amount must be a valid positive number');
      return;
    }

    setSubmittingSettle(true);
    try {
      const payerName = group.members.find(m => m._id === settlePayer)?.name || 'Someone';
      const recName = group.members.find(m => m._id === settleRecipient)?.name || 'Someone';
      
      const desc = `Settle up: ${settlePayer === currentUserId ? 'Me' : payerName} paid ${settleRecipient === currentUserId ? 'Me' : recName}`;

      await addExpense({
        group: groupId,
        description: desc,
        amount: amountNum,
        paidBy: settlePayer,
        splitAmong: [settleRecipient],
        isSettlement: true,
      });

      setSubmittingSettle(false);
      setShowSettleModal(false);
      setSettleAmount('');
      
      Swal.fire({
        title: 'Settled Up!',
        text: 'The payment has been logged.',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchAllGroupData();
    } catch (err) {
      setSubmittingSettle(false);
      setSettleError(err.response?.data?.message || 'Failed to log settlement');
    }
  };

  // Maps category tag to styled elements
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Home':
        return 'bg-tertiary-container/10 text-tertiary border-tertiary/10';
      case 'Trip':
        return 'bg-primary-container/10 text-primary border-primary/10';
      case 'Couple':
        return 'bg-error-container/10 text-error border-error/10';
      default:
        return 'bg-surface-container-high/40 text-on-surface-variant border-outline-variant/10';
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
              Loading Group Details...
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
            <p className="font-bold mb-2">Error Loading Group</p>
            <p className="text-sm">{error || 'Group not found.'}</p>
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

  const userBalance = balances?.userNetBalance || 0;

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Decorative Blobs */}
      <div className="soft-blob blob-primary top-[-5%] left-[-5%] w-[450px] h-[450px]"></div>
      <div className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[500px] h-[500px]" style={{ background: '#80f7e0' }}></div>

      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-8 w-full flex-grow relative z-10">
        
        {/* Breadcrumb back button */}
        <Link to="/dashboard" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all text-xs font-semibold font-label-caps tracking-wider mb-6">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Groups
        </Link>

        {/* Group Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-on-surface/5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight">
                {group.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-semibold border ${getCategoryStyles(group.category)}`}>
                {group.category}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
              {/* Copyable Join Code */}
              <div 
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-primary/20 cursor-pointer hover:bg-surface-container transition-all"
                title="Click to copy code"
              >
                <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
                  Code: {group.joinCode}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary">content_copy</span>
              </div>
              <span className="text-on-surface/10">•</span>
              <span className="font-medium">{group.members?.length || 0} members</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSettleError('');
                setShowSettleModal(true);
              }}
              className="px-5 py-3 border border-primary/20 bg-white hover:bg-surface-container text-primary rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              Settle Up
            </button>
            <Link
              to={`/add-expense?groupId=${group._id}`}
              className="px-5 py-3 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_card</span>
              Add Expense
            </Link>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Balance Summaries card */}
            <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-primary/10">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-on-surface/[0.05]">
                <span className="font-label-caps text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Balances
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleAddMemberPrompt}
                    className="text-primary hover:bg-primary/5 p-1.5 rounded-lg transition-all flex items-center justify-center cursor-pointer hover:bg-primary/10"
                    title="Invite member by email"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                  </button>
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    account_balance_wallet
                  </span>
                </div>
              </div>

              {/* Logged in User Balance widget */}
              <div className="space-y-1 mb-6">
                <p className="text-xs text-on-surface-variant">Overall, you are</p>
                {userBalance > 0 ? (
                  <p className="font-currency-display text-2xl font-bold text-primary">
                    owed {formatCurrency(userBalance)}
                  </p>
                ) : userBalance < 0 ? (
                  <p className="font-currency-display text-2xl font-bold text-error">
                    owing {formatCurrency(Math.abs(userBalance))}
                  </p>
                ) : (
                  <p className="font-currency-display text-2xl font-bold text-on-surface-variant">
                    all settled up
                  </p>
                )}
              </div>

              {/* Members Balances Breakdowns */}
              <div className="space-y-3">
                {balances?.memberBalances?.map(({ member, netBalance }) => {
                  const owesYou = netBalance > 0;
                  const isSettled = netBalance === 0;

                  return (
                    <div key={member._id} className="flex items-center justify-between py-2 border-t border-on-surface/[0.03] first:border-t-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs text-on-surface-variant">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-on-surface truncate">{member.name}</p>
                          <p className={`text-[10px] ${isSettled ? 'text-on-surface-variant/40' : owesYou ? 'text-primary' : 'text-error'}`}>
                            {isSettled ? 'Settled' : owesYou ? 'owes you' : 'you owe'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSettled ? 'text-on-surface-variant/40' : owesYou ? 'text-primary' : 'text-error'}`}>
                          {isSettled ? '-' : formatCurrency(Math.abs(netBalance))}
                        </span>
                        
                        {/* Quick Settle up action shortcut */}
                        {!isSettled && (
                          <button
                            onClick={() => handleQuickSettle(member._id, member.name, netBalance, owesYou)}
                            className="bg-primary/5 hover:bg-primary/15 text-primary text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer"
                            title="Quick settle this balance"
                          >
                            Settle
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total spend Widget */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 shadow-[0px_4px_20px_rgba(26,26,26,0.06)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-container rounded-lg text-[#1a1a1a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <h3 className="font-headline-sm text-sm font-bold text-on-surface">Total Group Spend</h3>
              </div>
              <p className="font-currency-display text-2xl font-bold text-primary">
                {formatCurrency(balances?.totalGroupSpend || 0)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Accumulated spend across expenses</p>
            </div>

          </aside>

          {/* RIGHT: Main Expense Feed */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-on-surface/5 flex justify-between items-center bg-surface-container-low/30">
                <h2 className="font-headline-sm text-sm font-bold text-on-surface">Recent Expenses</h2>
                <span className="text-xs text-on-surface-variant font-medium">
                  {expenses.length} transaction{expenses.length !== 1 && 's'}
                </span>
              </div>

              {expenses.length === 0 ? (
                /* Empty Expense Feed */
                <div className="p-12 text-center flex flex-col items-center">
                  <span className="material-symbols-outlined text-5xl text-outline-variant/60 mb-3">
                    receipt_long
                  </span>
                  <h3 className="text-sm font-bold text-on-surface mb-1">No expenses yet</h3>
                  <p className="text-xs text-on-surface-variant max-w-xs mb-6">
                    Add the group's first expense to see who owes what.
                  </p>
                  <Link
                    to={`/add-expense?groupId=${group._id}`}
                    className="bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add Expense
                  </Link>
                </div>
              ) : (
                /* Scrollable Expenses List with Layout Animations */
                <div className="divide-y divide-on-surface/5 overflow-hidden">
                  <AnimatePresence initial={false}>
                    {expenses.map((expense) => (
                      <motion.div
                        key={expense._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        layout
                      >
                        <ExpenseItem 
                          expense={expense} 
                          onDelete={handleDeleteExpense}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Manual Settle Up Modal */}
        <AnimatePresence>
          {showSettleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettleModal(false)}
                className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
              />
              
              {/* Modal Content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white w-full max-w-[460px] rounded-3xl p-6 md:p-8 shadow-2xl border border-outline/10 z-10"
              >
                <button 
                  onClick={() => setShowSettleModal(false)}
                  className="absolute right-6 top-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">Record Payment</h3>
                <p className="text-xs text-on-surface-variant mb-6">Log a direct payment between members to settle debts.</p>

                {settleError && (
                  <div className="mb-4 p-3 bg-error-container/50 border border-error/20 text-error text-xs rounded-xl text-center">
                    {settleError}
                  </div>
                )}

                <form onSubmit={handleManualSettleSubmit} className="space-y-5">
                  
                  {/* Payer Dropdown */}
                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1">
                      Who paid?
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm cursor-pointer appearance-none"
                        value={settlePayer}
                        onChange={(e) => setSettlePayer(e.target.value)}
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

                  {/* Recipient Dropdown */}
                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1">
                      Who was paid?
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm cursor-pointer appearance-none"
                        value={settleRecipient}
                        onChange={(e) => setSettleRecipient(e.target.value)}
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

                  {/* Settle Amount */}
                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="settleAmount">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-currency-display text-sm text-on-surface-variant">
                        $
                      </span>
                      <input 
                        className="w-full pl-8 pr-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm" 
                        id="settleAmount" 
                        placeholder="0.00" 
                        required 
                        step="0.01"
                        min="0.01"
                        type="number"
                        value={settleAmount}
                        onChange={(e) => setSettleAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowSettleModal(false)}
                      className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingSettle}
                      className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold text-xs rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      {submittingSettle ? 'Saving...' : 'Record Settle Up'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default GroupDetail;
