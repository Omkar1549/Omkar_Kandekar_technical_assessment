import React, { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import BaseNode from './BaseNode';

const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input_var}}');
  const [variables, setVariables] = useState([]);
  const textRef = useRef(null);


  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = '0px';
      const scrollHeight = textRef.current.scrollHeight;
      textRef.current.style.height = scrollHeight + 'px';
    }
  }, [text]);


  useEffect(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [...text.matchAll(regex)].map(match => match[1]);

    setVariables([...new Set(matches)]);
  }, [text]);


  const nodeHandles = [

    { type: 'source', position: Position.Right, id: 'output' },


    ...variables.map((v, index) => ({
      type: 'target',
      position: Position.Left,
      id: v,

      style: { top: `${(index + 1) * (100 / (variables.length + 1))}%` }
    }))
  ];

  return (
    <BaseNode id={id} label="Text Processor" handles={nodeHandles}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
          Prompt Template
        </label>

        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="nodrag w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors font-mono leading-relaxed"
          style={{ resize: 'none', overflow: 'hidden' }}
          placeholder="Type {{variable}} here..."
        />

        {variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {variables.map(v => (
              <span key={v} className="text-[8px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded border border-indigo-100 font-bold uppercase tracking-tight">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default TextNode;