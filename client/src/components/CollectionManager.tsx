import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppStore } from '../lib/store';

interface CollectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollectionManager: React.FC<CollectionManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const { collections, setCollections } = useAppStore();
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  const addCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      id: Date.now().toString(),
      name: newCollectionName,
      description: newCollectionDesc,
    };

    setCollections([...collections, newCollection]);
    setNewCollectionName('');
    setNewCollectionDesc('');
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((c: any) => c.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Manage Collections</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Add New Collection */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <textarea
              placeholder="Description (optional)"
              value={newCollectionDesc}
              onChange={(e) => setNewCollectionDesc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none h-20"
            />
            <button
              onClick={addCollection}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create Collection
            </button>
          </div>

          {/* Collections List */}
          <div className="space-y-2">
            {collections.map((collection: any) => (
              <div
                key={collection.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {collection.name}
                    </p>
                    {collection.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCollection(collection.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
