import React from 'react';
import { Trash2, MoreVertical } from 'lucide-react';
import { useAppStore, type RequestData } from '../lib/store';

interface SidebarProps {
  onSelectRequest: (request: RequestData) => void;
}

interface SidebarProps {
  onSelectRequest: (request: RequestData) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectRequest }) => {
  const {
    requestHistory,
    collections,
    sidebarOpen,
    toggleSidebar,
    clearHistory,
  } = useAppStore();

  const [activeTab, setActiveTab] = React.useState<'history' | 'collections'>(
    'history'
  );

  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          ←
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          History
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'collections'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Collections
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {activeTab === 'history' && (
          <>
            {requestHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
              >
                Clear History
              </button>
            )}
            {requestHistory.map((request: RequestData, index: number) => (
              <div
                key={index}
                onClick={() => onSelectRequest(request)}
                className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded">
                        {request.method}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {request.url}
                    </p>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {requestHistory.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No request history yet
              </p>
            )}
          </>
        )}

        {activeTab === 'collections' && (
          <>
            {collections.map((collection: any) => (
              <div
                key={collection.id}
                className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {collection.name}
                    </p>
                    {collection.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <MoreVertical size={16} className="text-gray-400" />
                </div>
              </div>
            ))}
            {collections.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                No collections yet
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};
