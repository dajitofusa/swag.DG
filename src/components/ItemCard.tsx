import React from 'react';
import { PortalItem } from '../types';
import { 
  Star, 
  Play, 
  Grid3X3, 
  Activity, 
  Boxes, 
  CornerDownRight, 
  Wind, 
  Sparkles, 
  Sliders, 
  ShieldAlert, 
  TrendingUp, 
  Keyboard, 
  Zap, 
  Layers
} from 'lucide-react';

interface ItemCardProps {
  item: PortalItem;
  onLaunch: (item: PortalItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

// Geometric Graphic Motifs corresponding to different simulations
const GeometricWatermark: React.FC<{ id: string; color: string }> = ({ id, color }) => {
  switch (id) {
    case 'grid-2048':
      return (
        <div className="grid grid-cols-2 gap-1.5 opacity-25">
          <div className="w-6 h-6 border-2 border-slate-800 rounded-sm"></div>
          <div className="w-6 h-6 bg-slate-800 rounded-sm"></div>
          <div className="w-6 h-6 bg-slate-800 rounded-sm"></div>
          <div className="w-6 h-6 border-2 border-slate-800 rounded-sm"></div>
        </div>
      );
    case 'slope-run':
      return (
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-800 opacity-25 skew-x-12"></div>
          <div className="absolute w-5 h-5 bg-blue-600 opacity-40 rounded-full -top-3"></div>
        </div>
      );
    case 'block-stacker':
      return (
        <div className="grid grid-cols-3 gap-1 opacity-25">
          <div className="w-4 h-4 bg-slate-800"></div>
          <div className="w-4 h-4 bg-slate-800"></div>
          <div className="w-4 h-4 bg-slate-800"></div>
          <div></div>
          <div className="w-4 h-4 bg-slate-800"></div>
        </div>
      );
    case 'retro-snake':
      return (
        <div className="flex gap-1 opacity-25">
          <div className="w-4 h-4 bg-slate-800"></div>
          <div className="w-4 h-4 bg-slate-800"></div>
          <div className="w-4 h-4 border-2 border-slate-800"></div>
        </div>
      );
    case 'pixel-flapper':
      return (
        <div className="flex items-center gap-3 opacity-25">
          <div className="w-3 h-12 bg-slate-800"></div>
          <div className="w-5 h-5 border-2 border-slate-800 rounded-full"></div>
          <div className="w-3 h-12 bg-slate-800"></div>
        </div>
      );
    case 'breakout-ball':
      return (
        <div className="flex flex-col items-center gap-2 opacity-25">
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-slate-800"></div>
            <div className="w-4 h-2 bg-slate-800"></div>
            <div className="w-4 h-2 bg-slate-800"></div>
          </div>
          <div className="w-12 h-2 bg-slate-800 rounded-sm"></div>
        </div>
      );
    case 'pong-rally':
      return (
        <div className="w-16 h-8 border-x-4 border-slate-800 flex items-center justify-center opacity-25">
          <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
        </div>
      );
    case 'mine-sweeper':
      return (
        <div className="grid grid-cols-3 gap-1 opacity-25">
          <div className="w-4 h-4 border border-slate-800 flex items-center justify-center text-[8px] font-bold">1</div>
          <div className="w-4 h-4 border border-slate-800 flex items-center justify-center text-[8px] font-bold">2</div>
          <div className="w-4 h-4 border border-slate-800 bg-slate-800"></div>
        </div>
      );
    case 'click-cookie':
      return (
        <div className="w-12 h-12 rounded-full border-4 border-dashed border-slate-800 opacity-25 flex items-center justify-center">
          <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
        </div>
      );
    case 'speed-typer':
      return (
        <div className="flex gap-1 opacity-25">
          <div className="h-6 w-2 bg-slate-800"></div>
          <div className="h-10 w-2 bg-slate-800"></div>
          <div className="h-4 w-2 bg-slate-800"></div>
          <div className="h-8 w-2 bg-slate-800"></div>
        </div>
      );
    case 'reaction-test':
      return (
        <div className="w-12 h-12 border-4 border-slate-800 rounded-full opacity-25 flex items-center justify-center">
          <div className="w-2 h-6 bg-slate-800 rotate-45"></div>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 border-2 border-slate-800 opacity-25 rotate-45"></div>
      );
  }
};

const tagColorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  emerald: { bg: 'bg-green-50', text: 'text-green-600' },
  violet: { bg: 'bg-purple-50', text: 'text-purple-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  rose: { bg: 'bg-red-50', text: 'text-red-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' }
};

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onLaunch,
  isFavorite,
  onToggleFavorite
}) => {
  const tagColor = tagColorMap[item.accentColor] || tagColorMap.blue;

  return (
    <div 
      onClick={() => onLaunch(item)}
      className="bg-white border border-slate-200 rounded-xl p-1 flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Geometric Aspect-Video Header Banner */}
      <div className="bg-slate-100 aspect-video rounded-lg mb-3 overflow-hidden flex items-center justify-center relative border border-slate-200/60">
        <GeometricWatermark id={item.id} color={item.accentColor} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>

        {/* Favorite Button on Card Top Right */}
        <button
          onClick={(e) => onToggleFavorite(item.id, e)}
          className={`absolute top-2 right-2 p-1.5 rounded-lg border transition-all ${
            isFavorite
              ? 'bg-white border-amber-300 text-amber-500 shadow-sm'
              : 'bg-white/80 border-slate-200 text-slate-400 hover:text-slate-700'
          }`}
          title={isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
        </button>

        {/* Launch Hover Badge */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3 py-1 bg-white text-slate-900 rounded-md font-bold text-xs shadow-md flex items-center gap-1">
            <Play className="w-3 h-3 fill-current text-blue-600" />
            <span>Launch</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-3 pb-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Geometric Tag & Metadata */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest ${tagColor.bg} ${tagColor.text}`}>
            {item.tags[0] || 'STEM'}
          </span>

          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            {item.controls.slice(0, 1).map((ctrl, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded truncate max-w-[80px]">
                {ctrl}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
