import express from 'express';
import {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  addMemberByEmail,
} from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected by auth middleware
router.use(protect);

router.post('/', createGroup);
router.get('/', getGroups);
router.post('/join', joinGroup);
router.get('/:id', getGroupById);
router.post('/:id/members', addMemberByEmail);

export default router;
