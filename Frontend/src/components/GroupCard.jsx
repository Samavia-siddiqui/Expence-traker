import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency.js';

const GroupCard = ({ group }) => {
  // Map category to symbols and styling
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Home':
        return {
          icon: 'home',
          bgClass: 'bg-tertiary-container/20 text-tertiary',
          borderClass: 'border-tertiary/10',
          accentBar: 'bg-tertiary-container',
        };
      case 'Trip':
        return {
          icon: 'flight_takeoff',
          bgClass: 'bg-primary-container/20 text-primary',
          borderClass: 'border-primary/10',
          accentBar: 'bg-primary-container',
        };
      case 'Couple':
        return {
          icon: 'favorite',
          bgClass: 'bg-error-container/20 text-error',
          borderClass: 'border-error/10',
          accentBar: 'bg-error-container',
        };
      default:
        return {
          icon: 'groups_2',
          bgClass: 'bg-surface-container-high/50 text-on-surface-variant',
          borderClass: 'border-outline-variant/25',
          accentBar: 'bg-outline-variant',
        };
    }
  };

  const { icon, bgClass, borderClass, accentBar } = getCategoryStyles(group.category);
  const balance = group.userNetBalance || 0;

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0px 8px 30px rgba(26, 26, 26, 0.1)' }}
      className={`relative bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(26,26,26,0.06)] flex flex-col gap-4 overflow-hidden border ${borderClass}`}
    >
      {/* Accent left bar */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${accentBar}`}></div>

      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        <span className="bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-label-caps text-[9px] tracking-wide font-semibold uppercase">
          {group.category}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-headline-sm text-lg font-bold text-on-surface leading-snug truncate">
          {group.name}
        </h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-base">group</span>
          <span>{group.members?.length || 0} members</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-on-surface/[0.05] flex justify-between items-center">
        <div>
          <p className="font-label-caps text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-0.5">
            Your Balance
          </p>
          {balance > 0 ? (
            <p className="font-currency-display text-sm font-bold text-primary">
              You are owed {formatCurrency(balance)}
            </p>
          ) : balance < 0 ? (
            <p className="font-currency-display text-sm font-bold text-error">
              You owe {formatCurrency(Math.abs(balance))}
            </p>
          ) : (
            <p className="font-currency-display text-sm font-bold text-on-surface-variant">
              Settled up
            </p>
          )}
        </div>
        
        <Link 
          to={`/group/${group._id}`} 
          className="bg-primary/5 hover:bg-primary/10 text-primary p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default GroupCard;
