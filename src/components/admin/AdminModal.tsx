import React, { useState } from 'react';
import { X, Shield, Award, Languages, BarChart3, LogIn, LogOut, CheckCircle } from 'lucide-react';
import { CertificateItem, PersonalDetailItem } from '../../types';
import { CertManager } from './CertManager';
import { PersonalDetailsManager } from './PersonalDetailsManager';
import { AnalyticsViewer } from './AnalyticsViewer';
import { useAuth } from '../../context/AuthContext';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificates: CertificateItem[];
  personalDetails: PersonalDetailItem[];
  onRefreshData: () => Promise<void>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  certificates,
  personalDetails,
  onRefreshData,
}) => {
  const { user, isAdmin, isConfigured, signInWithGoogle, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'certs' | 'details' | 'analytics'>('certs');
  const [demoAdminUnlocked, setDemoAdminUnlocked] = useState<boolean>(!isConfigured);

  if (!isOpen) return null;

  const hasAdminAccess = isAdmin || demoAdminUnlocked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-surface-light/40 dark:bg-surface-dark/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-black dark:text-white flex items-center gap-2">
                <span>Admin Management Portal</span>
                {hasAdminAccess && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                    Authorized
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500">
                Manage dynamic content, certificates, and view download telemetry in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Barrier if not signed in or not authorized */}
        {!hasAdminAccess ? (
          <div className="p-10 text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="w-12 h-12 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center mx-auto text-zinc-500">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-black dark:text-white">
              Restricted Admin Access
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This portal allows the portfolio owner to manage certificates, personal details, and view visitor download logs.
            </p>

            <div className="pt-2 space-y-3">
              {isConfigured ? (
                <button
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign in with Google Account</span>
                </button>
              ) : (
                <button
                  onClick={() => setDemoAdminUnlocked(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Unlock Template Demo Admin Mode</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between px-6 pt-3 border-b border-border-light dark:border-border-dark">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('certs')}
                  className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
                    activeTab === 'certs'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificates ({certificates.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
                    activeTab === 'details'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Languages & Hobbies ({personalDetails.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 pb-3 text-xs font-bold transition border-b-2 ${
                    activeTab === 'analytics'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-zinc-500 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Download Telemetry</span>
                </button>
              </div>

              {/* Status / Sign Out */}
              <div className="flex items-center gap-3 pb-3 text-xs">
                {user ? (
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1 text-zinc-500 hover:text-red-500 text-[11px]"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out ({user.email})</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-500">
                    Template Demo Mode
                  </span>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'certs' && (
                <CertManager certificates={certificates} onRefresh={onRefreshData} />
              )}
              {activeTab === 'details' && (
                <PersonalDetailsManager details={personalDetails} onRefresh={onRefreshData} />
              )}
              {activeTab === 'analytics' && <AnalyticsViewer />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
