
import React from 'react';
import { TreeMorphState } from '../src/types';

interface UIProps {
  treeState: TreeMorphState;
  onToggleState: () => void;
}

const UI: React.FC<UIProps> = ({ treeState, onToggleState }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto">
          <h1 className="text-4xl md:text-6xl font-luxury text-yellow-400 drop-shadow-lg uppercase tracking-widest">
            Arix Signature
          </h1>
          <p className="text-emerald-300 text-sm md:text-lg mt-2 font-light tracking-widest opacity-80">
            Interactive Christmas Experience
          </p>
        </div>
        
        <div className="pointer-events-auto text-right">
          <p className="text-yellow-500 font-luxury text-xl italic">To zxy</p>
          <div className="w-16 h-[1px] bg-yellow-600 ml-auto mt-1" />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-center pointer-events-auto pb-12">
        <button
          onClick={onToggleState}
          className={`
            px-12 py-4 rounded-full border-2 transition-all duration-500 uppercase tracking-[0.2em] font-bold text-sm
            ${treeState === TreeMorphState.SCATTERED 
              ? 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/20' 
              : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.3)]'}
          `}
        >
          {treeState === TreeMorphState.SCATTERED ? 'Assemble Tree' : 'Scatter Elements'}
        </button>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-yellow-500/20 m-4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-yellow-500/20 m-4 pointer-events-none" />
    </div>
  );
};

export default UI;
