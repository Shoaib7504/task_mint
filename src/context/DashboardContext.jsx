"use client";

import { createContext, useContext, useState } from "react";

const DashboardContext = createContext({
  mobileOpen: false,
  setMobileOpen: () => {},
  openMobileMenu: () => {},
  closeMobileMenu: () => {},
});

export function DashboardProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        openMobileMenu: () => setMobileOpen(true),
        closeMobileMenu: () => setMobileOpen(false),
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}

export default DashboardContext;
