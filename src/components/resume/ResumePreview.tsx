import React from 'react';
import { portfolioConfig } from '../../../portfolio.config';
import { ResumeDataPayload } from './ResumePDF';

interface ResumePreviewProps {
  data: ResumeDataPayload;
  density: 'compact' | 'standard' | 'relaxed';
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, density }) => {
  const { personal } = portfolioConfig;

  const densityStyles = {
    compact: {
      padding: 'p-6',
      spacing: 'space-y-2',
      bulletGap: 'space-y-0.5',
      fontSize: 'text-[11px]',
      titleSize: 'text-lg',
      sectionTitle: 'text-[11px] mb-1.5',
    },
    standard: {
      padding: 'p-8',
      spacing: 'space-y-3.5',
      bulletGap: 'space-y-1',
      fontSize: 'text-xs',
      titleSize: 'text-xl',
      sectionTitle: 'text-xs mb-2',
    },
    relaxed: {
      padding: 'p-10',
      spacing: 'space-y-5',
      bulletGap: 'space-y-1.5',
      fontSize: 'text-sm',
      titleSize: 'text-2xl',
      sectionTitle: 'text-sm mb-2.5',
    },
  }[density];

  return (
    <div className="w-full flex justify-center">
      {/* Scaled A4 Sheet Container */}
      <div
        className={`w-full max-w-[700px] min-h-[900px] bg-white text-zinc-900 shadow-2xl rounded-sm border border-zinc-300 font-sans ${densityStyles.padding} transition-all duration-150 select-text`}
        style={{ aspectRatio: '1 / 1.414' }}
      >
        {/* Header */}
        <header className="border-b-2 border-zinc-900 pb-3 mb-3">
          <h1 className={`font-black uppercase tracking-wider text-zinc-900 ${densityStyles.titleSize}`}>
            {personal.name}
          </h1>
          <p className="font-semibold text-zinc-700 text-xs tracking-tight mb-1.5">
            {personal.titles.join(' | ')}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-600">
            <span>{personal.location}</span>
            <span>•</span>
            <span className="font-medium">{personal.emailProfessional}</span>
            {personal.socials.linkedin && (
              <>
                <span>•</span>
                <span>LinkedIn</span>
              </>
            )}
            {personal.socials.github && (
              <>
                <span>•</span>
                <span>GitHub</span>
              </>
            )}
          </div>
        </header>

        <div className={densityStyles.spacing}>
          {/* Technical Skills */}
          {data.skills.length > 0 && (
            <section>
              <h2 className={`font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900 ${densityStyles.sectionTitle}`}>
                Technical Skills
              </h2>
              <div className="space-y-1 text-zinc-800 text-[11px]">
                {data.skills.map((skillGroup) => (
                  <div key={skillGroup.category} className="flex items-baseline">
                    <span className="font-bold w-28 shrink-0 text-zinc-900">
                      {skillGroup.category}:
                    </span>
                    <span className="text-zinc-700 leading-tight">
                      {skillGroup.items.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professional Experience */}
          {data.experiences.length > 0 && (
            <section>
              <h2 className={`font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900 ${densityStyles.sectionTitle}`}>
                Experience
              </h2>
              <div className="space-y-2.5">
                {data.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <strong className="text-zinc-900 font-bold">{exp.title}</strong>
                        <span className="text-zinc-600 italic"> — {exp.company}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className={`list-disc list-inside mt-1 text-[11px] text-zinc-700 leading-tight ${densityStyles.bulletGap}`}>
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-snug">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Projects */}
          {data.projects.length > 0 && (
            <section>
              <h2 className={`font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900 ${densityStyles.sectionTitle}`}>
                Featured Projects
              </h2>
              <div className="space-y-2">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline text-xs">
                      <strong className="text-zinc-900 font-bold">{proj.title}</strong>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {proj.techStack.join(', ')}
                      </span>
                    </div>
                    {proj.bullets.length > 0 && (
                      <ul className={`list-disc list-inside mt-0.5 text-[11px] text-zinc-700 leading-tight ${densityStyles.bulletGap}`}>
                        {proj.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-snug">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certificates.length > 0 && (
            <section>
              <h2 className={`font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900 ${densityStyles.sectionTitle}`}>
                Certifications
              </h2>
              <div className="space-y-1 text-[11px]">
                {data.certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-baseline">
                    <span className="text-zinc-800">
                      <strong className="font-semibold text-zinc-900">{cert.title}</strong> ({cert.issuer})
                    </span>
                    <span className="text-[10px] text-zinc-500">{cert.issueDate}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Details (Languages & Hobbies) */}
          {data.personalDetails.length > 0 && (
            <section>
              <h2 className={`font-bold uppercase tracking-wider border-b border-zinc-400 pb-0.5 text-zinc-900 ${densityStyles.sectionTitle}`}>
                Additional Details
              </h2>
              <div className="flex items-baseline text-[11px]">
                <span className="font-bold w-28 shrink-0 text-zinc-900">
                  Languages & Interests:
                </span>
                <span className="text-zinc-700 leading-tight">
                  {data.personalDetails
                    .map((d) => `${d.label}${d.proficiency ? ` (${d.proficiency})` : ''}`)
                    .join(' • ')}
                </span>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
