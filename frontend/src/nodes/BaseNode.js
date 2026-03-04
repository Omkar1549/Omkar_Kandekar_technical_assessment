import React from 'react';
import { Handle, Position } from 'reactflow';


const BaseNode = ({ id, label, children, handles = [] }) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-md hover:border-indigo-500 transition-all p-4 min-w-[200px]">
      {/* Node Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>

      {/* Main UI */}
      <div className="text-sm text-slate-700">
        {children}
      </div>

      {/* Handles Logic (Part 1) */}
      {handles.map((h, idx) => (
        <Handle
          key={`${id}-${idx}`}
          type={h.type}
          position={h.position}
          id={`${id}-${h.id}`}
          style={{ 
            background: h.type === 'source' ? '#6366f1' : '#94a3b8', 
            width: 8, height: 8, 
            ...h.style 
          }}
        />
      ))}
    </div>
  );
};

export default BaseNode;