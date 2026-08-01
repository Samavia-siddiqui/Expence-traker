import mongoose from 'mongoose';

// Generate a random 6-character alphanumeric string
const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Home', 'Trip', 'Couple', 'Other'],
      default: 'Other',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    joinCode: {
      type: String,
      unique: true,
      default: generateJoinCode,
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model('Group', groupSchema);

export default Group;
