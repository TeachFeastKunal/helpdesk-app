import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  getStats,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('ADMIN')); // Strictly ADMIN only

router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/stats', getStats);

export default router;