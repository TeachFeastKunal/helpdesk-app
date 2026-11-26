import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  addComment,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); // All ticket routes require login

router.post('/', authorizeRoles('USER', 'ADMIN'), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id/status', authorizeRoles('AGENT', 'ADMIN'), updateTicketStatus);
router.post('/:id/comments', addComment);
router.delete('/:id', authorizeRoles('ADMIN'), deleteTicket);

export default router;