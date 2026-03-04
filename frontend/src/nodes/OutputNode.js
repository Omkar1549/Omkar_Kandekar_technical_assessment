import React, { useState } from 'react';
import { Position } from 'reactflow';
import BaseNode from './BaseNode';

const OutputNode = ({ id, data }) => {
  const [outputName, setOutputName] = useState(data?.outputName || id);
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  
  const nodeHandles = [
    { type: 'target', position: Position.Left, id: 'value' }
  ];

  return (
    <BaseNode id={id} label="Output" handles={nodeHandles}>
      <div className="flex flex-col gap-3">
        {/* Name Field */}
        <div>
          <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Name</label>
          <input 
            type="text" 
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Output Type Selection */}
        <div>
          <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Type</label>
          <select 
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="Text">Text</option>
            <option value="File">File / PDF</option>
            <option value="Image">Image</option>
          </select>
        </div>

        <div className="mt-1 flex items-center gap-2 text-emerald-600">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_4px_#10b981]" />
            <span className="text-[9px] font-bold uppercase">Ready for export</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default OutputNode;