import React, {createContext, useContext} from 'react';
import {store, Store} from '../../stores/Store';

const StoreContext = createContext<Store | undefined>(undefined);

export const useStore = (): Store => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore должен использоваться внутри StoreProvider');
  }

  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};
