import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem, SkillCategory } from '../types';
import { ResumeDataPayload } from '../components/resume/ResumePDF';
import { ResumeBuilder } from '../components/resume/ResumeBuilder';
import { ResumePreview } from '../components/resume/ResumePreview';

interface DynamicResumePageProps {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certificates: CertificateItem[];
  personalDetails: PersonalDetailItem[];
  onDownloadTriggered?: (presetName: string, selectedCount: number) => Promise<void>;
}

export const DynamicResumePage: React.FC<DynamicResumePageProps> = ({
  experiences,
  projects,
  skills,
  certificates,
  personalDetails,
  onDownloadTriggered,
}) => {
  const [density, setDensity] = useState<'compact' | 'standard' | 'relaxed'>('standard');

  const [activePayload, setActivePayload] = useState<ResumeDataPayload>(() => ({
    experiences,
    projects,
    skills,
    certificates,
    personalDetails,
  }));

  return (
    <section id="resume" className="py-20 border-b border-border-light dark:border-border-dark bg-surface-light/30 dark:bg-surface-dark/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span>Interactive Resume Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black dark:text-white mb-3">
            Dynamic Resume Customizer
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Choose a role preset or manually check/uncheck skills, experiences, and details.
            The live preview updates in real time and exports a recruiter-ready, ATS-compliant 1-page PDF.
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Builder Controls (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <ResumeBuilder
              initialExperiences={experiences}
              initialProjects={projects}
              initialSkills={skills}
              initialCertificates={certificates}
              initialPersonalDetails={personalDetails}
              density={density}
              onDensityChange={setDensity}
              onPayloadChange={setActivePayload}
              onDownloadTriggered={onDownloadTriggered}
            />
          </div>

          {/* Right Column: Live Scaled A4 Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs text-zinc-500 mb-3 px-2">
              <span className="flex items-center gap-1 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>Live 1-Page A4 Preview</span>
              </span>
              <span className="text-[11px] bg-surface-light dark:bg-surface-dark px-2 py-0.5 rounded border border-border-light dark:border-border-dark">
                ATS Formatted
              </span>
            </div>

            <ResumePreview data={activePayload} density={density} />
          </div>
        </div>
      </div>
    </section>
  );
};
