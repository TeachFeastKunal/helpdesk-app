import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">HelpDesk</span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600">
          {user.role}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">
          {user.name} ({user.email})
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}