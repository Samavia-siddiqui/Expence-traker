import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { getGroups } from '../api/groups.js';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const groups = await getGroups();
        setGroupCount(groups.length);
      } catch (err) {
        // Fallback silently
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your session.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ba1a1a',
      cancelButtonColor: '#6b7b71',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        navigate('/login');
      }
    });
  };

  const handleMockClick = (settingName) => {
    Swal.fire({
      text: `${settingName} settings are currently simulated in the design sandbox.`,
      icon: 'info',
      confirmButtonColor: '#006c4b',
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      {/* Decorative Blobs */}
      <div className="soft-blob blob-primary top-[-5%] left-[-5%] w-[450px] h-[450px]"></div>
      <div className="soft-blob blob-secondary bottom-[-10%] right-[-10%] w-[500px] h-[500px]" style={{ background: '#80f7e0' }}></div>

      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-10 w-full flex-grow relative z-10">
        
        {/* Heading Section */}
        <div className="mb-8">
          <h1 className="font-headline-lg text-3xl font-bold text-on-surface tracking-tight mb-1">
            My Profile
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            Manage your personal credentials, account stats, and settings.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Profile Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Profile Avatar Initials */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full ring-4 ring-primary-container/40 bg-primary-container/20 flex items-center justify-center text-primary font-bold text-3xl select-none">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'US'}
                </div>
                <button 
                  onClick={() => handleMockClick('Photo')}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:scale-105 transition-transform flex items-center justify-center cursor-pointer border border-white"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                </button>
              </div>

              {/* User Identity Details */}
              <div className="flex-grow text-center sm:text-left space-y-3">
                <div>
                  <h2 className="font-headline-sm text-xl font-bold text-on-surface">
                    {user?.name || 'User Name'}
                  </h2>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="bg-secondary-container/35 text-on-secondary-container px-3.5 py-1 rounded-full font-label-caps text-[9px] font-bold uppercase tracking-wider">
                    Basic Member
                  </span>
                  <span className="bg-surface-container-high text-on-surface-variant px-3.5 py-1 rounded-full font-label-caps text-[9px] font-bold uppercase tracking-wider">
                    Verified Account
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:self-start">
                <button 
                  onClick={() => handleMockClick('Edit Profile')}
                  className="flex items-center gap-1.5 px-4 py-2 border border-outline/25 rounded-xl font-body-md text-xs font-semibold text-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Profile
                </button>
              </div>

            </div>

            {/* Profile Statistics Panel */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-on-surface/[0.05]">
              <div className="flex flex-col items-center p-3 bg-surface-container-low/40 rounded-xl border border-on-surface/[0.02]">
                <span className="font-label-caps text-[9px] font-bold text-on-surface-variant/75 mb-1 text-center uppercase tracking-wide">
                  Active Groups
                </span>
                <span className="font-headline-sm text-xl font-bold text-primary">
                  {loading ? '...' : groupCount}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-surface-container-low/40 rounded-xl border border-on-surface/[0.02]">
                <span className="font-label-caps text-[9px] font-bold text-on-surface-variant/75 mb-1 text-center uppercase tracking-wide">
                  Split Score
                </span>
                <span className="font-headline-sm text-xl font-bold text-primary">
                  100%
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-surface-container-low/40 rounded-xl border border-on-surface/[0.02]">
                <span className="font-label-caps text-[9px] font-bold text-on-surface-variant/75 mb-1 text-center uppercase tracking-wide">
                  Status
                </span>
                <span className="font-headline-sm text-xl font-bold text-primary">
                  Active
                </span>
              </div>
            </div>

          </motion.div>

          {/* Bento-style Mock Settings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div 
              onClick={() => handleMockClick('Notifications')}
              className="bg-white p-4 rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5 flex items-center justify-between hover:bg-surface-container-low/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Notifications</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant">Push alerts & Email summaries</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </div>

            <div 
              onClick={() => handleMockClick('Privacy & Security')}
              className="bg-white p-4 rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5 flex items-center justify-between hover:bg-surface-container-low/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Privacy & Security</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant">Password & Two-Factor</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </div>

            <div 
              onClick={() => handleMockClick('Payment Methods')}
              className="bg-white p-4 rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5 flex items-center justify-between hover:bg-surface-container-low/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-container/20 rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">payment</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Payment Methods</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant">Bank Accounts & Cards</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
            </div>

            {/* Logout Row Action */}
            <div 
              onClick={handleLogout}
              className="bg-white p-4 rounded-xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] border border-on-surface/5 flex items-center justify-between hover:bg-error/5 hover:border-error/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-error/10 text-error rounded-lg flex items-center justify-center transition-colors group-hover:bg-error group-hover:text-white">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface group-hover:text-error transition-colors">Sign Out</p>
                  <p className="font-label-caps text-[10px] text-on-surface-variant group-hover:text-error/80 transition-colors">Terminate current user session</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-error transition-colors text-[20px]">chevron_right</span>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default Profile;
