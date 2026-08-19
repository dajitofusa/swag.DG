import React, { useState } from 'react';
import { DisguiseOption } from '../types';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  MessageSquare, 
  Search, 
  User, 
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DisguiseOverlayProps {
  disguise: DisguiseOption;
  onExit: () => void;
  panicKey: string;
}

export const DisguiseOverlay: React.FC<DisguiseOverlayProps> = ({ disguise, onExit, panicKey }) => {
  const [docText, setDocText] = useState(
    "Assignment: Exploring Cellular Respiration and Energy Transfer\n\n1. Abstract\nCellular respiration is a fundamental metabolic process wherein organisms synthesize adenosine triphosphate (ATP) by combining oxygen with glucose molecules, discharging carbon dioxide and water as byproducts.\n\n2. Key Thermodynamic Stages\n- Glycolysis in cytosol: Converts 1 glucose into 2 pyruvate molecules.\n- Citric Acid Cycle (Krebs cycle) in mitochondrial matrix.\n- Oxidative Phosphorylation via electron transport chain across inner mitochondrial membrane."
  );

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 overflow-y-auto font-sans select-text">
      {/* Subtle Return Bar at the top */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Study Mode Active</span>
          <span className="text-slate-400">|</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px] text-slate-700 shadow-sm">{panicKey}</kbd> or click return</span>
        </div>
        <button 
          onClick={onExit}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-200 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Disguise</span>
        </button>
      </div>

      {disguise.previewType === 'docs' && (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          {/* Docs Menu Bar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <input 
                  type="text" 
                  defaultValue="Biology Lab Report - Cellular Respiration" 
                  className="font-medium text-slate-800 text-sm px-1 rounded hover:border hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-3 text-xs text-slate-500 px-1 mt-0.5">
                  <span className="hover:text-slate-800 cursor-pointer">File</span>
                  <span className="hover:text-slate-800 cursor-pointer">Edit</span>
                  <span className="hover:text-slate-800 cursor-pointer">View</span>
                  <span className="hover:text-slate-800 cursor-pointer">Insert</span>
                  <span className="hover:text-slate-800 cursor-pointer">Format</span>
                  <span className="hover:text-slate-800 cursor-pointer">Tools</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Saved to Drive</span>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium">Share</button>
            </div>
          </div>

          {/* Docs Paper Sheet */}
          <div className="flex-1 p-6 flex justify-center">
            <div className="w-full max-w-3xl bg-white min-h-[850px] shadow-sm border border-slate-200 rounded p-12">
              <textarea 
                value={docText} 
                onChange={(e) => setDocText(e.target.value)}
                className="w-full h-full min-h-[700px] resize-none border-none outline-none text-slate-800 text-base leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {disguise.previewType === 'classroom' && (
        <div className="min-h-screen bg-slate-100 flex flex-col">
          {/* Classroom Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
              <h1 className="text-base font-semibold text-slate-800">Google Classroom</h1>
            </div>
            <div className="flex items-center gap-4 text-slate-600 text-sm">
              <span className="hover:text-slate-900 cursor-pointer">Stream</span>
              <span className="hover:text-slate-900 cursor-pointer font-medium text-emerald-700 border-b-2 border-emerald-600 pb-1">Classwork</span>
              <span className="hover:text-slate-900 cursor-pointer">People</span>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                S
              </div>
            </div>
          </header>

          <main className="max-w-5xl w-full mx-auto p-6 space-y-6">
            {/* Banner */}
            <div className="bg-emerald-700 text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-bold">AP European History - Period 3</h2>
              <p className="text-emerald-100 text-sm mt-1">Instructor: Dr. Harrison • Room 304</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Upcoming */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Upcoming Deadlines
                </h3>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="font-medium text-slate-800">Chapter 14 DBQ Synthesis</p>
                    <p className="text-slate-500">Due Tomorrow, 11:59 PM</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <p className="font-medium text-slate-800">Primary Source Analysis</p>
                    <p className="text-slate-500">Due Friday</p>
                  </div>
                </div>
              </div>

              {/* Assignment Feed */}
              <div className="md:col-span-2 space-y-4">
                {[
                  {
                    title: "Unit 4 Assessment Practice: Industrial Revolution Dynamics",
                    date: "Posted Yesterday",
                    tag: "Due Oct 24",
                    type: "Assignment"
                  },
                  {
                    title: "Reading Companion: Enlightenment Thinkers & Social Contract",
                    date: "Posted Oct 18",
                    tag: "Reference Material",
                    type: "Material"
                  },
                  {
                    title: "Document-Based Question: Urbanization Shifts in Manchester",
                    date: "Posted Oct 15",
                    tag: "Graded (98/100)",
                    type: "Returned"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      )}

      {disguise.previewType === 'wikipedia' && (
        <div className="min-h-screen bg-white max-w-4xl mx-auto p-8 border-x border-slate-200">
          <h1 className="text-3xl font-serif font-normal border-b border-slate-300 pb-2 text-slate-900">
            Thermodynamics
          </h1>
          <div className="text-xs text-slate-500 mt-1 mb-6">From Wikipedia, the free encyclopedia</div>
          
          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-4">
            <p>
              <strong>Thermodynamics</strong> is a branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter. The behavior of these quantities is governed by the four laws of thermodynamics which convey a quantitative description using measurable macroscopic physical quantities.
            </p>
            <h2 className="text-xl font-serif border-b border-slate-200 pb-1 pt-4 text-slate-900">1. Fundamental Laws</h2>
            <p>
              The fundamental principles of thermodynamics are expressed in terms of four laws:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Zeroth Law:</strong> If two thermodynamic systems are each in thermal equilibrium with a third, they are in thermal equilibrium with each other.</li>
              <li><strong>First Law:</strong> Energy can neither be created nor destroyed, only altered in form (Conservation of Energy).</li>
              <li><strong>Second Law:</strong> The total entropy of an isolated system always increases over time.</li>
              <li><strong>Third Law:</strong> As a system approaches absolute zero, all processes cease and the entropy of a pure crystalline substance approaches zero.</li>
            </ul>
          </div>
        </div>
      )}

      {disguise.previewType === 'khan' && (
        <div className="min-h-screen bg-slate-50">
          <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-600 rounded flex items-center justify-center text-white font-bold text-xs">K</div>
              <span className="font-bold text-slate-800 text-sm">Khan Academy Practice</span>
            </div>
            <div className="text-xs text-slate-500">AP Calculus BC • Mastery Progress: 84%</div>
          </header>
          <div className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">Exercise: Integration by Parts</span>
            <h2 className="text-lg font-semibold text-slate-900">Evaluate the indefinite integral:</h2>
            <div className="p-4 bg-slate-50 rounded font-mono text-center text-base border border-slate-200 text-slate-800">
              ∫ x · e^(2x) dx
            </div>
            <p className="text-xs text-slate-600">Choose the appropriate substitution for u and dv using the LIATE mnemonic rule.</p>
          </div>
        </div>
      )}

      {disguise.previewType === 'canvas' && (
        <div className="min-h-screen bg-slate-100 flex">
          <div className="w-16 bg-slate-900 text-white flex flex-col items-center py-6 gap-6 text-xs">
            <GraduationCap className="w-6 h-6 text-red-500" />
            <span>Dashboard</span>
            <span>Courses</span>
            <span>Calendar</span>
            <span>Inbox</span>
          </div>
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Course Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['AP Physics C: Mechanics', 'Multivariable Calculus', 'English Literature 12'].map((c, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className={`h-24 ${i === 0 ? 'bg-blue-700' : i === 1 ? 'bg-indigo-700' : 'bg-emerald-700'}`}></div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm">{c}</h3>
                    <p className="text-xs text-slate-500 mt-1">Fall Semester 2026</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
