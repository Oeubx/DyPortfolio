import { useState, useEffect } from 'react';
import { portfolioConfig } from '../portfolio.config';
import starterData from '../public/data/starterData.json';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-black dark:text-white transition-colors duration-200">
      {/* Navigation */}
      <header className="border-b border-border-light dark:border-border-dark sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight">
            {portfolioConfig.personal.name}
          </div>
          <nav className="flex items-center gap-6 text-sm">
            {portfolioConfig.navigation.links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 rounded border border-border-light dark:border-border-dark text-xs uppercase tracking-wider hover:bg-surface-light dark:hover:bg-surface-dark transition"
              aria-label="Toggle theme"
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-4 inline-block">
          Dynamic Portfolio & ATS Resume Engine
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">
          {portfolioConfig.personal.name}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {portfolioConfig.personal.bio}
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href="#resume"
            className="px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition text-sm shadow-sm"
          >
            Customize & Download CV
          </a>
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg border border-border-light dark:border-border-dark font-medium hover:bg-surface-light dark:hover:bg-surface-dark transition text-sm"
          >
            Explore Projects ({starterData.projects.length})
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light dark:border-border-dark py-12 text-center text-sm text-zinc-500">
        <p>© 2026 {portfolioConfig.personal.name}. Open source under MIT License.</p>
      </footer>
    </div>
  );
}
