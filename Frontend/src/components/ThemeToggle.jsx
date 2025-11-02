import React from 'react';
import { useTheme } from './ThemeProvider';

// Componente simples de toggle que usa o ThemeProvider já existente
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={next}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🖥️'} &nbsp; {theme}
    </button>
  );
}