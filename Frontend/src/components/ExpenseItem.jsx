import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import Swal from 'sweetalert2';

const ExpenseItem = ({ expense, onDelete }) => {
  const { user } = useAuth();
  const currentUserId = user?._id?.toString();

  const isSettlement = expense.isSettlement;
  const isPayer = expense.paidBy?._id?.toString() === currentUserId;
  const isParticipant = expense.splitAmong?.some(
    (p) => (p._id || p)?.toString() === currentUserId
  );

  const amount = expense.amount;
  const share = amount / (expense.splitAmong?.length || 1);

  // Helper to choose material symbol icon based on description
  const getIcon = (desc, isSett) => {
    if (isSett) return 'handshake';
    const text = desc.toLowerCase();
    if (text.includes('flight') || text.includes('trip') || text.includes('travel') || text.includes('vacation')) return 'flight_takeoff';
    if (text.includes('dinner') || text.includes('lunch') || text.includes('food') || text.includes('restaurant') || text.includes('brunch') || text.includes('cafe')) return 'restaurant';
    if (text.includes('rent') || text.includes('home') || text.includes('house') || text.includes('flat') || text.includes('room')) return 'home';
    if (text.includes('train') || text.includes('ticket') || text.includes('bus') || text.includes('taxi') || text.includes('uber')) return 'train';
    if (text.includes('hotel') || text.includes('airbnb') || text.includes('booking') || text.includes('stay')) return 'hotel';
    return 'receipt_long';
  };

  // Determine balance text and styles
  const getBalanceInfo = () => {
    if (isSettlement) {
      if (isPayer) {
        return {
          text: 'You settled up',
          class: 'text-on-surface-variant',
        };
      } else {
        return {
          text: 'Settled up',
          class: 'text-primary font-semibold',
        };
      }
    }

    if (isPayer) {
      const lent = isParticipant ? amount - share : amount;
      return {
        text: `You lent ${formatCurrency(lent)}`,
        class: 'text-primary font-semibold',
      };
    } else if (isParticipant) {
      return {
        text: `You owe ${formatCurrency(share)}`,
        class: 'text-error font-semibold',
      };
    } else {
      return {
        text: 'Not involved',
        class: 'text-on-surface-variant/40',
      };
    }
  };

  const balanceInfo = getBalanceInfo();
  const icon = getIcon(expense.description, isSettlement);

  const payerName = isPayer ? 'Me' : expense.paidBy?.name || 'Unknown';
  
  // Format Date (e.g. "Aug 1, 2026")
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Settle transaction description format
  const getSettlementDescription = () => {
    const recipient = expense.splitAmong?.[0]?.name || 'someone';
    const recipientName = expense.splitAmong?.[0]?._id?.toString() === currentUserId ? 'You' : recipient;
    return `${payerName} settled up with ${recipientName}`;
  };

  return (
    <div className="p-4 hover:bg-surface-container-low transition-colors group flex items-center justify-between border-b border-on-surface/5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center transition-colors group-hover:bg-primary-container ${isSettlement ? 'text-primary' : 'text-primary'}`}>
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            {icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-headline-sm text-sm font-bold text-on-surface truncate">
            {isSettlement ? getSettlementDescription() : expense.description}
          </h3>
          <p className="font-body-md text-xs text-on-surface-variant truncate mt-0.5">
            Paid by <span className="font-bold text-on-surface">{payerName}</span> • {formatDate(expense.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-right">
        <div>
          <div className="font-currency-display text-sm font-bold text-on-surface">
            {formatCurrency(amount)}
          </div>
          <span className={`font-label-caps text-[9px] uppercase tracking-wide ${balanceInfo.class}`}>
            {balanceInfo.text}
          </span>
        </div>
        
        {/* Delete Expense button */}
        <button 
          onClick={() => onDelete(expense._id, expense.description)}
          className="text-on-surface-variant/40 hover:text-error opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg transition-all cursor-pointer hover:bg-error/5 flex items-center justify-center"
          title="Delete expense"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
