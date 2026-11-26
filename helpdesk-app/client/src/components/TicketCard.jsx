import { useState } from 'react';
import api from '../api/axios';

const statusColors = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-slate-200 text-slate-700',
};

const priorityColors = {
  LOW: 'text-slate-500',
  MEDIUM: 'text-amber-600',
  HIGH: 'text-red-600 font-semibold',
};

export default function TicketCard({ ticket, role, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [reply, setReply] = useState('');

  const toggleDetails = async () => {
    if (!expanded) {
      const res = await api.get(`/tickets/${ticket.id}`);
      setDetails(res.data.ticket);
    }
    setExpanded(!expanded);
  };

  const handleStatusChange = async (newStatus) => {
    await api.patch(`/tickets/${ticket.id}/status`, { status: newStatus });
    onRefresh();
  };

  const handleClaim = async () => {
    await api.patch(`/tickets/${ticket.id}/status`, { claim: true });
    onRefresh();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket?')) return;
    await api.delete(`/tickets/${ticket.id}`);
    onRefresh();
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    const res = await api.post(`/tickets/${ticket.id}/comments`, { message: reply });
    setDetails((prev) => ({
      ...prev,
      comments: [...(prev?.comments || []), res.data.comment],
    }));
    setReply('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{ticket.title}</h3>
          <p className="text-sm text-slate-600 mt-1">{ticket.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <span className={`px-2.5 py-0.5 rounded-full font-medium ${statusColors[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className={priorityColors[ticket.priority]}>Priority: {ticket.priority}</span>
            <span>By: {ticket.createdBy?.name}</span>
            <span>Assigned: {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(role === 'AGENT' || role === 'ADMIN') && (
            <>
              {!ticket.assignedTo && (
                <button
                  onClick={handleClaim}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer"
                >
                  Claim
                </button>
              )}
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-slate-300 rounded text-xs px-2 py-1.5 bg-white"
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </>
          )}

          {role === 'ADMIN' && (
            <button
              onClick={handleDelete}
              className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1.5 rounded cursor-pointer"
            >
              Delete
            </button>
          )}

          <button
            onClick={toggleDetails}
            className="text-blue-600 hover:underline text-xs font-medium px-2 py-1.5 cursor-pointer"
          >
            {expanded ? 'Hide Thread' : `Replies (${ticket._count?.comments || 0})`}
          </button>
        </div>
      </div>

      {expanded && details && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
            {details.comments.length === 0 ? (
              <p className="text-xs text-slate-400">No replies yet.</p>
            ) : (
              details.comments.map((c) => (
                <div key={c.id} className="bg-slate-50 p-2.5 rounded-lg text-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-slate-700">{c.user.name}</span>
                    <span className="px-1.5 py-0.2 bg-slate-200 rounded text-[10px]">
                      {c.user.role}
                    </span>
                  </div>
                  <p className="text-slate-700">{c.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleReply} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}