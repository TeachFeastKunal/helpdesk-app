export default function TicketFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search by title, description, or user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
      >
        <option value="ALL">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>
  );
}