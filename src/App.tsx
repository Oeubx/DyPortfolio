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
import { dataService } from './lib/supabaseClient';
import { CertificateItem, ExperienceItem, PersonalDetailItem, ProjectItem } from './types';

export default function App() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
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

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-black dark:text-white transition-colors duration-200 flex flex-col justify-between">
          <div>
            <Navbar />

            {isLoading ? (
              <div className="max-w-5xl mx-auto py-32 px-6 text-center text-sm text-zinc-500">
                Loading portfolio components...
              </div>
            ) : (
              <main>
                <HomePage onNavigateToResume={handleQuickDownload} />
                <ProjectsPage projects={projects} />
                <ExperiencesPage experiences={experiences} />
                <CertificatesPage certificates={certificates} />
                <AboutPage personalDetails={personalDetails} />
              </main>
            )}
          </div>

          <Footer onQuickDownload={handleQuickDownload} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
