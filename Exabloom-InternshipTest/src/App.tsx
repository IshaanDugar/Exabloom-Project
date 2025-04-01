// Importing the necessary libraries and components
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ButtonEdge from './customEdge';

// Declaring nodeStyle mainly for the text and the custom colors
const nodeStyle = {
  background: '#f7f7f7',
  color: '#333',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  fontWeight: 'bold',
};

export default function App() {

  // Declaring the edgeTypes object to register the custom edge component imported above
  const edgeTypes = { buttonedge: ButtonEdge };

  // Declaring the initial nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([
    { id: 'start', position: { x: 0, y: 0 }, data: { label: 'Start' }, style: nodeStyle },
    { id: 'end', position: { x: 0, y: 100 }, data: { label: 'End' }, style: nodeStyle },
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([{
    id: 'e1-2',
    source: 'start',
    target: 'end',
    animated: true,
    label: '+',
    type: 'buttonedge',
  }]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      />
    </div>
  );
}
