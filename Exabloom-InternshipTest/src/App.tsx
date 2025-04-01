// Importing necessary modules and components
import { useState, useCallback } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node styles
const nodeStyle = {
  background: '#f7f7f7',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  fontWeight: 'bold'
};

//Declaring the initial nodes and edges
const initialNodes = [
  { 
    id: '1', 
    position: { x: 0, y: 0 }, 
    data: { label: 'Start' },
    style: nodeStyle
  },
  { 
    id: '2', 
    position: { x: 0, y: 100 }, 
    data: { label: 'End' },
    style: nodeStyle 
  },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

// Main App component
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView 
      />
    </div>
  );
}