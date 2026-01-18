import React from 'react';
import { Copy, Check } from 'lucide-react';

interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: unknown;
    duration: number;
    size: number;
  } | null;
  isLoading: boolean;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  isLoading,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Sending request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Send a request to see the response
        </p>
      </div>
    );
  }

  const isSuccess = response.status >= 200 && response.status < 300;
  const statusColor = isSuccess ? 'text-green-600' : 'text-red-600';

  const handleCopy = () => {
    const text = JSON.stringify(response.data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Status and metadata */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className={`text-2xl font-bold ${statusColor}`}>
              {response.status}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {response.statusText}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-semibold">{response.duration}ms</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Size</p>
            <p className="font-semibold">{(response.size / 1024).toFixed(2)}KB</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Timestamp</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
            Response
          </button>
          <button className="px-4 py-2 border-b-2 border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
            Headers
          </button>
        </div>
      </div>

      {/* Response Body */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
        <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
          {typeof response.data === 'string'
            ? response.data
            : JSON.stringify(response.data, null, 2)}
        </pre>
      </div>

      {/* Headers */}
      <div className="hidden bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="space-y-2 max-h-96 overflow-auto">
          {Object.entries(response.headers).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {key}:
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
