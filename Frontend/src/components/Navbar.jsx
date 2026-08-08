import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleGroupsClick = (e) => {
    if (location.pathname === '/dashboard') {
      e.preventDefault();
      const el = document.getElementById('groups-grid-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md shadow-[0px_4px_20px_rgba(26,26,26,0.06)] sticky top-0 z-50 border-b border-on-surface/5">
      <div className="flex justify-between items-center px-6 py-4 max-w-[1200px] mx-auto w-full">
        {/* Brand/Logo */}
        <Link className="flex items-center gap-2" to="/dashboard">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">SplitEasy</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-6 items-center">
          <Link 
            className={`font-label-caps text-xs font-semibold pb-1 border-b-2 transition-all ${
              location.pathname === '/dashboard' && location.hash !== '#groups-grid-section'
                ? 'text-primary border-primary font-bold' 
                : 'text-on-surface-variant border-transparent hover:text-primary font-medium'
            }`} 
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link 
            onClick={handleGroupsClick}
            className={`font-label-caps text-xs font-semibold pb-1 border-b-2 transition-all ${
              location.pathname === '/dashboard' && location.hash === '#groups-grid-section' 
                ? 'text-primary border-primary font-bold' 
                : 'text-on-surface-variant border-transparent hover:text-primary font-medium'
            }`} 
            to="/dashboard#groups-grid-section"
          >
            Groups
          </Link>
          <Link 
            className={`font-label-caps text-xs font-semibold pb-1 border-b-2 transition-all ${
              location.pathname === '/profile' 
                ? 'text-primary border-primary font-bold' 
                : 'text-on-surface-variant border-transparent hover:text-primary font-medium'
            }`} 
            to="/profile"
          >
            Profile
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-on-surface">{user?.name}</span>
            <span className="text-xs text-on-surface-variant">{user?.email}</span>
          </div>
          
          {/* Avatar stack / User Icon */}
          <Link to="/profile" className="w-9 h-9 rounded-full bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm cursor-pointer hover:bg-primary-container/30 transition-all">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
          </Link>

          {/* Logout Button */}
          <button 
            className="text-on-surface-variant hover:text-error hover:bg-error/5 p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
