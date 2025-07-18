import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const lightThemes = [
  { id: 'budgenixLight', label: 'Light' },
  { id: 'budgenixLightGreen', label: 'Light Green' },
  { id: 'budgenixLightOrange', label: 'Light Orange' },
];
const darkThemes = [
  { id: 'budgenixDark', label: 'Dark' },
  { id: 'budgenixDarkGreen', label: 'Dark Green' },
  { id: 'budgenixDarkOrange', label: 'Dark Orange' },
];

export function ThemeDropdown() {
  const { theme, setTheme } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = [...lightThemes, ...darkThemes].find(t => t.id === theme);

  const handleSelect = (id: string) => {
    setOpen(false);
    setTheme(id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="btn btn-sm btn-outline flex items-center justify-between w-full min-w-[10rem]"
      >
        <span>{current ? current.label : 'Select Theme'}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-base-200 rounded shadow border border-base-300 max-h-44 overflow-auto p-4 space-y-4">
          <div>
            <h3 className="text-xs font-bold mb-2 text-base-content">Light</h3>
            <div className="grid gap-1">
              {lightThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`flex items-center justify-between px-2 py-1 rounded hover:bg-base-300 w-full ${
                    theme === t.id ? 'font-bold' : ''
                  }`}
                >
                  <span className="text-sm">{t.label}</span>
                  {theme === t.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold mb-2 text-base-content">Dark</h3>
            <div className="grid gap-1">
              {darkThemes.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className={`flex items-center justify-between px-2 py-1 rounded hover:bg-base-300 w-full ${
                    theme === t.id ? 'font-bold' : ''
                  }`}
                >
                  <span className="text-sm">{t.label}</span>
                  {theme === t.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
