export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
  tags: string[];
  isActive: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  techStack: string[];
  bullets: string[];
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  isActive: boolean;
}

export interface SkillCategory {
  category: string;
  items: string[];
  tags: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  fileUrl?: string;
  tags: string[];
  isVisible: boolean;
}

export interface PersonalDetailItem {
  id: string;
  category: 'language' | 'hobby' | 'interest' | 'custom';
  label: string;
  proficiency?: string;
  isVisible: boolean;
}

export interface DownloadLogEntry {
  id?: string;
  userEmail?: string;
  userName?: string;
  downloadReason?: string;
  presetName: string;
  consentLoggedIp: boolean;
  downloadedAt?: string;
}
