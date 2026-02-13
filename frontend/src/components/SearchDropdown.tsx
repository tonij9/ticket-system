import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, RefreshCw } from 'lucide-react';

interface SearchDropdownProps {
  onClose: () => void;
}

export default function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tickets');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const recentlyViewed = [
    {
      id: 1,
      title: 'BankEx ID: 2835726/16146490 - Bankruptcy/Consumer Proposal Information - Estate Number(s) 31-2870767',
      agent: 'fax',
      time: '12 minutes ago',
      ticketNumber: '#45663'
    },
    {
      id: 2,
      title: 'BankEx ID: 2714615/15501878 - Bankruptcy/Consumer Proposal Information - Estate Number(s) 31-2870767',
      agent: 'fax',
      time: '29 minutes ago',
      ticketNumber: '#45758'
    },
    {
      id: 3,
      title: 'Final S2D & Notice - Jeffrey Sarmiento-Landry - (Loan No.: 11-312628)',
      agent: 'fax',
      time: '32 minutes ago',
      ticketNumber: '#45657'
    }
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="21-2870767"
            className="w-full pl-4 pr-10 py-2 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">Filters</h3>
        <div className="flex space-x-4 text-sm">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-2 border-b-2 ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            Tickets
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-2 border-b-2 ${
              activeTab === 'articles'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('organizations')}
            className={`pb-2 border-b-2 ${
              activeTab === 'organizations'
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-600'
            }`}
          >
            Organizations
          </button>
        </div>
      </div>

      {/* Recently viewed */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700">Recently viewed</h3>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <RefreshCw className="w-3 h-3" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-xs">−</button>
          </div>
        </div>

        <div className="space-y-2">
          {recentlyViewed.map((item) => (
            <div
              key={item.id}
              className="p-2 hover:bg-gray-50 rounded cursor-pointer group"
              onClick={() => {
                navigate(`/tickets/${item.id}`);
                onClose();
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Agent: {item.agent} • {item.time}
                  </div>
                </div>
                <span className="text-xs text-gray-400 ml-2">{item.ticketNumber}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently searched */}
      <div className="px-4 pb-4 border-t border-gray-200 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-700">Recently searched</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xs">−</button>
        </div>
        <div className="text-center py-4">
          <span className="text-sm text-gray-400">No results</span>
        </div>
      </div>
    </div>
  );
}
