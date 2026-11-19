import React from 'react';
import { Mail, Linkedin, Twitter, Facebook, Github, Download } from 'lucide-react';
import { portfolioConfig } from '../../../portfolio.config';

interface FooterProps {
  onQuickDownload?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onQuickDownload }) => {
  const { personal } = portfolioConfig;

  return (
    <footer className="border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark py-14 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Brand & Copyright */}
        <div className="text-center md:text-left space-y-1">
          <div className="font-bold text-base tracking-tight text-black dark:text-white">
            {personal.name}
          </div>
          <p className="text-xs text-zinc-500">
            Dynamic Portfolio & Resume Builder • Licensed under MIT
          </p>
        </div>

        {/* Center: Contact & Social Channels */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {/* Professional Email */}
          <a
            href={`mailto:${personal.emailProfessional}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
            title="Professional Inquiries"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Pro Email</span>
          </a>

          {/* Personal Email */}
          <a
            href={`mailto:${personal.emailPersonal}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
            title="Personal Email"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Personal</span>
          </a>

          {/* LinkedIn */}
          {personal.socials.linkedin && (
            <a
              href={personal.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}

          {/* X / Twitter */}
          {personal.socials.x && (
            <a
              href={personal.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}

          {/* Facebook */}
          {personal.socials.facebook && (
            <a
              href={personal.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}

          {/* GitHub */}
          {personal.socials.github && (
            <a
              href={personal.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Right Column: Quick Download CV Button */}
        <div>
          <button
            onClick={onQuickDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download CV</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
