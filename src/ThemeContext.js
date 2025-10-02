import React, { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const v = localStorage.getItem('theme_dark');
      return v ? JSON.parse(v) : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme_dark', JSON.stringify(dark));
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  const toggle = useCallback(() => setDark(d => !d), []);

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}
