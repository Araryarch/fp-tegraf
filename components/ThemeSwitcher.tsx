'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { id: 'dark', name: 'Dark' },
  { id: 'catppuccin', name: 'Catppuccin' },
  { id: 'everblush', name: 'Everblush' },
  { id: 'everforest', name: 'Everforest' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'tokyo-night', name: 'Tokyo Night' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
];

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
      >
        <Palette size={16} className="text-primary" />
        <span className="capitalize">{themes.find(t => t.id === theme)?.name || 'Theme'}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl overflow-hidden py-1"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${theme === t.id ? 'text-primary font-bold' : 'text-muted-foreground'}`}
              >
                {t.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
