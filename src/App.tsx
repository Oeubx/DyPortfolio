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
import { dataService } from './lib/supabaseClient';
import starterData from '../public/data/starterData.json';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem, SkillCategory } from './types';

export default function App() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>(starterData.skills);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const handleQuickDownload = () => {
    const resumeSection = document.getElementById('resume');
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#resume';
    }
  };

  const handleDownloadTelemetry = async (presetName: string, selectedCount: number) => {
    // Dispatches initial download timestamp to Supabase/offline logs (Module 4)
    await dataService.logDownload({
      presetName,
      consentLoggedIp: false,
    });
    console.info(`[Download Event] Triggered resume download with preset '${presetName}' (${selectedCount} items)`);
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
                  onDownloadTriggered={handleDownloadTelemetry}
                />
              </main>
            )}
          </div>

          <Footer onQuickDownload={handleQuickDownload} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
