import React, { useState } from 'react';
import { Download, Sliders, Search, RefreshCw } from 'lucide-react';
import { portfolioConfig } from '../../../portfolio.config';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem, SkillCategory } from '../../types';
import { pdf } from '@react-pdf/renderer';
import { ResumeDataPayload, ResumePDFDocument } from './ResumePDF';

interface ResumeBuilderProps {
  initialExperiences: ExperienceItem[];
  initialProjects: ProjectItem[];
  initialSkills: SkillCategory[];
  initialCertificates: CertificateItem[];
  initialPersonalDetails: PersonalDetailItem[];
  density: 'compact' | 'standard' | 'relaxed';
  onDensityChange: (d: 'compact' | 'standard' | 'relaxed') => void;
  onPayloadChange: (payload: ResumeDataPayload) => void;
  onDownloadTriggered?: (presetName: string, selectedCount: number) => Promise<void>;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  initialExperiences,
  initialProjects,
  initialSkills,
  initialCertificates,
  initialPersonalDetails,
  density,
  onDensityChange,
  onPayloadChange,
  onDownloadTriggered,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('developer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Selection states
  const [selectedExpIds, setSelectedExpIds] = useState<Set<string>>(() => {
    return new Set(initialExperiences.map((e) => e.id));
  });

  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(() => {
    return new Set(initialProjects.map((p) => p.id));
  });

  const [selectedSkillCategories, setSelectedSkillCategories] = useState<Set<string>>(() => {
    return new Set(initialSkills.map((s) => s.category));
  });

  const [selectedCertIds, setSelectedCertIds] = useState<Set<string>>(() => {
    return new Set(initialCertificates.map((c) => c.id));
  });

  const [selectedDetailIds, setSelectedDetailIds] = useState<Set<string>>(() => {
    return new Set(initialPersonalDetails.map((d) => d.id));
  });

  // Apply role presets
  const applyPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = portfolioConfig.roles.presets.find((p) => p.id === presetId);

    if (!preset || presetId === 'custom') {
      return;
    }

    const tags = preset.defaultTags;

    // Filter experiences matching preset tags
    const matchedExps = initialExperiences.filter((e) =>
      e.tags.some((t) => tags.includes(t.toLowerCase()))
    );
    setSelectedExpIds(new Set(matchedExps.map((e) => e.id)));

    // Filter projects matching preset tags
    const matchedProjects = initialProjects.filter((p) =>
      p.tags.some((t) => tags.includes(t.toLowerCase()))
    );
    setSelectedProjectIds(new Set(matchedProjects.map((p) => p.id)));

    // Filter skills matching preset tags
    const matchedSkills = initialSkills.filter((s) =>
      s.tags.some((t) => tags.includes(t.toLowerCase()))
    );
    setSelectedSkillCategories(new Set(matchedSkills.map((s) => s.category)));

    emitPayloadChange(
      new Set(matchedExps.map((e) => e.id)),
      new Set(matchedProjects.map((p) => p.id)),
      new Set(matchedSkills.map((s) => s.category)),
      selectedCertIds,
      selectedDetailIds
    );
  };

  const emitPayloadChange = (
    expIds: Set<string>,
    projIds: Set<string>,
    skillCats: Set<string>,
    certIds: Set<string>,
    detailIds: Set<string>
  ) => {
    const payload: ResumeDataPayload = {
      experiences: initialExperiences.filter((e) => expIds.has(e.id)),
      projects: initialProjects.filter((p) => projIds.has(p.id)),
      skills: initialSkills.filter((s) => skillCats.has(s.category)),
      certificates: initialCertificates.filter((c) => certIds.has(c.id)),
      personalDetails: initialPersonalDetails.filter((d) => detailIds.has(d.id)),
    };
    onPayloadChange(payload);
  };

