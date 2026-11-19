import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { AboutPage } from './pages/AboutPage';
import { DynamicResumePage } from './pages/DynamicResumePage';
import { PostDownloadModal } from './components/resume/PostDownloadModal';
import { dataService } from './lib/supabaseClient';
import starterData from '../public/data/starterData.json';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem, SkillCategory } from './types';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from './components/resume/ResumePDF';
import { portfolioConfig } from '../portfolio.config';

export default function App() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>(starterData.skills);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Post-download modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolioData() {
      setIsLoading(true);
      try {
        const [resumeData, certs, details] = await Promise.all([
          dataService.getResumeItems(),
          dataService.getCertificates(),
          dataService.getPersonalDetails(),
        ]);

        setExperiences(resumeData.experiences);
        setProjects(resumeData.projects);
        setCertificates(certs);
        setPersonalDetails(details);
        setSkills(starterData.skills);
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  // Handles download telemetry & opens post-download modal
  const handleDownloadTriggered = async (presetName: string, selectedCount: number) => {
    try {
      const logId = await dataService.logDownload({
        presetName,
        consentLoggedIp: false,
      });
      setActiveLogId(logId);
      console.info(`[Download Event] Registered log '${logId}' for preset '${presetName}' (${selectedCount} items)`);
    } catch (err) {
      console.warn('Failed to record initial download log:', err);
    } finally {
      // Trigger post-download modal with slight smooth delay so user sees browser download start
      setTimeout(() => {
        setIsModalOpen(true);
      }, 700);
    }
  };

  // Quick download from footer / hero
  const handleQuickDownload = async () => {
    try {
      // 1. Immediately dispatch telemetry
      const logId = await dataService.logDownload({
        presetName: 'Quick Download',
        consentLoggedIp: false,
      });
      setActiveLogId(logId);

      // 2. Generate and trigger PDF download immediately
      const defaultPayload = {
        experiences,
        projects,
        skills,
        certificates,
        personalDetails,
      };

      const doc = <ResumePDFDocument data={defaultPayload} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolioConfig.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 3. Open post-download modal
      setTimeout(() => {
        setIsModalOpen(true);
      }, 700);
    } catch (err) {
      console.error('Failed to trigger quick download:', err);
    }
  };

  // Updates download log if user fills out optional form
  const handleModalSubmit = async (details: {
    name?: string;
    contact?: string;
    reason?: string;
    consentLoggedIp?: boolean;
  }) => {
    if (activeLogId) {
      await dataService.updateDownloadLead(activeLogId, {
        name: details.name,
        contact: details.contact,
        reason: details.reason,
      });
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-black dark:text-white transition-colors duration-200 flex flex-col justify-between">
          <div>
            <Navbar />

            {isLoading ? (
              <div className="max-w-5xl mx-auto py-32 px-6 text-center text-sm text-zinc-500">
                Loading dynamic portfolio components...
              </div>
            ) : (
              <main>
                <HomePage onNavigateToResume={handleQuickDownload} />
                <ProjectsPage projects={projects} />
                <ExperiencesPage experiences={experiences} />
                <CertificatesPage certificates={certificates} />
                <AboutPage personalDetails={personalDetails} />
                <DynamicResumePage
                  experiences={experiences}
                  projects={projects}
                  skills={skills}
                  certificates={certificates}
                  personalDetails={personalDetails}
                  onDownloadTriggered={handleDownloadTriggered}
                />
              </main>
            )}
          </div>

          <Footer onQuickDownload={handleQuickDownload} />

          {/* Post-Download Feedback Modal */}
          <PostDownloadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
