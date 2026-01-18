import { create, type SetState } from 'zustand';

export interface RequestData {
  id?: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: string;
  collectionId?: string;
}

export interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  duration: number;
  size: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive: boolean;
}

interface AppStore {
  // Current request
  currentRequest: RequestData;
  setCurrentRequest: (request: RequestData) => void;
  
  // Response
  currentResponse: Response | null;
  setCurrentResponse: (response: Response | null) => void;
  
  // History and collections
  requestHistory: RequestData[];
  addToHistory: (request: RequestData) => void;
  clearHistory: () => void;
  
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
  
  environments: Environment[];
  setEnvironments: (environments: Environment[]) => void;
  activeEnvironment: Environment | null;
  setActiveEnvironment: (env: Environment | null) => void;
  
  // UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppStore>((set: SetState<AppStore>) => ({
  currentRequest: {
    name: 'New Request',
    method: 'GET',
    url: '',
    headers: {},
    params: {},
    body: '',
  },
  setCurrentRequest: (request) => set({ currentRequest: request }),
  
  currentResponse: null,
  setCurrentResponse: (response) => set({ currentResponse: response }),
  
  requestHistory: [],
  addToHistory: (request: RequestData) =>
    set((state) => ({
      requestHistory: [request, ...state.requestHistory].slice(0, 50),
    })),
  clearHistory: () => set({ requestHistory: [] }),
  
  collections: [],
  setCollections: (collections: Collection[]) => set({ collections }),
  
  environments: [],
  setEnvironments: (environments: Environment[]) => set({ environments }),
  activeEnvironment: null,
  setActiveEnvironment: (env: Environment | null) => set({ activeEnvironment: env }),
  
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newValue));
      return { isDarkMode: newValue };
    }),
  
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  
  error: null,
  setError: (error: string | null) => set({ error }),
}));
