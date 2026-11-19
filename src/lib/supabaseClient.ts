import { createClient, SupabaseClient } from '@supabase/supabase-js';
import starterData from '../../public/data/starterData.json';
import { CertificateItem, DownloadLogEntry, ExperienceItem, PersonalDetailItem, ProjectItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon')
);

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory local state cache for offline template mode
let localCertificates: CertificateItem[] = [...starterData.certificates];
let localPersonalDetails: PersonalDetailItem[] = [...(starterData.personalDetails as PersonalDetailItem[])];
const localDownloadLogs: DownloadLogEntry[] = [
  {
    id: 'sample-log-1',
    presetName: 'Software Developer',
    userName: 'Alex Rivera (Demo Lead)',
    userEmail: 'alex.recruiter@example.com',
    downloadReason: 'Hiring / Fullstack Role',
    consentLoggedIp: true,
    downloadedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'sample-log-2',
    presetName: 'Systems & Architecture',
    userName: 'Jordan Lee (Tech Lead)',
    userEmail: 'jordan@devopscloud.io',
    downloadReason: 'Freelance Project',
    consentLoggedIp: false,
    downloadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

export const dataService = {
  async getResumeItems(): Promise<{ experiences: ExperienceItem[]; projects: ProjectItem[] }> {
    if (!supabase) {
      return {
        experiences: starterData.experiences,
        projects: starterData.projects,
      };
    }

    try {
      const { data, error } = await supabase
        .from('resume_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return {
          experiences: starterData.experiences,
          projects: starterData.projects,
        };
      }

      const experiences = data
        .filter((item) => item.category === 'experience')
        .map((item) => ({
          id: item.id,
          title: item.title,
          company: item.subtitle || '',
          location: item.location || '',
          startDate: item.start_date || '',
          endDate: item.end_date || '',
          isCurrent: item.is_current,
          bullets: item.description || [],
          tags: item.tags || [],
          isActive: item.is_active,
        }));

      const projects = data
        .filter((item) => item.category === 'project')
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          techStack: item.tags || [],
          bullets: item.description || [],
          tags: item.tags || [],
          isActive: item.is_active,
        }));

      return { experiences, projects };
    } catch {
      return {
        experiences: starterData.experiences,
        projects: starterData.projects,
      };
    }
  },

  async getCertificates(): Promise<CertificateItem[]> {
    if (!supabase) {
      return localCertificates;
    }

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return localCertificates;
      }

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        issueDate: item.issue_date,
        credentialUrl: item.credential_url,
        fileUrl: item.file_url,
        tags: item.tags || [],
        isVisible: item.is_visible,
      }));
    } catch {
      return localCertificates;
    }
  },

  async addCertificate(cert: Omit<CertificateItem, 'id'>, file?: File): Promise<CertificateItem> {
    let fileUrl = cert.fileUrl || '';

    if (supabase && file) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: publicData } = supabase.storage
            .from('certificates')
            .getPublicUrl(filePath);
          fileUrl = publicData.publicUrl;
        }
      } catch (err) {
        console.warn('Storage upload failed, proceeding with url:', err);
      }
    }

    if (!supabase) {
      const newCert: CertificateItem = {
        ...cert,
        id: `cert-${Date.now()}`,
        fileUrl,
      };
      localCertificates = [newCert, ...localCertificates];
      return newCert;
    }

    const { data, error } = await supabase
      .from('certificates')
      .insert({
        title: cert.title,
        issuer: cert.issuer,
        issue_date: cert.issueDate,
        credential_url: cert.credentialUrl || null,
        file_url: fileUrl || null,
        tags: cert.tags,
        is_visible: cert.isVisible,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      issuer: data.issuer,
      issueDate: data.issue_date,
      credentialUrl: data.credential_url,
      fileUrl: data.file_url,
      tags: data.tags || [],
      isVisible: data.is_visible,
    };
  },

  async toggleCertificateVisibility(id: string, isVisible: boolean): Promise<boolean> {
    if (!supabase) {
      localCertificates = localCertificates.map((c) =>
        c.id === id ? { ...c, isVisible } : c
      );
      return true;
    }

    const { error } = await supabase
      .from('certificates')
      .update({ is_visible: isVisible })
      .eq('id', id);

    return !error;
  },

  async deleteCertificate(id: string): Promise<boolean> {
    if (!supabase) {
      localCertificates = localCertificates.filter((c) => c.id !== id);
      return true;
    }

    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    return !error;
  },

  async getPersonalDetails(): Promise<PersonalDetailItem[]> {
    if (!supabase) {
      return localPersonalDetails;
    }

    try {
      const { data, error } = await supabase
        .from('personal_details')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return localPersonalDetails;
      }

      return data.map((item) => ({
        id: item.id,
        category: item.category,
        label: item.label,
        proficiency: item.proficiency,
        isVisible: item.is_visible,
      }));
    } catch {
      return localPersonalDetails;
    }
  },

  async addPersonalDetail(detail: Omit<PersonalDetailItem, 'id'>): Promise<PersonalDetailItem> {
    if (!supabase) {
      const newDetail: PersonalDetailItem = {
        ...detail,
        id: `detail-${Date.now()}`,
      };
      localPersonalDetails = [...localPersonalDetails, newDetail];
      return newDetail;
    }

    const { data, error } = await supabase
      .from('personal_details')
      .insert({
        category: detail.category,
        label: detail.label,
        proficiency: detail.proficiency || null,
        is_visible: detail.isVisible,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      category: data.category,
      label: data.label,
      proficiency: data.proficiency,
      isVisible: data.is_visible,
    };
  },

  async togglePersonalDetailVisibility(id: string, isVisible: boolean): Promise<boolean> {
    if (!supabase) {
      localPersonalDetails = localPersonalDetails.map((d) =>
        d.id === id ? { ...d, isVisible } : d
      );
      return true;
    }

    const { error } = await supabase
      .from('personal_details')
      .update({ is_visible: isVisible })
      .eq('id', id);

    return !error;
  },

  async deletePersonalDetail(id: string): Promise<boolean> {
    if (!supabase) {
      localPersonalDetails = localPersonalDetails.filter((d) => d.id !== id);
      return true;
    }

    const { error } = await supabase
      .from('personal_details')
      .delete()
      .eq('id', id);

    return !error;
  },

  async logDownload(entry: DownloadLogEntry): Promise<string | null> {
    const timestamp = new Date().toISOString();

    if (!supabase) {
      const newLog: DownloadLogEntry = {
        ...entry,
        id: `offline-log-${Date.now()}`,
        downloadedAt: timestamp,
      };
      localDownloadLogs.unshift(newLog);
      return newLog.id || 'offline-log-id';
    }

    try {
      const { data, error } = await supabase
        .from('download_logs')
        .insert({
          preset_name: entry.presetName,
          consent_logged_ip: entry.consentLoggedIp,
          user_name: entry.userName || null,
          user_email: entry.userEmail || null,
          download_reason: entry.downloadReason || null,
          user_agent: navigator.userAgent,
        })
        .select('id')
        .single();

      if (error) {
        console.warn('Could not insert download log to Supabase:', error.message);
        return null;
      }
      return data?.id || null;
    } catch (err) {
      console.warn('Failed to dispatch download log:', err);
      return null;
    }
  },

  async updateDownloadLead(logId: string, lead: { name?: string; contact?: string; reason?: string }): Promise<boolean> {
    if (!supabase || logId.startsWith('offline-log-')) {
      const target = localDownloadLogs.find((l) => l.id === logId);
      if (target) {
        target.userName = lead.name;
        target.userEmail = lead.contact;
        target.downloadReason = lead.reason;
      }
      return true;
    }

    try {
      const { error } = await supabase
        .from('download_logs')
        .update({
          user_name: lead.name || null,
          user_email: lead.contact || null,
          download_reason: lead.reason || null,
        })
        .eq('id', logId);

      return !error;
    } catch {
      return false;
    }
  },

  async getDownloadLogs(): Promise<DownloadLogEntry[]> {
    if (!supabase) {
      return [...localDownloadLogs];
    }

    try {
      const { data, error } = await supabase
        .from('download_logs')
        .select('*')
        .order('downloaded_at', { ascending: false });

      if (error || !data) {
        return [...localDownloadLogs];
      }

      return data.map((item) => ({
        id: item.id,
        presetName: item.preset_name,
        userEmail: item.user_email,
        userName: item.user_name,
        downloadReason: item.download_reason,
        consentLoggedIp: item.consent_logged_ip,
        downloadedAt: item.downloaded_at,
      }));
    } catch {
      return [...localDownloadLogs];
    }
  },
};
