'use client';

import { Moon, Sun } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ThemeToggleButtonProps {
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggleButton = ({
  showLabel = false,
  className,
}: ThemeToggleButtonProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useLayoutEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="outline"
      size={showLabel ? 'default' : 'icon'}
      onClick={toggleTheme}
      className={cn(
        'relative overflow-hidden transition-all',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      {showLabel && (
        <span className="text-sm">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};
