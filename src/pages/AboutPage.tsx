import React from 'react';
import { User, Languages, Heart, Sparkles, MapPin, Globe } from 'lucide-react';
import { portfolioConfig } from '../../portfolio.config';
import { PersonalDetailItem } from '../types';

interface AboutPageProps {
  personalDetails: PersonalDetailItem[];
}

export const AboutPage: React.FC<AboutPageProps> = ({ personalDetails }) => {
  const { personal } = portfolioConfig;

  const languages = personalDetails.filter((d) => d.category === 'language' && d.isVisible);
  const hobbies = personalDetails.filter((d) => d.category === 'hobby' && d.isVisible);
  const others = personalDetails.filter((d) => (d.category === 'interest' || d.category === 'custom') && d.isVisible);

  return (
    <section id="about" className="py-20 border-b border-border-light dark:border-border-dark">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">
            <User className="w-4 h-4" />
            <span>Behind the Code</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            About Me & Personal Details
          </h2>
        </div>

        {/* Narrative & Location */}
        <div className="space-y-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12">
          <p>
            Hello! I'm <strong className="text-black dark:text-white">{personal.name}</strong>, a developer dedicated to
            building clean, scalable web software with an emphasis on dynamic personalization, robust architecture, and
            transparent user experiences.
          </p>
          <p>
            I created <strong className="text-black dark:text-white">DyPortfolio</strong> (Dynamic + Portfolio) out of a real-world
            need: having a fast, reliable, and accessible portfolio that lets you customize resume contents on the fly based
            on role necessities while delivering high-speed, ATS-compliant single-page PDF exports anywhere you are.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 pt-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {personal.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Available for Remote Opportunities
            </span>
          </div>
        </div>

        {/* Dynamic Personal Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-light dark:border-border-dark">
          {/* Spoken Languages */}
          <div className="p-6 rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-4 h-4 text-black dark:text-white" />
              <h3 className="font-bold text-sm text-black dark:text-white uppercase tracking-wider">
                Spoken & Written Languages
              </h3>
            </div>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black dark:text-white">{lang.label}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium border border-border-light dark:border-border-dark text-zinc-500 bg-surface-light dark:bg-surface-dark">
                    {lang.proficiency || 'Proficient'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hobbies & Creative Pursuits */}
          <div className="p-6 rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-black dark:text-white" />
              <h3 className="font-bold text-sm text-black dark:text-white uppercase tracking-wider">
                Hobbies & Personal Interests
              </h3>
            </div>
            <div className="space-y-3">
              {hobbies.map((hobby) => (
                <div key={hobby.id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-black dark:text-white">{hobby.label}</span>
                  {hobby.proficiency && (
                    <span className="text-zinc-500 text-[11px] font-medium">{hobby.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom / Trivia Highlights */}
        {others.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light/40 dark:bg-surface-dark/40">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-black dark:text-white" />
              <h3 className="font-bold text-sm text-black dark:text-white uppercase tracking-wider">
                Additional Highlights
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {others.map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-border-light dark:border-border-dark text-zinc-700 dark:text-zinc-300 bg-background-light dark:bg-background-dark"
                >
                  {item.label} {item.proficiency ? `• ${item.proficiency}` : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
