import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import GroupCard from '../components/GroupCard.jsx';
import { getGroups, createGroup, joinGroup } from '../api/groups.js';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals visibility state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('Other');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [submittingJoin, setSubmittingJoin] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchGroupsList = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch groups. Please refresh the page.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsList();
  }, []);

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!groupName.trim()) {
      setModalError('Group name is required');
      return;
    }

    setSubmittingCreate(true);
    try {
      await createGroup({ name: groupName.trim(), category: groupCategory });
      setSubmittingCreate(false);
      setShowCreateModal(false);
      setGroupName('');
      setGroupCategory('Other');

      Swal.fire({
        title: 'Group Created!',
        text: 'Your new expense group is ready.',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchGroupsList();
    } catch (err) {
      setSubmittingCreate(false);
      setModalError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoinGroupSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!joinCodeInput.trim()) {
      setModalError('Join code is required');
      return;
    }

    setSubmittingJoin(true);
    try {
      await joinGroup(joinCodeInput.trim().toUpperCase());
      setSubmittingJoin(false);
      setShowJoinModal(false);
      setJoinCodeInput('');

      Swal.fire({
        title: 'Joined Group!',
        text: 'You have successfully joined the group.',
        icon: 'success',
        confirmButtonColor: '#006c4b',
        timer: 1500,
        showConfirmButton: false,
      });

      fetchGroupsList();
    } catch (err) {
      setSubmittingJoin(false);
      setModalError(err.response?.data?.message || 'Failed to join group. Check code.');
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Decorative Blobs */}
      <div className="soft-blob blob-primary top-[-5%] left-[-5%] w-[400px] h-[400px]"></div>
      <div className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[500px] h-[500px]" style={{ background: '#80f7e0' }}></div>

      <Navbar />

      {/* Full-width Enhanced Fintech Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#003825] via-[#004e35] to-[#006c4b] border-b border-[#002f1f]/35 py-12 md:py-16 relative overflow-hidden z-10">
        {/* Glowing glass background accents */}
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[#80f7e0]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-5%] w-60 h-60 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-xl text-left flex-1"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[#80f7e0] font-semibold text-[10px] uppercase tracking-wide">
              <span className="material-symbols-outlined text-xs">waving_hand</span>
              Welcome back to SplitEasy
            </div>
            <h1 className="font-headline-lg text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Track Shared Bills, Split Expenses Easily.
            </h1>
            <p className="text-sm text-[#e2f1e8]/85 leading-relaxed">
              SplitEasy gives you a unified fintech dashboard to split bills with roommates, calculate vacation costs, and record couple budgets. Invite members by email or share your join code, log expenses, and settle balances with zero hassle.
            </p>
            <div className="flex flex-row items-center gap-3 pt-2">
              <a 
                href="#groups-grid-section"
                className="px-5 py-3 bg-white hover:bg-[#e2f1e8] text-[#003825] rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                See Your Groups
              </a>
              <Link 
                to="/profile"
                className="px-5 py-3 border border-white/30 hover:bg-white/10 text-white rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                See Your Profile
              </Link>
            </div>
          </motion.div>

          {/* Floating 3D Fintech Image with Ambient Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            transition={{ 
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="hidden md:block md:w-[280px] lg:w-[360px] shrink-0"
          >
            <img 
              src="/dashboard_hero_illustration.jpg" 
              alt="SplitEasy Fintech Illustration" 
              className="w-full h-auto rounded-2xl shadow-[0px_10px_45px_rgba(0,108,75,0.35)] border border-white/20 select-none object-cover"
            />
          </motion.div>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto px-6 py-10 w-full flex-grow relative z-10">

        {/* About SplitEasy Section with custom 3D illustration icons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 space-y-6"
        >
          <div className="text-left">
            <h2 className="font-headline-sm text-lg font-bold text-on-surface">How SplitEasy Works</h2>
            <p className="text-xs text-on-surface-variant">Simple dashboard solutions for complex financial splits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-on-surface/5 shadow-[0px_4px_15px_rgba(26,26,26,0.03)] flex flex-col gap-3 hover:shadow-[0px_8px_30px_rgba(26,26,26,0.06)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-tertiary-container/10 flex items-center justify-center overflow-hidden mb-1">
                <img src="/house_feature_icon.jpg" alt="House" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-on-surface text-left">Rent & Households</h3>
              <p className="text-xs text-on-surface-variant text-left leading-relaxed">
                Groceries, monthly rent, electricity bills, or flat supplies. Log expenses and divide shares among roommates dynamically.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-on-surface/5 shadow-[0px_4px_15px_rgba(26,26,26,0.03)] flex flex-col gap-3 hover:shadow-[0px_8px_30px_rgba(26,26,26,0.06)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/10 flex items-center justify-center overflow-hidden mb-1">
                <img src="/travel_feature_icon.jpg" alt="Travel" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-on-surface text-left">Trips & Vacations</h3>
              <p className="text-xs text-on-surface-variant text-left leading-relaxed">
                Flight tickets, hotels, restaurants, and taxi rides. Record trip spend and instantly calculate exactly who owes what.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-on-surface/5 shadow-[0px_4px_15px_rgba(26,26,26,0.03)] flex flex-col gap-3 hover:shadow-[0px_8px_30px_rgba(26,26,26,0.06)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-error-container/10 flex items-center justify-center overflow-hidden mb-1">
                <img src="/settle_feature_icon.jpg" alt="Settle" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-sm font-bold text-on-surface text-left">Direct Settle-Ups</h3>
              <p className="text-xs text-on-surface-variant text-left leading-relaxed">
                Nets out member-to-member debts. Record direct payments with one click to balance your ledger and keep accounts clear.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Upper Dashboard Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight mb-1">
              My Groups
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm">
              Manage your shared expenses and balances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalError('');
                setShowJoinModal(true);
              }}
              className="px-5 py-3 border border-primary/20 bg-white hover:bg-surface-container text-primary rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">group_add</span>
              Join Group
            </button>
            <button
              onClick={() => {
                setModalError('');
                setShowCreateModal(true);
              }}
              className="px-5 py-3 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] rounded-xl font-bold font-label-caps text-xs tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              New Group
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-primary animate-spin">
                progress_activity
              </span>
              <p className="font-label-caps text-xs text-on-surface-variant/80 tracking-widest font-semibold">
                Loading Groups...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-error-container/20 border border-error/15 text-error p-6 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-bold mb-2">Error Loading Groups</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchGroupsList}
              className="mt-4 px-4 py-2 bg-error text-white font-bold text-xs rounded-xl hover:bg-error/90 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : groups.length === 0 ? (
          /* Empty State */
          <motion.div 
            id="groups-grid-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-outline/10 mt-6"
          >
            <span className="material-symbols-outlined text-6xl text-outline-variant/60 mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>
              groups_2
            </span>
            <h2 className="font-headline-md text-xl font-bold text-on-surface mb-2">No groups yet</h2>
            <p className="font-body-md text-on-surface-variant text-sm mb-6 leading-relaxed">
              Create a group to start splitting rent, dinner, or travel bills with friends and roommates.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setModalError('');
                  setShowCreateModal(true);
                }}
                className="bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer transition-all w-full text-sm"
              >
                Create your first group
              </button>
              <button
                onClick={() => {
                  setModalError('');
                  setShowJoinModal(true);
                }}
                className="border border-primary/20 bg-white hover:bg-surface-container text-primary font-bold py-3 px-6 rounded-xl cursor-pointer transition-all w-full text-sm"
              >
                Join with a code
              </button>
            </div>
          </motion.div>
        ) : (
          /* Bento Grid of Group Cards with animations */
          <div id="groups-grid-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence initial={false}>
              {groups.map((group) => (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <GroupCard group={group} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* MODALS */}
        <AnimatePresence>
          {/* Create Group Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
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
                  onClick={() => setShowCreateModal(false)}
                  className="absolute right-6 top-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">Create New Group</h3>
                <p className="text-xs text-on-surface-variant mb-6">Group bills and expenses effortlessly.</p>

                {modalError && (
                  <div className="mb-4 p-3 bg-error-container/50 border border-error/20 text-error text-xs rounded-xl text-center">
                    {modalError}
                  </div>
                )}

                <form onSubmit={handleCreateGroupSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="groupName">
                      Group Name
                    </label>
                    <input 
                      className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm" 
                      id="groupName" 
                      placeholder="e.g. Europe Trip, Rent Bills" 
                      required 
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="groupCategory">
                      Category
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface text-sm cursor-pointer appearance-none" 
                        id="groupCategory"
                        value={groupCategory}
                        onChange={(e) => setGroupCategory(e.target.value)}
                      >
                        <option value="Home">Home (Roommates, Household)</option>
                        <option value="Trip">Trip (Travel, Vacation)</option>
                        <option value="Couple">Couple (Shared bills)</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                        expand_more
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingCreate}
                      className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold text-xs rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      {submittingCreate ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Join Group Modal */}
          {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowJoinModal(false)}
                className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
              />
              {/* Modal Content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-white w-full max-w-[420px] rounded-3xl p-6 md:p-8 shadow-2xl border border-outline/10 z-10"
              >
                <button 
                  onClick={() => setShowJoinModal(false)}
                  className="absolute right-6 top-6 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="font-headline-md text-lg font-bold text-on-surface mb-2">Join a Group</h3>
                <p className="text-xs text-on-surface-variant mb-6">Enter the 6-character code shared by your friend.</p>

                {modalError && (
                  <div className="mb-4 p-3 bg-error-container/50 border border-error/20 text-error text-xs rounded-xl text-center">
                    {modalError}
                  </div>
                )}

                <form onSubmit={handleJoinGroupSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="font-label-caps text-xs font-semibold text-on-surface-variant ml-1" htmlFor="joinCode">
                      Group Join Code
                    </label>
                    <input 
                      className="w-full px-4 py-3 bg-white border border-primary/20 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none text-on-surface font-mono text-center text-lg tracking-widest font-bold placeholder:font-sans placeholder:text-sm placeholder:tracking-normal uppercase" 
                      id="joinCode" 
                      placeholder="e.g. X8J3KL" 
                      required 
                      maxLength={6}
                      type="text"
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowJoinModal(false)}
                      className="px-5 py-2.5 text-xs font-bold text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={submittingJoin}
                      className="px-5 py-2.5 bg-primary-container hover:bg-primary-container/90 text-[#1a1a1a] font-bold text-xs rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      {submittingJoin ? 'Joining...' : 'Join Group'}
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

export default Dashboard;
