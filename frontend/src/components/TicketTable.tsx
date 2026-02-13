import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../types/index.js';
import { TicketStatus } from '../types/index.js';
import { formatDate } from '../lib/utils.js';
import { Download, Play } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export default function TicketTable({ tickets, onRefresh }: TicketTableProps) {
  const navigate = useNavigate();

  const getStatusBadgeColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-red-500';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-500';
      case TicketStatus.PENDING:
        return 'bg-blue-500';
      case TicketStatus.RESOLVED:
        return 'bg-green-500';
      case TicketStatus.CLOSED:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
            Filter
          </button>
          <span className="text-sm text-gray-600">
            {tickets.length} tickets (Page 1 of 1)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600">
            <Play className="w-4 h-4" />
            <span>Play</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium text-white ${getStatusBadgeColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{ticket.ticket_number}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{ticket.subject}</div>
                    {ticket.description && (
                      <div className="text-xs text-gray-500 truncate max-w-md">
                        {ticket.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {ticket.review_date ? formatDate(ticket.review_date) : '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {ticket.requester.full_name || ticket.requester.username}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
