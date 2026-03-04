import React, { useState } from 'react';
import { Position } from 'reactflow';
import BaseNode from './BaseNode';

const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState(data?.systemPrompt || 'You are a helpful assistant.');

  // Define input and output handles
  const nodeHandles = [
    { type: 'target', position: Position.Left, id: 'system', style: { top: '33%' } },
    { type: 'target', position: Position.Left, id: 'prompt', style: { top: '66%' } },
    { type: 'source', position: Position.Right, id: 'response' },
  ];

  return (
    <BaseNode id={id} label="LLM Engine" handles={nodeHandles}>
      <div className="flex flex-col gap-3">
        {/* Model Selection Row */}
        <div>
          <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Model</label>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="claude-3-sonnet">Claude 3.5 Sonnet</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
          </select>
        </div>

        {/* System Prompt Field */}
        <div>
          <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">System Message</label>
          <div className="bg-slate-50 border border-slate-100 rounded p-2 text-[11px] text-slate-600 italic leading-snug">
            {systemPrompt}
          </div>
        </div>
        
        <div className="mt-1">
          <p className="text-[9px] text-indigo-500 font-medium">Ready for inference...</p>
        </div>
      </div>
    </BaseNode>
  );
};

export default LLMNode;