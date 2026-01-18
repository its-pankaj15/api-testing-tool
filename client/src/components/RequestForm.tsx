import React from 'react';
import { useAppStore } from '../lib/store';

interface RequestFormProps {
  onSend?: () => void;
  isLoading?: boolean;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSend: _onSend, isLoading: _isLoading }) => {
  const {
    currentRequest,
    setCurrentRequest,
    activeEnvironment,
  } = useAppStore();

  const updateRequest = (
    field: keyof typeof currentRequest,
    value: unknown
  ) => {
    setCurrentRequest({
      ...currentRequest,
      [field]: value,
    });
  };

  const updateHeader = (key: string, value: string) => {
    const newHeaders = { ...currentRequest.headers };
    if (value === '') {
      delete newHeaders[key];
    } else {
      newHeaders[key] = value;
    }
    updateRequest('headers', newHeaders);
  };

  const updateParam = (key: string, value: string) => {
    const newParams = { ...currentRequest.params };
    if (value === '') {
      delete newParams[key];
    } else {
      newParams[key] = value;
    }
    updateRequest('params', newParams);
  };

  const addHeader = () => {
    updateRequest('headers', {
      ...currentRequest.headers,
      'new-header': '',
    });
  };

  const addParam = () => {
    updateRequest('params', {
      ...currentRequest.params,
      'new-param': '',
    });
  };

  return (
    <div className="space-y-4">
      {/* URL and Method */}
      <div className="flex gap-2">
        <select
          value={currentRequest.method}
          onChange={(e) => updateRequest('method', e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-semibold text-gray-900 dark:text-white"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
          <option>HEAD</option>
          <option>OPTIONS</option>
        </select>

        <input
          type="text"
          placeholder="https://api.example.com/endpoint"
          value={currentRequest.url}
          onChange={(e) => updateRequest('url', e.target.value)}
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />

        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors">
          Send
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Params
          </button>
          <button className="px-4 py-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            Headers
          </button>
          <button className="px-4 py-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            Body
          </button>
        </div>
      </div>

      {/* Params Tab */}
      <div className="space-y-2">
        {Object.entries(currentRequest.params).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const oldKey = key;
                const newParams = { ...currentRequest.params };
                delete newParams[oldKey];
                newParams[e.target.value] = value;
                updateRequest('params', newParams);
              }}
              placeholder="Key"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => updateParam(key, e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <button
              onClick={() => updateParam(key, '')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={addParam}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition-colors text-sm"
        >
          + Add Param
        </button>
      </div>

      {/* Headers Tab */}
      <div className="space-y-2 hidden">
        {Object.entries(currentRequest.headers).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <input
              type="text"
              value={key}
              onChange={(e) => {
                const oldKey = key;
                const newHeaders = { ...currentRequest.headers };
                delete newHeaders[oldKey];
                newHeaders[e.target.value] = value;
                updateRequest('headers', newHeaders);
              }}
              placeholder="Key"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => updateHeader(key, e.target.value)}
              placeholder="Value"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            />
            <button
              onClick={() => updateHeader(key, '')}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={addHeader}
          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition-colors text-sm"
        >
          + Add Header
        </button>
      </div>

      {/* Body Tab */}
      <div className="hidden">
        <textarea
          value={currentRequest.body}
          onChange={(e) => updateRequest('body', e.target.value)}
          placeholder='{"key": "value"}'
          className="w-full h-40 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
        />
      </div>

      {activeEnvironment && (
        <div className="p-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded text-sm text-blue-800 dark:text-blue-200">
          Using environment: <strong>{activeEnvironment.name}</strong>
        </div>
      )}
    </div>
  );
};
