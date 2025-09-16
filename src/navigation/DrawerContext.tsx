import React, { createContext, useContext } from 'react';

type DrawerContextType = {
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = DrawerContext.Provider;

export const useAppDrawer = (): DrawerContextType => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useAppDrawer must be used within DrawerProvider');
  return ctx;
};

