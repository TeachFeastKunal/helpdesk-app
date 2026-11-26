import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/tickets (USER, ADMIN)
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        createdById: req.user.userId,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Server error creating ticket' });
  }
};

// GET /api/tickets (USER sees own; AGENT & ADMIN see all)
export const getTickets = async (req, res) => {
  try {
    const whereClause =
      req.user.role === 'USER' ? { createdById: req.user.userId } : {};

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Server error fetching tickets' });
  }
};

// GET /api/tickets/:id
export const getTicketById = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Users can only view their own tickets
    if (req.user.role === 'USER' && ticket.createdById !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied to this ticket' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    res.status(500).json({ message: 'Server error fetching ticket' });
  }
};

// PATCH /api/tickets/:id/status (AGENT, ADMIN)
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, claim } = req.body;
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid ticket status' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (claim) {
      updateData.assignedToId = req.user.userId;
      if (!status) updateData.status = 'IN_PROGRESS';
    }

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.json({ ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Server error updating ticket' });
  }
};

// POST /api/tickets/:id/comments
export const addComment = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Comment message cannot be empty' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'USER' && ticket.createdById !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = await prisma.ticketComment.create({
      data: {
        message: message.trim(),
        ticketId: ticket.id,
        userId: req.user.userId,
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// DELETE /api/tickets/:id (ADMIN only)
export const deleteTicket = async (req, res) => {
  try {
    await prisma.ticket.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Server error deleting ticket' });
  }
};