  const toggleExp = (id: string) => {
    const next = new Set(selectedExpIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedExpIds(next);
    setSelectedPreset('custom');
    emitPayloadChange(next, selectedProjectIds, selectedSkillCategories, selectedCertIds, selectedDetailIds);
  };

  const toggleProject = (id: string) => {
    const next = new Set(selectedProjectIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedProjectIds(next);
    setSelectedPreset('custom');
    emitPayloadChange(selectedExpIds, next, selectedSkillCategories, selectedCertIds, selectedDetailIds);
  };

  const toggleSkill = (cat: string) => {
    const next = new Set(selectedSkillCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelectedSkillCategories(next);
    setSelectedPreset('custom');
    emitPayloadChange(selectedExpIds, selectedProjectIds, next, selectedCertIds, selectedDetailIds);
  };

  const toggleCert = (id: string) => {
    const next = new Set(selectedCertIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedCertIds(next);
    emitPayloadChange(selectedExpIds, selectedProjectIds, selectedSkillCategories, next, selectedDetailIds);
  };

  const toggleDetail = (id: string) => {
    const next = new Set(selectedDetailIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedDetailIds(next);
    emitPayloadChange(selectedExpIds, selectedProjectIds, selectedSkillCategories, selectedCertIds, next);
  };

  // Export PDF Handler
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      const activePayload: ResumeDataPayload = {
        experiences: initialExperiences.filter((e) => selectedExpIds.has(e.id)),
        projects: initialProjects.filter((p) => selectedProjectIds.has(p.id)),
        skills: initialSkills.filter((s) => selectedSkillCategories.has(s.category)),
        certificates: initialCertificates.filter((c) => selectedCertIds.has(c.id)),
        personalDetails: initialPersonalDetails.filter((d) => selectedDetailIds.has(d.id)),
      };

      const selectedTotal =
        selectedExpIds.size +
        selectedProjectIds.size +
        selectedSkillCategories.size +
        selectedCertIds.size;

      // 1. Notify download handler (for Module 4 telemetry)
      if (onDownloadTriggered) {
        await onDownloadTriggered(selectedPreset, selectedTotal);
      }

      // 2. Generate PDF blob
      const doc = <ResumePDFDocument data={activePayload} />;
      const blob = await pdf(doc).toBlob();

      // 3. Trigger immediate browser download
      const filename = `${portfolioConfig.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate resume PDF:', err);
      alert('Could not export PDF. Please check your browser console.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark space-y-6">
      {/* Top Header & Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-black dark:text-white" />
            <h3 className="font-bold text-base text-black dark:text-white">
              Dynamic Controls
            </h3>
          </div>
          <button
            onClick={() => applyPreset('developer')}
            className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-black dark:hover:text-white transition"
            title="Reset to default developer preset"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Tailor which experiences, skills, and credentials appear in your resume.
        </p>

        {/* Role Presets Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark mb-4">
          {portfolioConfig.roles.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`py-1.5 px-2 rounded-md text-xs font-semibold transition text-center truncate ${
                selectedPreset === preset.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Layout Density Controls */}
        <div className="flex items-center justify-between text-xs pt-2 pb-1">
          <span className="text-zinc-500 font-medium">Page Density:</span>
          <div className="flex gap-1">
            {(['compact', 'standard', 'relaxed'] as const).map((d) => (
              <button
                key={d}
                onClick={() => onDensityChange(d)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize transition ${
                  density === d
                    ? 'font-bold underline text-black dark:text-white'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          placeholder="Filter skills or titles..."
          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Category Checklists Accordion / Stacks */}
      <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
        {/* Technical Skills Checklist */}
        <div>
          <div className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Technical Skills ({selectedSkillCategories.size}/{initialSkills.length})
          </div>
          <div className="space-y-1.5">
            {initialSkills.map((skillGroup) => (
              <label
                key={skillGroup.category}
                className="flex items-start gap-2.5 p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={selectedSkillCategories.has(skillGroup.category)}
                  onChange={() => toggleSkill(skillGroup.category)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-black dark:text-white block">
                    {skillGroup.category}
                  </span>
                  <span className="text-zinc-500 text-[11px] truncate block">
                    {skillGroup.items.join(', ')}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Checklist */}
        <div>
          <div className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Experience ({selectedExpIds.size}/{initialExperiences.length})
          </div>
          <div className="space-y-1.5">
            {initialExperiences.map((exp) => (
              <label
                key={exp.id}
                className="flex items-start gap-2.5 p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={selectedExpIds.has(exp.id)}
                  onChange={() => toggleExp(exp.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-black dark:text-white block truncate">
                    {exp.title}
                  </span>
                  <span className="text-zinc-500 text-[11px] block truncate">
                    {exp.company} • {exp.startDate} - {exp.endDate}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Featured Projects Checklist */}
        <div>
          <div className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">
            Featured Projects ({selectedProjectIds.size}/{initialProjects.length})
          </div>
          <div className="space-y-1.5">
            {initialProjects.map((proj) => (
              <label
                key={proj.id}
                className="flex items-start gap-2.5 p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={selectedProjectIds.has(proj.id)}
                  onChange={() => toggleProject(proj.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-black dark:text-white block truncate">
                    {proj.title}
                  </span>
                  <span className="text-zinc-500 text-[11px] block truncate">
                    {proj.techStack.join(', ')}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Certifications Checklist */}
        {initialCertificates.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Certifications ({selectedCertIds.size}/{initialCertificates.length})
            </div>
            <div className="space-y-1.5">
              {initialCertificates.map((cert) => (
                <label
                  key={cert.id}
                  className="flex items-start gap-2.5 p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedCertIds.has(cert.id)}
                    onChange={() => toggleCert(cert.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-black dark:text-white block truncate">
                      {cert.title}
                    </span>
                    <span className="text-zinc-500 text-[11px] block truncate">
                      {cert.issuer} • {cert.issueDate}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Personal Details (Languages & Hobbies) */}
        {initialPersonalDetails.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Languages & Details ({selectedDetailIds.size}/{initialPersonalDetails.length})
            </div>
            <div className="space-y-1.5">
              {initialPersonalDetails.map((detail) => (
                <label
                  key={detail.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-surface-light dark:hover:bg-surface-dark transition cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedDetailIds.has(detail.id)}
                    onChange={() => toggleDetail(detail.id)}
                  />
                  <span className="font-medium text-black dark:text-white">
                    {detail.label}
                  </span>
                  {detail.proficiency && (
                    <span className="text-zinc-500 text-[11px] italic">
                      ({detail.proficiency})
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Download Action Button */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm hover:opacity-90 transition shadow-lg disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Generating 1-Page PDF...' : 'Download Tailored Resume'}</span>
      </button>
    </div>
  );
};
