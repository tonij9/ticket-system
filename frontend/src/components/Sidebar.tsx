import { Inbox, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils.js';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface ViewItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const views: ViewItem[] = [
    { id: 'my_inbox', label: 'My Inbox', icon: <Inbox className="w-4 h-4" /> },
    { id: 'unsolved', label: 'All Unsolved Tickets', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'pending', label: 'Pending Tickets', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-4 border-b border-blue-800">
        <h2 className="text-xl font-bold">Ticket System</h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
            Views
          </div>
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                currentView === view.id
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800/50'
              )}
            >
              {view.icon}
              <span className="flex-1 text-left">{view.label}</span>
              {view.count !== undefined && (
                <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
                  {view.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
