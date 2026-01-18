import React from 'react';
import { Copy, Download, Trash2 } from 'lucide-react';
import { useAppStore } from '../lib/store';

interface SaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, collectionId?: string) => void;
}

export const SaveRequestModal: React.FC<SaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [requestName, setRequestName] = React.useState('');
  const [selectedCollection, setSelectedCollection] = React.useState('');
  const { collections } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestName.trim()) {
      onSave(requestName, selectedCollection || undefined);
      setRequestName('');
      setSelectedCollection('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Save Request</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Request name"
            value={requestName}
            onChange={(e) => setRequestName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
          />

          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">No collection</option>
            {collections.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RequestActionsProps {
  onSave: () => void;
  onExport: () => void;
  onClear: () => void;
}

export const RequestActions: React.FC<RequestActionsProps> = ({
  onSave,
  onExport,
  onClear,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
        title="Save current request"
      >
        <Copy size={16} />
        Save
      </button>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
        title="Export request as JSON"
      >
        <Download size={16} />
        Export
      </button>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
        title="Clear request form"
      >
        <Trash2 size={16} />
        Clear
      </button>
    </div>
  );
};
