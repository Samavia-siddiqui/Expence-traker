import Expense from '../models/Expense.js';
import Group from '../models/Group.js';

// Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { group: groupId, description, amount, paidBy, splitAmong, isSettlement } = req.body;

    if (!groupId || !description || amount === undefined || !paidBy || !splitAmong || splitAmong.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied: not a group member' });
    }

    const expense = await Expense.create({
      group: groupId,
      description,
      amount,
      paidBy,
      splitAmong,
      isSettlement: isSettlement || false,
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splitAmong', 'name email');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses for a group
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied: not a group member' });
    }

    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('splitAmong', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify group exists and user is a member
    const group = await Group.findById(expense.group);
    if (!group || !group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get balance calculations for a group
export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Verify group exists and user is a member
    const group = await Group.findById(groupId).populate('members', 'name email');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.some((m) => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied: not a group member' });
    }

    const expenses = await Expense.find({ group: groupId });

    // Initialize 2D structure to track debts: debts[debtor][creditor] = amount
    const debts = {};
    group.members.forEach((m) => {
      debts[m._id.toString()] = {};
      group.members.forEach((other) => {
        if (m._id.toString() !== other._id.toString()) {
          debts[m._id.toString()][other._id.toString()] = 0;
        }
      });
    });

    // Populate debts from expenses
    expenses.forEach((expense) => {
      if (!expense.splitAmong || expense.splitAmong.length === 0) return;
      const share = expense.amount / expense.splitAmong.length;
      const payerId = expense.paidBy.toString();

      expense.splitAmong.forEach((participant) => {
        const participantId = participant.toString();
        // If the participant is not the payer, the participant owes the payer the share
        if (participantId !== payerId && debts[participantId] && debts[participantId][payerId] !== undefined) {
          debts[participantId][payerId] += share;
        }
      });
    });

    const currentUserId = req.user._id.toString();
    const memberBalances = [];
    let userNetBalance = 0;

    group.members.forEach((m) => {
      const memberIdStr = m._id.toString();
      if (memberIdStr !== currentUserId) {
        const owedToUser = debts[memberIdStr][currentUserId] || 0;
        const userOwesTo = debts[currentUserId][memberIdStr] || 0;
        const netBalance = owedToUser - userOwesTo; // Positive: m owes current user; Negative: current user owes m

        userNetBalance += netBalance;
        memberBalances.push({
          member: {
            _id: m._id,
            name: m.name,
            email: m.email,
          },
          netBalance,
        });
      }
    });

    // Calculate total spend on non-settlement items
    const totalGroupSpend = expenses
      .filter((exp) => !exp.isSettlement)
      .reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      totalGroupSpend,
      userNetBalance,
      memberBalances,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
