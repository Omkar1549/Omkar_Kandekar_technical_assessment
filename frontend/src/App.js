import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge, Background, Controls, MiniMap,
  applyEdgeChanges, applyNodeChanges, ReactFlowProvider,
  Handle, Position, useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Icons ---
const Icons = {
  Text: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18.1H3"/></svg>,
  LLM:  () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="1" y2="4"/><line x1="15" x2="15" y1="1" y2="4"/><line x1="9" x2="9" y1="20" y2="23"/><line x1="15" x2="15" y1="20" y2="23"/><line x1="20" x2="23" y1="9" y2="9"/><line x1="20" x2="23" y1="15" y2="15"/><line x1="1" x2="4" y1="9" y2="9"/><line x1="1" x2="4" y1="15" y2="15"/></svg>,
  Input: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 16 14"/></svg>,
  Output: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

// --- BaseNode ---
const BaseNode = ({ id, label, icon: Icon, children, handles = [] }) => (
  <div style={{ background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)', padding:16, minWidth:220 }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #f1f5f9', paddingBottom:10, marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ padding:'5px 6px', background:'#eef2ff', color:'#4f46e5', borderRadius:8, display:'flex' }}><Icon /></div>
        <span style={{ fontSize:10, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.09em' }}>{label}</span>
      </div>
      <div style={{ width:8, height:8, background:'#34d399', borderRadius:'50%', boxShadow:'0 0 8px #34d399' }} />
    </div>
    <div style={{ color:'#334155', fontSize:14 }}>{children}</div>
    {handles.map((h, idx) => (
      <Handle
        key={`${id}-${h.id}-${idx}`}
        type={h.type}
        position={h.position}
        id={h.id}
        style={{ width:10, height:10, background:'#6366f1', border:'2px solid #fff', ...h.style }}
      />
    ))}
  </div>
);

// --- TextNode ---
const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const taRef = useRef(null);

  useEffect(() => {
    if (taRef.current) { taRef.current.style.height = 'auto'; taRef.current.style.height = taRef.current.scrollHeight + 'px'; }
    const matches = [...text.matchAll(/\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g)].map(m => m[1]);
    setVariables([...new Set(matches)]);
  }, [text]);

  const handles = [
    { type:'source', position:Position.Right, id:'output' },
    ...variables.map((v, idx) => ({ type:'target', position:Position.Left, id:v, style:{ top:`${(idx+1)*(100/(variables.length+1))}%` } }))
  ];

  return (
    <BaseNode id={id} label="Text Engine" icon={Icons.Text} handles={handles}>
      <p style={{ fontSize:9, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', marginBottom:4 }}>Template</p>
      <textarea ref={taRef} value={text} onChange={e => setText(e.target.value)} className="nodrag"
        placeholder="Use {{variable}} syntax..."
        style={{ width:'100%', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'8px 10px', fontSize:11, fontFamily:'monospace', outline:'none', resize:'none', overflow:'hidden', boxSizing:'border-box' }}
      />
      {variables.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
          {variables.map(v => <span key={v} style={{ fontSize:9, fontWeight:700, background:'#ede9fe', color:'#7c3aed', padding:'2px 7px', borderRadius:99 }}>{`{{${v}}}`}</span>)}
        </div>
      )}
    </BaseNode>
  );
};

// --- LLMNode ---
const LLMNode = ({ id }) => (
  <BaseNode id={id} label="LLM Logic" icon={Icons.LLM} handles={[
    { type:'target', position:Position.Left,  id:'prompt',   style:{ top:'50%' } },
    { type:'source', position:Position.Right, id:'response' },
  ]}>
    <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8, padding:'8px 10px', fontSize:10, color:'#0369a1', fontStyle:'italic' }}>
      AI Inference Engine — awaiting prompt
    </div>
  </BaseNode>
);

// --- InputNode ---
const InputNode = ({ id }) => (
  <BaseNode id={id} label="Input" icon={Icons.Input} handles={[{ type:'source', position:Position.Right, id:'val' }]}>
    <input type="text" placeholder="Variable name..." className="nodrag"
      style={{ width:'100%', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, padding:'7px 10px', fontSize:12, outline:'none', boxSizing:'border-box' }}
    />
  </BaseNode>
);

// --- OutputNode ---
const OutputNode = ({ id }) => (
  <BaseNode id={id} label="Output" icon={Icons.Output} handles={[{ type:'target', position:Position.Left, id:'val' }]}>
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, fontWeight:700, color:'#059669', textTransform:'uppercase' }}>
      <span style={{ width:6, height:6, background:'#10b981', borderRadius:'50%', display:'inline-block' }} />
      Final Result Ready
    </div>
  </BaseNode>
);

const nodeTypes = { text:TextNode, llm:LLMNode, input:InputNode, output:OutputNode };

// --- DAG Validator (replaces Python backend) ---
function isDAG(nodes, edges) {
  const adj = Object.fromEntries(nodes.map(n => [n.id, []]));
  edges.forEach(e => { if (adj[e.source]) adj[e.source].push(e.target); });
  const visited = new Set(), rec = new Set();
  function dfs(n) {
    visited.add(n); rec.add(n);
    for (const nb of adj[n] || []) {
      if (!visited.has(nb) && dfs(nb)) return true;
      if (rec.has(nb)) return true;
    }
    rec.delete(n); return false;
  }
  return !nodes.some(n => !visited.has(n.id) && dfs(n.id));
}

