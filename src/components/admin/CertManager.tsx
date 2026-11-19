import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, Award, Upload } from 'lucide-react';
import { CertificateItem } from '../../types';
import { dataService } from '../../lib/supabaseClient';

interface CertManagerProps {
  certificates: CertificateItem[];
  onRefresh: () => Promise<void>;
}

export const CertManager: React.FC<CertManagerProps> = ({ certificates, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleVisibility = async (id: string, current: boolean) => {
    await dataService.toggleCertificateVisibility(id, !current);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this certificate record?')) {
      await dataService.deleteCertificate(id);
      await onRefresh();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) return;

    setIsSubmitting(true);
    try {
      await dataService.addCertificate(
        {
          title,
          issuer,
          issueDate: issueDate || new Date().toISOString().slice(0, 7),
          credentialUrl: credentialUrl || undefined,
          tags: ['verified'],
          isVisible: true,
        },
        selectedFile || undefined
      );

      setTitle('');
      setIssuer('');
      setIssueDate('');
      setCredentialUrl('');
      setSelectedFile(null);
      setShowAddForm(false);
      await onRefresh();
    } catch (err) {
      console.error('Failed to add certificate:', err);
      alert('Could not save certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
        <div>
          <h4 className="font-bold text-sm text-black dark:text-white">
            Certificate Vault
          </h4>
          <p className="text-xs text-zinc-500">
            Show, hide, or upload credentials without editing code or committing to Git.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add Certificate'}</span>
        </button>
      </div>

      {/* Add Certificate Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3"
        >
          <div className="font-bold text-xs uppercase tracking-wider text-black dark:text-white mb-2">
            New Certificate Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Certificate Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Issue Date (YYYY-MM)
              </label>
              <input
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g. 2024-06"
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Verification URL
              </label>
              <input
                type="url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              Certificate Image / PDF (Optional)
            </label>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border-light dark:border-border-dark cursor-pointer hover:bg-background-light dark:hover:bg-background-dark transition text-zinc-700 dark:text-zinc-300">
                <Upload className="w-3.5 h-3.5" />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </label>
              <span className="text-zinc-500 text-[11px] truncate">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading & Saving...' : 'Save Certificate'}
            </button>
          </div>
        </form>
      )}

      {/* Certificates List */}
      <div className="space-y-2">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
              cert.isVisible
                ? 'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark'
                : 'border-dashed border-zinc-300 dark:border-zinc-800 bg-surface-light/30 dark:bg-surface-dark/30 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <Award className="w-4 h-4 text-black dark:text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-xs text-black dark:text-white truncate">
                  {cert.title}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {cert.issuer} • {cert.issueDate} {!cert.isVisible && '(Hidden from Public)'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Show / Hide Toggle Button */}
              <button
                onClick={() => handleToggleVisibility(cert.id, cert.isVisible)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                  cert.isVisible
                    ? 'border-border-light dark:border-border-dark text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                    : 'border-zinc-400 text-zinc-500 hover:text-black'
                }`}
                title={cert.isVisible ? 'Hide from public' : 'Show publicly'}
              >
                {cert.isVisible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Hidden</span>
                  </>
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(cert.id)}
                className="p-1.5 rounded-lg border border-border-light dark:border-border-dark text-zinc-400 hover:text-red-500 transition"
                title="Delete Certificate"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
