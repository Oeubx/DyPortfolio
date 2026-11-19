import React, { useState } from 'react';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectsPageProps {
  projects: ProjectItem[];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Derive unique tags
  const tags = ['all', ...Array.from(new Set(projects.flatMap((p) => p.tags)))];

  const filteredProjects = selectedTag === 'all'
    ? projects
    : projects.filter((p) => p.tags.includes(selectedTag));

  return (
    <section id="projects" className="py-20 border-b border-border-light dark:border-border-dark">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">
              <Layers className="w-4 h-4" />
              <span>Engineered Systems</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
              Featured Projects
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                  selectedTag === tag
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="p-6 rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:border-zinc-400 dark:hover:border-zinc-600 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-bold text-lg text-black dark:text-white">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white transition"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white transition"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-4">
                  {project.subtitle}
                </p>

                {/* Bullets */}
                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 mb-6 list-disc list-inside">
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border-light dark:border-border-dark">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded text-[11px] font-mono border border-border-light dark:border-border-dark text-zinc-700 dark:text-zinc-300 bg-surface-light dark:bg-surface-dark"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