// --- Toolbar ---
const Toolbar = () => {
  const onDragStart = (e, type) => { e.dataTransfer.setData('application/reactflow', type); e.dataTransfer.effectAllowed = 'move'; };
  const items = [
    { type:'input', label:'Input', Icon:Icons.Input },
    { type:'text',  label:'Text',  Icon:Icons.Text  },
    { type:'llm',   label:'LLM',   Icon:Icons.LLM   },
    { type:'output',label:'Output',Icon:Icons.Output},
  ];
  return (
    <div style={{ position:'fixed', top:18, left:'50%', transform:'translateX(-50%)', zIndex:100 }}>
      <div style={{ background:'rgba(255,255,255,0.92)', backdropFilter:'blur(14px)', border:'1px solid #e2e8f0', borderRadius:32, padding:'7px 10px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ paddingRight:12, borderRight:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ width:8, height:8, background:'#6366f1', borderRadius:'50%', display:'inline-block' }} />
          <span style={{ fontSize:11, fontWeight:900, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.07em' }}>Pipeline Builder</span>
        </div>
        {items.map(({ type, label, Icon }) => (
          <div key={type} draggable onDragStart={e => onDragStart(e, type)}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'9px 14px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, cursor:'grab', minWidth:62, transition:'all .18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow='none'; }}
          >
            <span style={{ color:'#94a3b8', marginBottom:3 }}><Icon /></span>
            <span style={{ fontSize:9, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Submit Button ---
const SubmitBtn = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [result, setResult] = useState(null);

  const handleSubmit = () => {
    const nodes = getNodes(), edges = getEdges();
    setResult({ num_nodes:nodes.length, num_edges:edges.length, is_dag:isDAG(nodes, edges) });
  };

  return (
    <>
      {result && (
        <div style={{ position:'fixed', bottom:110, right:32, background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'14px 18px', boxShadow:'0 12px 36px rgba(0,0,0,0.1)', zIndex:100, minWidth:200 }}>
          <p style={{ fontSize:10, fontWeight:900, color:'#1e293b', textTransform:'uppercase', marginBottom:8 }}>Pipeline Analysis</p>
          <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:12, color:'#64748b' }}>
            <span>📦 Nodes: <b>{result.num_nodes}</b></span>
            <span>🔗 Edges: <b>{result.num_edges}</b></span>
            <span style={{ fontWeight:700, color: result.is_dag ? '#059669' : '#dc2626' }}>
              {result.is_dag ? '✅ Valid DAG' : '❌ Cycle Detected'}
            </span>
          </div>
        </div>
      )}
      <button onClick={handleSubmit}
        style={{ position:'fixed', bottom:32, right:32, background:'#0f172a', color:'#fff', padding:'13px 26px', borderRadius:99, fontWeight:700, fontSize:14, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 28px rgba(0,0,0,0.25)', zIndex:100, transition:'transform .15s' }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
      >
        <span style={{ background:'#6366f1', borderRadius:'50%', padding:'5px 6px', display:'flex' }}><Icons.Play /></span>
        Run Analysis
      </button>
    </>
  );
};

// --- Default Canvas State ---
const ES = { animated:true, style:{ stroke:'#6366f1', strokeWidth:2 } };

const defaultNodes = [
  { id:'input-1',  type:'input',  position:{ x:60,  y:200 }, data:{} },
  { id:'text-1',   type:'text',   position:{ x:310, y:140 }, data:{ text:'Hello {{name}}, how can I help?' } },
  { id:'llm-1',    type:'llm',    position:{ x:590, y:170 }, data:{} },
  { id:'output-1', type:'output', position:{ x:870, y:200 }, data:{} },
];

const defaultEdges = [
  { id:'e1', source:'input-1',  target:'text-1',   sourceHandle:'val',      targetHandle:'name',     ...ES },
  { id:'e2', source:'text-1',   target:'llm-1',    sourceHandle:'output',   targetHandle:'prompt',   ...ES },
  { id:'e3', source:'llm-1',    target:'output-1', sourceHandle:'response', targetHandle:'val',      ...ES },
];

// --- Flow Inner ---
const FlowInner = () => {
  const [nodes, setNodes] = useState(defaultNodes);
  const [edges, setEdges] = useState(defaultEdges);
  const [rfi, setRfi] = useState(null);
  const wrapRef = useRef(null);

  const onNodesChange = useCallback(c => setNodes(ns => applyNodeChanges(c, ns)), []);
  const onEdgesChange = useCallback(c => setEdges(es => applyEdgeChanges(c, es)), []);
  const onConnect     = useCallback(p => setEdges(es => addEdge({ ...p, ...ES }, es)), []);

  const onDrop = useCallback(ev => {
    ev.preventDefault();
    const type = ev.dataTransfer.getData('application/reactflow');
    if (!type || !rfi) return;
    const b = wrapRef.current.getBoundingClientRect();
    const position = rfi.project({ x: ev.clientX - b.left, y: ev.clientY - b.top });
    setNodes(ns => [...ns, { id:`${type}-${Date.now()}`, type, position, data:{ text:'{{input}}' } }]);
  }, [rfi]);

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#f8fafc', overflow:'hidden' }}>
      <Toolbar />
      <div ref={wrapRef} style={{ width:'100%', height:'100%' }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onInit={setRfi}
          onDrop={onDrop} onDragOver={e => e.preventDefault()}
          nodeTypes={nodeTypes} fitView
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls />
          <MiniMap nodeColor="#6366f1" maskColor="rgba(248,250,252,0.7)" />
        </ReactFlow>
      </div>
      <SubmitBtn />
    </div>
  );
};

// --- App Export ---
export default function App() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}