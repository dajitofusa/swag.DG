import React from 'react';
import { 
  Search, 
  EyeOff, 
  Plus, 
  Sliders, 
  Star,
  Layers,
  Sparkles,
  Command,
  Shield
} from 'lucide-react';
import { StudyTimer } from './StudyTimer';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTriggerDisguise: () => void;
  onOpenCustomModal: () => void;
  onOpenSettings: () => void;
  favoriteCount: number;
  panicKey: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onTriggerDisguise,
  onOpenCustomModal,
  onOpenSettings,
  favoriteCount,
  panicKey
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Geometric Balance Logo & Title */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center shadow-sm shrink-0">
              <div className="w-4 h-4 bg-white rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-lg tracking-tight uppercase">
                  Workspace Alpha
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded uppercase tracking-widest border border-blue-200">
                  v3.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Computational Simulations & Student Break Hub
              </p>
            </div>
          </div>

          {/* Quick Disguise Button on Mobile */}
          <button
            onClick={onTriggerDisguise}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold"
            title={`Panic Cloak (${panicKey})`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Cloak</span>
          </button>
        </div>

        {/* Geometric Search Bar */}
        <div className="w-full md:max-w-md relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <div className="w-4 h-4 border-2 border-slate-300 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search activity database... (Press /)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-8 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Controls & Study Timer */}
        <div className="flex items-center justify-end w-full md:w-auto gap-2.5">
          {/* Study / Break Timer */}
          <StudyTimer />

          {/* Add Resource */}
          <button
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
            title="Add Custom Resource"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Resource</span>
          </button>

          {/* Quick Disguise Button on Desktop */}
          <button
            onClick={onTriggerDisguise}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 font-semibold text-xs transition-all"
            title={`Activate Tab Disguise Screen (HotKey: ${panicKey})`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Disguise</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Settings & Cloaking"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
