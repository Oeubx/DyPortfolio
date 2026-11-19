import React, { useState } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { portfolioConfig } from '../../../portfolio.config';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-light dark:border-border-dark bg-background-light/85 dark:bg-background-dark/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#home"
          className="font-bold text-lg tracking-tight text-black dark:text-white hover:opacity-80 transition"
        >
          {portfolioConfig.personal.name}
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {portfolioConfig.navigation.links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
            >
              {link.name}
            </a>
          ))}

          {/* Action Link to Resume */}
          <a
            href="#resume"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>

          <ThemeToggle />
        </nav>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-6 py-4 space-y-3">
          {portfolioConfig.navigation.links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#resume"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm font-semibold hover:opacity-90 transition"
          >
            <FileText className="w-4 h-4" />
            Dynamic Resume Customizer
          </a>
        </div>
      )}
    </header>
  );
};
