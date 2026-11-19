import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, Languages, Heart } from 'lucide-react';
import { PersonalDetailItem } from '../../types';
import { dataService } from '../../lib/supabaseClient';

interface PersonalDetailsManagerProps {
  details: PersonalDetailItem[];
  onRefresh: () => Promise<void>;
}

export const PersonalDetailsManager: React.FC<PersonalDetailsManagerProps> = ({ details, onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState<'language' | 'hobby' | 'interest' | 'custom'>('language');
  const [label, setLabel] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async (id: string, current: boolean) => {
    await dataService.togglePersonalDetailVisibility(id, !current);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      await dataService.deletePersonalDetail(id);
      await onRefresh();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label) return;

    setIsSubmitting(true);
    try {
      await dataService.addPersonalDetail({
        category,
        label,
        proficiency: proficiency || undefined,
        isVisible: true,
      });

      setLabel('');
      setProficiency('');
      setShowAddForm(false);
      await onRefresh();
    } catch (err) {
      console.error('Failed to add personal detail:', err);
      alert('Could not save item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = details.filter((d) => d.category === 'language');
  const hobbies = details.filter((d) => d.category !== 'language');

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
        <div>
          <h4 className="font-bold text-sm text-black dark:text-white">
            Personal Details & Attributes
          </h4>
          <p className="text-xs text-zinc-500">
            Dynamically manage spoken languages, hobbies, and personal highlights without git commits.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Add Detail'}</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark space-y-3"
        >
          <div className="font-bold text-xs uppercase tracking-wider text-black dark:text-white mb-2">
            New Personal Detail Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              >
                <option value="language">Spoken Language</option>
                <option value="hobby">Hobby / Interest</option>
                <option value="interest">Volunteering / Affiliation</option>
                <option value="custom">Custom Highlight</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Label / Name *
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={category === 'language' ? 'e.g. English, Mandarin' : 'e.g. Sound Engineering, Chess'}
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                Proficiency / Note
              </label>
              <input
                type="text"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                placeholder={category === 'language' ? 'e.g. Native, Fluent' : 'e.g. Audio mixing, Rapid'}
                className="w-full px-3 py-1.5 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-black dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Detail'}
            </button>
          </div>
        </form>
      )}

      {/* Languages Stack */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          <Languages className="w-3.5 h-3.5" />
          <span>Spoken & Written Languages ({languages.length})</span>
        </div>
        <div className="space-y-1.5">
          {languages.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                item.isVisible
                  ? 'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark'
                  : 'border-dashed border-zinc-300 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div>
                <span className="font-semibold text-black dark:text-white">{item.label}</span>
                {item.proficiency && (
                  <span className="text-zinc-500 ml-2">({item.proficiency})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggle(item.id, item.isVisible)}
                  className="p-1 rounded text-zinc-500 hover:text-black dark:hover:text-white"
                  title={item.isVisible ? 'Hide' : 'Show'}
                >
                  {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hobbies & Interests Stack */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>Hobbies, Interests & Highlights ({hobbies.length})</span>
        </div>
        <div className="space-y-1.5">
          {hobbies.map((item) => (
            <div
              key={item.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                item.isVisible
                  ? 'border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark'
                  : 'border-dashed border-zinc-300 dark:border-zinc-800 opacity-60'
              }`}
            >
              <div>
                <span className="font-semibold text-black dark:text-white">{item.label}</span>
                {item.proficiency && (
                  <span className="text-zinc-500 ml-2 text-[11px]">— {item.proficiency}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggle(item.id, item.isVisible)}
                  className="p-1 rounded text-zinc-500 hover:text-black dark:hover:text-white"
                  title={item.isVisible ? 'Hide' : 'Show'}
                >
                  {item.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-zinc-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
