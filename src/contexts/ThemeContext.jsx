import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'techmatch-theme';

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', isDark ? '#091427' : '#edf4fc');
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* Theme still works without storage. */
    }
  }, [isDark]);
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark((value) => !value) }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
