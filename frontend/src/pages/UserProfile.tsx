import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import type { User, Ticket } from '../types/index.js';
import api from '../lib/api.js';
import { formatDate } from '../lib/utils.js';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');

  useEffect(() => {
    fetchUserAndTickets();
  }, [id]);

  const fetchUserAndTickets = async () => {
    try {
      setLoading(true);

      // Fetch user details
      const userResponse = await api.get<User>(`/users/${id}`);
      setUser(userResponse.data);

      // Fetch all tickets and filter by this user
      const ticketsResponse = await api.get<Ticket[]>('/tickets/');
      const userTickets = ticketsResponse.data.filter(
        ticket => ticket.requester_id === parseInt(id!)
      );
      setTickets(userTickets);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-600',
      in_progress: 'bg-yellow-600',
      pending: 'bg-blue-600',
      resolved: 'bg-gray-600',
      closed: 'bg-gray-600',
    };
    return colors[status] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading user profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div className="border-l border-gray-300 h-6"></div>
              <h1 className="text-xl font-semibold">No organization</h1>
              <span className="text-gray-400">|</span>
              <h2 className="text-xl font-semibold">{user.full_name || user.username}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-gray-600 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex gap-6">
              {/* Left Panel - User Details */}
              <aside className="w-80 bg-white border border-gray-200 rounded-lg p-6 h-fit">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user.full_name || user.username}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 uppercase">User type</label>
                    <p className="text-sm">{user.is_admin ? 'Admin' : 'End user'}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Access</label>
                    <p className="text-sm">Can view and edit own tickets</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Primary email</label>
                    <div className="flex items-center justify-between">
                      <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline">
                        {user.email}
                      </a>
                    </div>
                    <button className="text-sm text-blue-600 hover:underline mt-1">
                      + add contact
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Tags</label>
                    <div className="text-sm text-gray-400">-</div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Org.</label>
                    <div className="text-sm text-gray-400">-</div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Details</label>
                    <div className="text-sm text-gray-400">-</div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 uppercase">Notes</label>
                    <div className="text-sm text-gray-400">-</div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600">Created: {formatDate(user.created_at || new Date().toISOString())}</div>
                    <div className="text-xs text-gray-600">Updated: {formatDate(user.created_at || new Date().toISOString())}</div>
                    <div className="text-xs text-gray-600">Last sign-in: -</div>
                  </div>
                </div>
              </aside>

              {/* Right Panel - User Tickets */}
              <div className="flex-1">
                <div className="bg-white border border-gray-200 rounded-lg">
                  {/* Tabs */}
                  <div className="border-b border-gray-200 px-6">
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
                          Tickets ({tickets.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('related')}
                          className={`py-3 border-b-2 text-sm font-medium ${
                            activeTab === 'related'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-600'
                          }`}
                        >
                          Related
                        </button>
                        <button
                          onClick={() => setActiveTab('security')}
                          className={`py-3 border-b-2 text-sm font-medium ${
                            activeTab === 'security'
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-600'
                          }`}
                        >
                          Security settings
                        </button>
                      </div>
                      <button className="text-sm text-blue-600 hover:underline">
                        + New ticket
                      </button>
                    </div>
                  </div>

                  {/* Tickets Section */}
                  {activeTab === 'tickets' && (
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">
                          Requested tickets ({tickets.length})
                        </h3>
                        <div className="text-xs text-gray-600 mb-4">
                          {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length > 0 && (
                            <div>Status category: solved</div>
                          )}
                        </div>
                      </div>

                      {tickets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          No tickets found
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
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
                                    {ticket.status === 'resolved' || ticket.status === 'closed' ? 'Solved' : ticket.status.replace('_', ' ')}
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
                                <td className="px-4 py-4 text-sm text-gray-500">
                                  Support
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}

                  {activeTab === 'related' && (
                    <div className="p-6 text-center text-gray-500">
                      No related information
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="p-6 text-center text-gray-500">
                      Security settings
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
