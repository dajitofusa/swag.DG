import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

export const StudyTimer: React.FC = () => {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'study') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };
  const switchMode = (newMode: 'study' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
      <div className="flex gap-1 bg-white p-0.5 rounded border border-slate-200">
        <button
          onClick={() => switchMode('study')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
            mode === 'study' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3 h-3" />
          <span>Focus</span>
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
            mode === 'break' 
              ? 'bg-green-600 text-white' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coffee className="w-3 h-3" />
          <span>Break</span>
        </button>
      </div>

      <span className="font-mono font-bold text-sm tracking-wider text-slate-800 min-w-[42px] text-center">
        {formattedTime}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          className={`p-1 rounded transition-colors ${
            isRunning 
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button
          onClick={reset}
          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
