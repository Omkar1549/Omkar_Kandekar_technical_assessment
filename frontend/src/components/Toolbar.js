import React from 'react';
import { 
  PlusSquare, 
  ArrowRightCircle, 
  Cpu, 
  Type,
  LayoutGrid
} from 'lucide-react';

const Toolbar = () => {
  // Function to handle the start of the drag event
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const DraggableNode = ({ type, label, icon: Icon }) => (
    <div
      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl cursor-grab hover:border-indigo-500 hover:shadow-md transition-all active:cursor-grabbing group min-w-[80px]"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="mb-2 text-gray-500 group-hover:text-indigo-600 transition-colors">
        <Icon size={20} />
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight group-hover:text-indigo-700">
        {label}
      </span>
    </div>
  );

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 p-2 rounded-2xl shadow-2xl flex items-center gap-3">
        {/* Brand/Label */}
        <div className="px-4 border-r border-gray-100 flex items-center gap-2">
          <LayoutGrid size={18} className="text-indigo-600" />
          <span className="text-sm font-black text-gray-800 tracking-tighter uppercase">
            Nodes
          </span>
        </div>

        {/* Draggable Items */}
        <div className="flex items-center gap-2">
          <DraggableNode type="input" label="Input" icon={PlusSquare} />
          <DraggableNode type="output" label="Output" icon={ArrowRightCircle} />
          <DraggableNode type="llm" label="LLM" icon={Cpu} />
          <DraggableNode type="text" label="Text" icon={Type} />
        </div>
        
        {/* Divider for future nodes */}
        <div className="h-10 w-[1px] bg-gray-100 mx-1"></div>
        
        <div className="pr-2">
            <p className="text-[8px] text-gray-300 font-bold uppercase rotate-90 origin-center">
                VectorShift
            </p>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;