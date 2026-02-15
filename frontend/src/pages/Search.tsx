import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X, Grid, List } from 'lucide-react';
import type { Ticket, User } from '../types/index.js';
import api from '../lib/api.js';
import { formatDate } from '../lib/utils.js';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const queryParam = searchParams.get('q') || '';
    setQuery(queryParam);
    if (queryParam) {
      searchAll();
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      searchAll();
    }
  };

  const searchAll = async () => {
    await Promise.all([searchTickets(), searchUsers()]);
  };

  const searchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get<Ticket[]>('/tickets/');

      // Filter tickets by search query
      const filtered = response.data.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
          ticket.ticket_number.includes(query) ||
          ticket.description?.toLowerCase().includes(query.toLowerCase()) ||
          ticket.requester.username.toLowerCase().includes(query.toLowerCase()) ||
          ticket.requester.email?.toLowerCase().includes(query.toLowerCase())
      );

      setTickets(filtered);
    } catch (error) {
      console.error('Failed to search tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await api.get<User[]>('/users/');

      // Filter users by search query
      const filtered = response.data.filter(
        (user) =>
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(query.toLowerCase())
      );

      setUsers(filtered);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-600',
      in_progress: 'bg-yellow-600',
      pending: 'bg-blue-600',
      resolved: 'bg-green-600',
      closed: 'bg-gray-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Same as Dashboard */}
      <aside className="w-16 bg-blue-900 flex flex-col items-center py-4 space-y-4">
        <button onClick={() => navigate('/')} className="text-white p-2 hover:bg-blue-800 rounded">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-900 font-bold">
            Z
          </div>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Search</h1>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tickets, users, articles..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  navigate('/');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Saved searches
            </button>
            <button type="button" className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Actions
            </button>
          </form>
        </div>

        {/* Tabs & Filters */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-3 border-b-2 text-sm font-medium ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Ticket ({tickets.length})
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-3 border-b-2 text-sm font-medium ${
                  activeTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Articles (0)
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-3 border-b-2 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`py-3 border-b-2 text-sm font-medium ${
                  activeTab === 'organizations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600'
                }`}
              >
                Organizations (0)
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Filters
              </button>
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Searching...</div>
            </div>
          ) : activeTab === 'tickets' ? (
            tickets.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">No results found</div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Requested
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Requester
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Group
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{ticket.ticket_number}</td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{ticket.subject}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(ticket.updated_at)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {ticket.requester.username}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {ticket.assignee?.username || 'C. Dio'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        Collection
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : activeTab === 'users' ? (
            users.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">No users found</div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm">
                            {user.username[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{user.full_name || user.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="text-sm text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {user.email}
                        </a>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {user.is_admin ? 'Admin' : 'End user'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No results found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
