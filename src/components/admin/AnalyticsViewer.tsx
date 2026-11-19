import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, Calendar, User, Mail, Tag } from 'lucide-react';
import { DownloadLogEntry } from '../../types';
import { dataService } from '../../lib/supabaseClient';

export const AnalyticsViewer: React.FC = () => {
  const [logs, setLogs] = useState<DownloadLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getDownloadLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch download logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
        <div>
          <h4 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span>Resume Download Telemetry</span>
          </h4>
          <p className="text-xs text-zinc-500">
            Real-time audit log of resume downloads, visitor contact leads, and stated purposes.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Total Downloads
          </div>
          <div className="text-2xl font-black text-black dark:text-white mt-1">
            {logs.length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Identified Leads
          </div>
          <div className="text-2xl font-black text-black dark:text-white mt-1">
            {logs.filter((l) => l.userName || l.userEmail).length}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Primary Reason
          </div>
          <div className="text-sm font-bold text-black dark:text-white mt-2 truncate">
            {logs[0]?.downloadReason || 'Hiring / Review'}
          </div>
        </div>
      </div>

      {/* Table Stack */}
      {logs.length === 0 ? (
        <div className="text-center py-12 text-xs text-zinc-500 border border-dashed border-border-light dark:border-border-dark rounded-xl">
          No download events recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-border-light dark:border-border-dark rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-light dark:border-border-dark bg-surface-light/60 dark:bg-surface-dark/60 font-semibold text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-2.5">Date & Time</th>
                <th className="px-4 py-2.5">Visitor / Lead</th>
                <th className="px-4 py-2.5">Contact</th>
                <th className="px-4 py-2.5">Purpose ("Why")</th>
                <th className="px-4 py-2.5">Preset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark bg-background-light dark:bg-background-dark">
              {logs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-surface-light/40 dark:hover:bg-surface-dark/40 transition">
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {log.downloadedAt ? new Date(log.downloadedAt).toLocaleString() : 'Just now'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-black dark:text-white">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      {log.userName || <span className="text-zinc-400 italic">Anonymous Visitor</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      {log.userEmail || <span className="text-zinc-400">—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-zinc-700 dark:text-zinc-300">
                    {log.downloadReason || <span className="text-zinc-400 italic">Direct Download</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border border-border-light dark:border-border-dark text-zinc-600 dark:text-zinc-400 bg-surface-light dark:bg-surface-dark">
                      <Tag className="w-2.5 h-2.5" />
                      {log.presetName}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
