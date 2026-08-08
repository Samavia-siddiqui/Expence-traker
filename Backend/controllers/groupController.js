import Group from '../models/Group.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const group = await Group.create({
      name,
      category: category || 'Other',
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups for the logged-in user (with calculated net balance)
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    const groupsWithBalances = await Promise.all(
      groups.map(async (group) => {
        const expenses = await Expense.find({ group: group._id });

        // Initialize 2D structure to track debts
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
            if (participantId !== payerId && debts[participantId] && debts[participantId][payerId] !== undefined) {
              debts[participantId][payerId] += share;
            }
          });
        });

        const currentUserId = req.user._id.toString();
        let userNetBalance = 0;

        group.members.forEach((m) => {
          const memberIdStr = m._id.toString();
          if (memberIdStr !== currentUserId) {
            const owedToUser = debts[memberIdStr]?.[currentUserId] || 0;
            const userOwesTo = debts[currentUserId]?.[memberIdStr] || 0;
            userNetBalance += (owedToUser - userOwesTo);
          }
        });

        return {
          ...group.toObject(),
          userNetBalance,
        };
      })
    );

    res.status(200).json(groupsWithBalances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a single group
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is a member of this group
    if (!group.members.some((member) => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied: not a group member' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a group using a join code
export const joinGroup = async (req, res) => {
  try {
    const { joinCode } = req.body;

    if (!joinCode) {
      return res.status(400).json({ message: 'Join code is required' });
    }

    // Find the group by join code
    const group = await Group.findOne({ joinCode: joinCode.toUpperCase().trim() });

    if (!group) {
      return res.status(404).json({ message: 'Invalid join code. Group not found.' });
    }

    // Check if the user is already a member
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    // Add user to the group members
    group.members.push(req.user._id);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a member directly by email address
export const addMemberByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { id: groupId } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verify requesting user is member of the group
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied: not a group member' });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToAdd) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    // Check if user is already a member
    if (group.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    // Add user to group members
    group.members.push(userToAdd._id);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
