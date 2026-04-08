import { createContext, useContext, useReducer } from 'react';
import { appReducer, initialState } from './AppReducer';

const AppContextInternal = createContext(null);

export function AppProvider({ children, initialState: customInitialState, initialOverrides }) {
  const mergedInitialState = initialOverrides 
    ? { ...initialState, ...customInitialState, ...initialOverrides }
    : customInitialState || initialState;
    
  const [state, dispatch] = useReducer(
    appReducer,
    mergedInitialState
  );

  return (
    <AppContextInternal.Provider value={{ state, dispatch }}>
      {children}
    </AppContextInternal.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContextInternal);
  
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}

// Export AppProvider as AppContext for convenience
export { AppProvider as AppContext };
