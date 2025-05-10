import { createContext, useContext, useState, useMemo } from "react";

// Create context
export const AppContext = createContext();

// Context provider component
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    error,
    setError,
    // Add other global state here
  }), [user, isAuthenticated, loading, error]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for consuming the context
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}