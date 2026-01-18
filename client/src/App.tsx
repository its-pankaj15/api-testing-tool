import React, { useEffect } from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { RequestForm } from './components/RequestForm';
import { ResponseViewer } from './components/ResponseViewer';
import { useAppStore } from './lib/store';
import { apiClient } from './lib/api';
import type { RequestData } from './lib/store';

function App() {
  const {
    isDarkMode,
    toggleDarkMode,
    sidebarOpen,
    toggleSidebar,
    currentRequest,
    setCurrentRequest,
    currentResponse,
    setCurrentResponse,
    addToHistory,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSendRequest = async () => {
    if (!currentRequest.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.sendRequest(currentRequest);
      setCurrentResponse(response);
      addToHistory(currentRequest);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);
      setCurrentResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRequest = (request: RequestData) => {
    setCurrentRequest(request);
    setCurrentResponse(null);
  };;

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar onSelectRequest={handleSelectRequest} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-2xl font-bold">API Testing Tool</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Area */}
        <div className="flex-1 overflow-auto flex flex-col">
          <div className="flex-1 flex flex-col gap-4 p-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-800 dark:text-red-100">
                {error}
              </div>
            )}

            {/* Request Section */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Request</h2>
              <RequestForm />
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            {/* Response Section */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Response</h2>
              <ResponseViewer response={currentResponse} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
