import React, { useState, useEffect, useMemo } from 'react';
import { PortalItem, UserSettings } from './types';
import { DISGUISE_PRESETS, CATEGORIES } from './data/defaultItems';
import { Header } from './components/Header';
import { ItemCard } from './components/ItemCard';
import { PlayerModal } from './components/PlayerModal';
import { CustomItemModal } from './components/CustomItemModal';
import { SettingsModal } from './components/SettingsModal';
import { DisguiseOverlay } from './components/DisguiseOverlay';
import { 
  Star, 
  Clock, 
  FolderPlus, 
  RefreshCw, 
  Search,
  SlidersHorizontal,
  Layers
} from 'lucide-react';

const STORAGE_KEY = 'workspace_alpha_state_v1';

export default function App() {
  const [items, setItems] = useState<PortalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<PortalItem | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);

  // User persistent state
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      panicKey: '`',
      activeDisguise: 'classroom',
      enableSoundEffects: true,
      theaterMode: false,
      favorites: ['grid-2048', 'slope-run', 'block-stacker'],
      recentIds: [],
      customItems: []
    };
  });

  // Save settings on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Load JSON data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/items.json');
        if (res.ok) {
          const json = await res.json();
          setItems(json);
        }
      } catch (err) {
        console.error('Could not fetch items.json, loading fallback', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync tab cloaking on mount & disguise updates
  useEffect(() => {
    const disguise = DISGUISE_PRESETS.find(d => d.id === settings.activeDisguise);
    if (disguise && !isDisguised) {
      document.title = disguise.title;
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = disguise.iconUrl;
    }
  }, [settings.activeDisguise, isDisguised]);

  // Global Keyboard Listener for Panic Key, Search shortcut, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      const currentPanic = settings.panicKey.toLowerCase();
      const pressed = e.key.toLowerCase();
      if ((pressed === currentPanic || (currentPanic === 'space' && e.code === 'Space')) && !isInput) {
        e.preventDefault();
        setIsDisguised(d => !d);
        return;
      }

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      if (e.key === 'Escape') {
        if (isDisguised) {
          setIsDisguised(false);
        } else if (activeItem) {
          setActiveItem(null);
        } else if (showCustomModal) {
          setShowCustomModal(false);
        } else if (showSettings) {
          setShowSettings(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicKey, isDisguised, activeItem, showCustomModal, showSettings]);

  // Combine fetched items and custom user items
  const allItems = useMemo(() => {
    return [...settings.customItems, ...items];
  }, [items, settings.customItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
        const matchControl = item.controls.some(c => c.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCategory && !matchTag && !matchControl) {
          return false;
        }
      }

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Favorites') return settings.favorites.includes(item.id);
      if (selectedCategory === 'Recently Launched') return settings.recentIds.includes(item.id);
      if (selectedCategory === 'Custom Links') return !!item.isCustom;
      return item.category === selectedCategory;
    });
  }, [allItems, searchQuery, selectedCategory, settings.favorites, settings.recentIds]);

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSettings(prev => {
      const isFav = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id]
      };
    });
  };

  const handleLaunch = (item: PortalItem) => {
    setActiveItem(item);
    setSettings(prev => ({
      ...prev,
      recentIds: [item.id, ...prev.recentIds.filter(id => id !== item.id)].slice(0, 15)
    }));
  };

  const handleAddCustom = (newItem: PortalItem) => {
    setSettings(prev => ({
      ...prev,
      customItems: [newItem, ...prev.customItems]
    }));
    setActiveItem(newItem);
  };

  const handleClearCustom = () => {
    if (confirm('Are you sure you want to remove all custom added items?')) {
      setSettings(prev => ({ ...prev, customItems: [] }));
    }
  };

  const handleImportItems = (newItems: PortalItem[]) => {
    setSettings(prev => ({
      ...prev,
      customItems: [...newItems.filter(i => i.isCustom), ...prev.customItems]
    }));
  };

  const activeDisguiseOption = useMemo(() => {
    return DISGUISE_PRESETS.find(d => d.id === settings.activeDisguise) || DISGUISE_PRESETS[0];
  }, [settings.activeDisguise]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Geometric Balance Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onTriggerDisguise={() => setIsDisguised(true)}
        onOpenCustomModal={() => setShowCustomModal(true)}
        onOpenSettings={() => setShowSettings(true)}
        favoriteCount={settings.favorites.length}
        panicKey={settings.panicKey}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Category Navigation Bar (Geometric Balance Tabs) */}
        <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 overflow-x-auto pb-1 scrollbar-none select-none">
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              const isFavCat = cat === 'Favorites';
              const isRecentCat = cat === 'Recently Launched';
              const isCustomCat = cat === 'Custom Links';

              let count = 0;
              if (cat === 'All') count = allItems.length;
              else if (isFavCat) count = settings.favorites.length;
              else if (isRecentCat) count = settings.recentIds.length;
              else if (isCustomCat) count = settings.customItems.length;
              else count = allItems.filter(i => i.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 shrink-0 pb-1 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                      : 'hover:text-slate-800'
                  }`}
                >
                  {isFavCat && <Star className={`w-3.5 h-3.5 ${isActive ? 'fill-blue-600 text-blue-600' : 'text-amber-500'}`} />}
                  {isRecentCat && <Clock className="w-3.5 h-3.5 text-blue-500" />}
                  {isCustomCat && <FolderPlus className="w-3.5 h-3.5 text-purple-500" />}
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>{filteredItems.length} Modules Indexed</span>
          </div>
        </section>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-semibold">Indexing database modules...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white border border-slate-200 rounded-xl p-8 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">No Matching Modules</h3>
              <p className="text-xs text-slate-500 mt-1">
                No activity matches your query. You can add a new custom URL resource!
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add Custom Module</span>
              </button>
            </div>
          </div>
        ) : (
          /* Geometric Grid of Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onLaunch={handleLaunch}
                isFavorite={settings.favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Geometric Balance Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <span>Server Status: <span className="text-green-600 font-bold uppercase">Online</span></span>
          <span className="hidden sm:inline">Active Users: 1,204</span>
          <span>Catalog Version: v.1.04.12</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="hover:text-slate-700 cursor-pointer flex items-center gap-1"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Cloak & Hotkeys</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setIsDisguised(true)}
            className="hover:text-slate-700 cursor-pointer text-slate-500 font-medium"
          >
            Emergency Mask ({settings.panicKey})
          </button>
        </div>
      </footer>

      {/* Fullscreen Player Modal */}
      {activeItem && (
        <PlayerModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
          isFavorite={settings.favorites.includes(activeItem.id)}
          onToggleFavorite={handleToggleFavorite}
          onTriggerDisguise={() => setIsDisguised(true)}
          panicKey={settings.panicKey}
        />
      )}

      {/* Custom Item Adder Modal */}
      {showCustomModal && (
        <CustomItemModal
          onClose={() => setShowCustomModal(false)}
          onAdd={handleAddCustom}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
          allItems={allItems}
          onImportItems={handleImportItems}
          onClearCustom={handleClearCustom}
        />
      )}

      {/* Stealth Disguise Screen */}
      {isDisguised && (
        <DisguiseOverlay
          disguise={activeDisguiseOption}
          onExit={() => setIsDisguised(false)}
          panicKey={settings.panicKey}
        />
      )}
    </div>
  );
}
