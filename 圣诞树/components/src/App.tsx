import React, { useState } from 'react';
import Experience from '../components/Experience';
import UI from '../components/UI';
import { TreeMorphState } from './types';

function App() {
  const [treeState, setTreeState] = useState<TreeMorphState>(TreeMorphState.TREE_SHAPE);

  const toggleTreeState = () => {
    setTreeState(prev => 
      prev === TreeMorphState.TREE_SHAPE 
        ? TreeMorphState.SCATTERED 
        : TreeMorphState.TREE_SHAPE
    );
  };

  return (
    <div className="w-full h-screen relative">
      <Experience treeState={treeState} />
      <UI treeState={treeState} onToggleState={toggleTreeState} />
    </div>
  );
}

export default App;