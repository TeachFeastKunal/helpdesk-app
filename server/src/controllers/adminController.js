import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['USER', 'AGENT', 'ADMIN'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (req.params.id === req.user.userId) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalTickets, byStatus, byPriority] = await Promise.all([
      prisma.user.count(),
      prisma.ticket.count(),
      prisma.ticket.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.ticket.groupBy({ by: ['priority'], _count: { priority: true } }),
    ]);

    res.json({
      totalUsers,
      totalTickets,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority] = item._count.priority;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};