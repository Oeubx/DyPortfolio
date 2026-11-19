import React from 'react';
import { ArrowRight, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { portfolioConfig } from '../../portfolio.config';

interface HomePageProps {
  onNavigateToResume?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToResume }) => {
  const { personal } = portfolioConfig;

  const highlights = [
    { title: 'Dynamic Resume Engine', desc: 'Select role presets or toggle individual skills on the fly' },
    { title: '1-Page ATS Compliance', desc: 'Strict single-page layout optimization ready for recruiters' },
    { title: 'Dynamic Credentials', desc: 'Upload and show/hide certificates without git commits' },
    { title: 'Audited Telemetry', desc: 'Instant downloads with non-intrusive visitor feedback' },
  ];

  return (
    <section id="home" className="pt-24 pb-20 border-b border-border-light dark:border-border-dark">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-light dark:border-border-dark text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-6 bg-surface-light dark:bg-surface-dark">
          <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
          <span>Dynamic Portfolio & Single-Page Resume Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white mb-6">
          {personal.name}
        </h1>

        {/* Subtitle / Roles */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium mb-8">
          {personal.titles.map((title: string, idx: number) => (
            <React.Fragment key={title}>
              <span>{title}</span>
              {idx < personal.titles.length - 1 && <span className="text-zinc-400 dark:text-zinc-600">•</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Bio Narrative */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {personal.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={onNavigateToResume}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Customize & Download Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg border border-border-light dark:border-border-dark text-sm font-semibold text-black dark:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
          >
            View Projects
          </a>
        </div>

        {/* Four Highlight Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light/50 dark:bg-surface-dark/50"
            >
              <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100 mb-2" />
              <div className="font-semibold text-sm text-black dark:text-white mb-1">
                {item.title}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
