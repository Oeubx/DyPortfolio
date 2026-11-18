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

// Offline-resilient data service
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
      return starterData.certificates;
    }

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return starterData.certificates;
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
      return starterData.certificates;
    }
  },

  async getPersonalDetails(): Promise<PersonalDetailItem[]> {
    if (!supabase) {
      return starterData.personalDetails as PersonalDetailItem[];
    }

    try {
      const { data, error } = await supabase
        .from('personal_details')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return starterData.personalDetails as PersonalDetailItem[];
      }

      return data.map((item) => ({
        id: item.id,
        category: item.category,
        label: item.label,
        proficiency: item.proficiency,
        isVisible: item.is_visible,
      }));
    } catch {
      return starterData.personalDetails as PersonalDetailItem[];
    }
  },

  async logDownload(entry: DownloadLogEntry): Promise<string | null> {
    if (!supabase) {
      console.info('[Offline Mode] Logged download event locally:', entry);
      return 'offline-log-id';
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
    if (!supabase || logId === 'offline-log-id') {
      console.info('[Offline Mode] Updated download lead locally:', lead);
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
  }
};
