import React, { useState } from 'react';
import { UserSettings, DisguiseOption, PortalItem } from '../types';
import { DISGUISE_PRESETS } from '../data/defaultItems';
import { 
  X, 
  Sliders, 
  EyeOff, 
  Download, 
  Upload, 
  Trash2, 
  Keyboard, 
  Check
} from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  allItems: PortalItem[];
  onImportItems: (items: PortalItem[]) => void;
  onClearCustom: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  settings,
  onUpdateSettings,
  allItems,
  onImportItems,
  onClearCustom
}) => {
  const [panicKey, setPanicKey] = useState(settings.panicKey);
  const [selectedDisguise, setSelectedDisguise] = useState(settings.activeDisguise);
  const [recordingKey, setRecordingKey] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!recordingKey) return;
    e.preventDefault();
    const key = e.key === ' ' ? 'Space' : e.key;
    setPanicKey(key);
    onUpdateSettings({ panicKey: key });
    setRecordingKey(false);
  };

  const handleDisguiseSelect = (id: string) => {
    setSelectedDisguise(id);
    onUpdateSettings({ activeDisguise: id });

    const option = DISGUISE_PRESETS.find(d => d.id === id);
    if (option) {
      document.title = option.title;
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = option.iconUrl;
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allItems, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "workspace_alpha_database.json");
    dlAnchorElem.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportItems(parsed);
          alert(`Successfully imported ${parsed.length} resources!`);
        }
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-5 text-xs text-slate-700 focus:outline-none"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base uppercase tracking-tight">Configuration & Cloaking</h2>
              <p className="text-slate-500 text-[11px]">Manage emergency hotkeys, tab masking, and data imports</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panic Hotkey */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-blue-600" />
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800">Panic Emergency Hotkey</span>
            </div>
            <button
              type="button"
              onClick={() => setRecordingKey(true)}
              className={`px-3 py-1.5 rounded-lg border font-mono font-bold transition-all ${
                recordingKey 
                  ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                  : 'bg-white border-slate-300 text-slate-900 shadow-sm hover:border-blue-500'
              }`}
            >
              {recordingKey ? 'Press any key...' : panicKey}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Pressing this key anywhere in the applet instantly activates the stealth study mask.
          </p>
        </div>

        {/* Tab Cloaker */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-blue-600" />
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800">Browser Tab Masking (Cloak)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Disguises the browser tab title and favicon to look like common classroom tools:
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {DISGUISE_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleDisguiseSelect(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                  selectedDisguise === item.id
                    ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <img src={item.iconUrl} alt="" className="w-4 h-4 shrink-0 rounded" />
                  <span className="truncate text-[11px]">{item.name}</span>
                </div>
                {selectedDisguise === item.id && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* JSON Backup */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-800 block">Database Storage</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors font-bold text-[11px]"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export items.json</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors font-bold text-[11px] cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-green-600" />
              <span>Import items.json</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            {settings.customItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCustom}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 transition-colors font-bold text-[11px] ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Custom ({settings.customItems.length})</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
