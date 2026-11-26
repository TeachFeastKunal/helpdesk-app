import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import TicketFilters from '../components/TicketFilters';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchTickets = async () => {
    const res = await api.get('/tickets');
    setTickets(res.data.tickets);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.createdBy?.name || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          Support Queue ({filteredTickets.length} Tickets)
        </h2>

        <TicketFilters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        {filteredTickets.length === 0 ? (
          <p className="text-slate-500 text-sm">No matching tickets found.</p>
        ) : (
          filteredTickets.map((t) => (
            <TicketCard key={t.id} ticket={t} role="AGENT" onRefresh={fetchTickets} />
          ))
        )}
      </div>
    </div>
  );
}