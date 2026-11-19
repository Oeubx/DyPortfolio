import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { ExperienceItem } from '../types';

interface ExperiencesPageProps {
  experiences: ExperienceItem[];
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({ experiences }) => {
  return (
    <section id="experiences" className="py-20 border-b border-border-light dark:border-border-dark">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Career History</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Experience & Leadership
          </h2>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-10 border-l border-border-light dark:border-border-dark pl-6 sm:pl-8 ml-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full border-2 border-background-light dark:bg-background-dark bg-black dark:bg-white" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <h3 className="font-bold text-lg text-black dark:text-white tracking-tight">
                  {exp.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {exp.startDate} — {exp.endDate}
                  </span>
                  {exp.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-semibold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{exp.company}</span>
                {exp.location && (
                  <span className="flex items-center gap-1 text-zinc-500">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </span>
                )}
              </div>

              {/* Achievement Bullets */}
              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-border-light dark:border-border-dark text-zinc-500 bg-surface-light dark:bg-surface-dark"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
