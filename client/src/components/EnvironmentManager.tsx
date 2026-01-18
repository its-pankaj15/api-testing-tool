import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useAppStore, type Environment } from '../lib/store';

interface EnvironmentManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const { environments, setEnvironments, activeEnvironment, setActiveEnvironment } =
    useAppStore();
  const [newEnvName, setNewEnvName] = useState('');

  const addEnvironment = () => {
    if (!newEnvName.trim()) return;

    const newEnv: Environment = {
      id: Date.now().toString(),
      name: newEnvName,
      variables: {},
      isActive: false,
    };

    setEnvironments([...environments, newEnv]);
    setNewEnvName('');
  };

  const deleteEnvironment = (id: string) => {
    setEnvironments(environments.filter((e) => e.id !== id));
    if (activeEnvironment?.id === id) {
      setActiveEnvironment(null);
    }
  };

  const selectEnvironment = (env: Environment) => {
    setActiveEnvironment(env);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Manage Environments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Add New Environment */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New environment name"
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={addEnvironment}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {/* Environments List */}
          <div className="space-y-2">
            {environments.map((env) => (
              <div
                key={env.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {env.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Object.keys(env.variables).length} variables
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectEnvironment(env)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        activeEnvironment?.id === env.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                    >
                      {activeEnvironment?.id === env.id ? 'Active' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteEnvironment(env.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
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
