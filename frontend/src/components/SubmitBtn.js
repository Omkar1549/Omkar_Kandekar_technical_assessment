import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';

const SubmitBtn = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const nodes = getNodes();
    const edges = getEdges();

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // User-friendly alert showing the backend response
      const message = 
        `Pipeline Analysis:\n\n` +
        `• Nodes: ${data.num_nodes}\n` +
        `• Edges: ${data.num_edges}\n` +
        `• Is DAG: ${data.is_dag ? "Yes ✅" : "No (Cycle Detected) ❌"}`;
      
      alert(message);
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert('Failed to connect to the backend. Please ensure the FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`
          px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          "Submit Pipeline"
        )}
      </button>
    </div>
  );
};

export default SubmitBtn;