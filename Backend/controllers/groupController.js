import Group from '../models/Group.js';

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

// Get all groups for the logged-in user
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(groups);
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
