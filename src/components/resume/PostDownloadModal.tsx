import React, { useState } from 'react';
import { X, Sparkles, Send, Check } from 'lucide-react';
import { portfolioConfig } from '../../../portfolio.config';

interface PostDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: {
    name?: string;
    contact?: string;
    reason?: string;
    consentLoggedIp?: boolean;
  }) => Promise<void>;
}

export const PostDownloadModal: React.FC<PostDownloadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('Hiring / Recruitment');
  const [customReason, setCustomReason] = useState('');
  const [consentLoggedIp, setConsentLoggedIp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalReason = reason === 'Other' && customReason ? customReason : reason;
      await onSubmit({
        name: name.trim() || undefined,
        contact: contact.trim() || undefined,
        reason: finalReason || undefined,
        consentLoggedIp,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit post-download feedback:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white transition"
          aria-label="Skip and close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center mx-auto text-black dark:text-white">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white">
              Details Received!
            </h3>
            <p className="text-xs text-zinc-500">
              Thank you for connecting with {portfolioConfig.personal.name}. Have a wonderful day!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header Banner */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-light dark:border-border-dark text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-surface-light dark:bg-surface-dark mb-3">
                <Sparkles className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                <span>Download Initiated Successfully</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-black dark:text-white mb-2">
                Thank You for Checking Out My Resume!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Providing your details below is <strong className="text-black dark:text-white font-semibold">100% optional</strong>.
                It is used solely for personal tracking and to know who was interested in my work. Your details are private and will never be shared.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Name <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe, Recruiter at TechCorp"
                  className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Contact Info <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Email or LinkedIn / X profile"
                  className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              {/* Purpose / Why */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Purpose of Download <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                >
                  <option value="Hiring / Recruitment">Hiring / Recruitment</option>
                  <option value="Freelance / Contract Opportunity">Freelance / Contract Opportunity</option>
                  <option value="Mentorship / Collaboration">Mentorship / Collaboration</option>
                  <option value="Portfolio Inspiration / Review">Portfolio Inspiration / Review</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {reason === 'Other' && (
                <div>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Specify your reason..."
                    className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs text-black dark:text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  />
                </div>
              )}

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-[11px] text-zinc-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentLoggedIp}
                  onChange={(e) => setConsentLoggedIp(e.target.checked)}
                  className="mt-0.5"
                />
                <span>Allow logging device summary for download analytics</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-light dark:border-border-dark">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
              >
                Skip / Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Submit Details'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
