
import React, { useState, useCallback } from 'react';
import Experience from './components/Experience';
import UI from './components/UI';
import { TreeMorphState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);

  const toggleTree = useCallback(() => {
    setTreeState(prev => prev === TreeMorphState.SCATTERED ? TreeMorphState.TREE_SHAPE : TreeMorphState.SCATTERED);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Experience treeState={treeState} />
      
      <UI 
        treeState={treeState} 
        onToggleState={toggleTree}
      />

      {/* Vignette Overlay for Depth */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_250px_rgba(0,0,0,0.9)]" />
    </div>
  );
};

export default App;
