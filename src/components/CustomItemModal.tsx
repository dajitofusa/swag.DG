import React, { useState } from 'react';
import { PortalItem } from '../types';
import { X, Plus, Link, Code, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/defaultItems';

interface CustomItemModalProps {
  onClose: () => void;
  onAdd: (item: PortalItem) => void;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Logic & Strategy');
  const [description, setDescription] = useState('');
  const [embedMode, setEmbedMode] = useState<'url' | 'code'>('url');
  const [iframeSrc, setIframeSrc] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [controlsInput, setControlsInput] = useState('Mouse / Keyboard');
  const [tagsInput, setTagsInput] = useState('STEM, Logic');
  const [accentColor, setAccentColor] = useState<'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan'>('blue');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: PortalItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category === 'All' || category === 'Favorites' || category === 'Recently Launched' ? 'Custom Links' : category,
      description: description.trim() || 'Custom computational model and resource.',
      iframeSrc: embedMode === 'url' ? iframeSrc.trim() : undefined,
      srcDoc: embedMode === 'code' ? srcDoc.trim() : undefined,
      controls: controlsInput.split(',').map(s => s.trim()).filter(Boolean),
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
      icon: 'Layers',
      accentColor,
      isCustom: true,
      addedAt: Date.now()
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base uppercase tracking-tight">Add Activity Module</h2>
              <p className="text-xs text-slate-500">Embed any web URL or HTML iframe code into the workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Module Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Physics Sandbox 2.0"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Category & Accent */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {CATEGORIES.filter(c => c !== 'Favorites' && c !== 'Recently Launched').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Theme Tag</label>
              <select
                value={accentColor}
                onChange={e => setAccentColor(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="blue">Blue STEM</option>
                <option value="emerald">Green Logic</option>
                <option value="violet">Purple Math</option>
                <option value="amber">Amber Calc</option>
                <option value="rose">Red Core</option>
                <option value="cyan">Cyan Tech</option>
              </select>
            </div>
          </div>

          {/* Embed Mode Tabs */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Embed Source</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setEmbedMode('url')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold uppercase text-[10px] tracking-wider transition-all ${
                  embedMode === 'url'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                <span>Web URL</span>
              </button>
              <button
                type="button"
                onClick={() => setEmbedMode('code')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold uppercase text-[10px] tracking-wider transition-all ${
                  embedMode === 'code'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw HTML / Iframe</span>
              </button>
            </div>

            {embedMode === 'url' ? (
              <input
                type="url"
                required
                placeholder="https://example.com/embed"
                value={iframeSrc}
                onChange={e => setIframeSrc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
              />
            ) : (
              <textarea
                required
                rows={3}
                placeholder="<iframe src='...' width='100%' height='100%'></iframe>"
                value={srcDoc}
                onChange={e => setSrcDoc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs resize-none"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Description</label>
            <input
              type="text"
              placeholder="Brief summary of activity functionality..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Controls & Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Controls (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Arrow keys, Space"
                value={controlsInput}
                onChange={e => setControlsInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold uppercase tracking-wider text-[10px] mb-1">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. STEM, Logic, Math"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save & Launch</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
