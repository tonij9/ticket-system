import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Ticket, User } from '../types/index.js';
import api from '../lib/api.js';
import Sidebar from '../components/Sidebar.js';
import TicketTable from '../components/TicketTable.js';
import SearchDropdown from '../components/SearchDropdown.js';
import { LogOut, Search, Grid } from 'lucide-react';

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentView = searchParams.get('view') || 'my_inbox';

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [currentView, user]);

  const fetchUser = async () => {
    try {
      const response = await api.get<User>('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      navigate('/login');
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get<Ticket[]>('/tickets/', {
        params: { view: currentView }
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewChange = (view: string) => {
    setSearchParams({ view });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentView === 'my_inbox' ? 'My Inbox' :
                 currentView === 'unsolved' ? 'All Unsolved Tickets' :
                 currentView === 'pending' ? 'Pending Tickets' : 'My Inbox'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/tickets/new')}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <span>+</span>
                <span>New ticket</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Search className="w-5 h-5" />
                </button>
                {showSearchDropdown && (
                  <SearchDropdown onClose={() => setShowSearchDropdown(false)} />
                )}
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Grid className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading tickets...</div>
            </div>
          ) : (
            <TicketTable tickets={tickets} onRefresh={fetchTickets} />
          )}
        </main>
      </div>
    </div>
  );
}
