import React from 'react';
import { Menu, Grid, Folder, Calendar } from 'lucide-react';

export const PanicScreen = ({ onExit, panicKey }) => {
  const classes = [
    {
      name: 'AP United States History',
      section: 'Period 3 · Mr. Anderson',
      color: 'bg-emerald-700',
      due: 'Chapter 14 DBQ Outline (Due tomorrow, 11:59 PM)',
    },
    {
      name: 'AP Calculus BC',
      section: 'Period 2 · Dr. Martinez',
      color: 'bg-blue-700',
      due: 'Problem Set 8: Taylor Series',
    },
    {
      name: 'Honors Chemistry',
      section: 'Period 5 · Mrs. Taylor',
      color: 'bg-cyan-800',
      due: 'Lab Report 4: Stoichiometry Analysis',
    },
    {
      name: 'AP English Literature',
      section: 'Period 6 · Ms. Jenkins',
      color: 'bg-amber-700',
      due: 'Hamlet Act III Critical Essay Draft',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9fa] text-slate-800 flex flex-col font-sans select-none overflow-y-auto">
      {/* Google Classroom Top Nav */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-normal text-slate-700 tracking-tight">Google</span>
            <span className="text-xl font-medium text-slate-600">Classroom</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer">
            <Grid className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            S
          </div>
        </div>
      </header>

      {/* Classroom Content */}
      <main className="max-w-6xl w-full mx-auto p-6 flex-1">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="text-emerald-700 border-b-2 border-emerald-700 pb-2.5 font-semibold cursor-pointer">
              Enrolled Classes
            </span>
            <span className="hover:text-slate-900 pb-2.5 cursor-pointer">To-do</span>
            <span className="hover:text-slate-900 pb-2.5 cursor-pointer">Calendar</span>
          </div>

          <div className="text-xs text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-200 border rounded font-mono">{panicKey}</kbd> to return
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.name}
              className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Header Banner */}
              <div className={`${cls.color} text-white p-4 h-32 flex flex-col justify-between`}>
                <div>
                  <h3 className="font-semibold text-lg leading-tight hover:underline cursor-pointer">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-white/90 mt-1">{cls.section}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between min-h-[120px] bg-white">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Due soon
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 hover:underline cursor-pointer">
                    {cls.due}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 text-slate-500">
                  <button className="p-1 hover:bg-slate-100 rounded cursor-pointer">
                    <Folder className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded cursor-pointer">
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Return button */}
      <footer className="p-3 text-right">
        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
        >
          Exit Classroom Mode
        </button>
      </footer>
    </div>
  );
};
