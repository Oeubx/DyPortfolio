import React, { useState } from 'react';
import { Award, ExternalLink, Eye, X } from 'lucide-react';
import { CertificateItem } from '../types';

interface CertificatesPageProps {
  certificates: CertificateItem[];
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ certificates }) => {
  const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

  const visibleCertificates = certificates.filter((c) => c.isVisible);

  return (
    <section id="certificates" className="py-20 border-b border-border-light dark:border-border-dark">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-2">
            <Award className="w-4 h-4" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Certifications & Honors
          </h2>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCertificates.map((cert) => (
            <div
              key={cert.id}
              className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-600 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 bg-surface-light dark:bg-surface-dark">
                    {cert.issuer}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="font-bold text-base text-black dark:text-white mb-2 leading-snug">
                  {cert.title}
                </h3>
              </div>

              {/* Actions & Links */}
              <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark text-xs font-medium">
                {cert.fileUrl ? (
                  <button
                    onClick={() => setActiveModalCert(cert)}
                    className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                ) : (
                  <span className="text-zinc-400 text-[11px]">Verified</span>
                )}

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition"
                    title="External Verification Link"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {activeModalCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 shadow-2xl">
            <button
              onClick={() => setActiveModalCert(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-black dark:text-white mb-1">
              {activeModalCert.title}
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              Issued by {activeModalCert.issuer} • {activeModalCert.issueDate}
            </p>

            <div className="w-full h-80 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex items-center justify-center overflow-hidden">
              {activeModalCert.fileUrl ? (
                <img
                  src={activeModalCert.fileUrl}
                  alt={activeModalCert.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-xs text-zinc-400">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span>Verified Credential Record</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {activeModalCert.credentialUrl && (
                <a
                  href={activeModalCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-xs font-semibold text-black dark:text-white hover:bg-surface-light dark:hover:bg-surface-dark transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Verify on Issuer Site</span>
                </a>
              )}
              <button
                onClick={() => setActiveModalCert(null)}
                className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
