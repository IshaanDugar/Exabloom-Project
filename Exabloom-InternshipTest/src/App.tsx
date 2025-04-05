// Importing React and ReactFlow libraries
import { useState, useEffect, useCallback, useRef } from "react";
import { ReactFlow, useNodesState, useEdgesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ButtonEdge from "./customEdge";
import ActionNode from "./ActionNode";
import NodeForm from "./NodeForm";

// Style for all nodes to keep them consistent and for the text to be visible
const nodeStyle = {
  background: "#f7f7f7",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  fontWeight: "bold",
};

export default function App() {
  // X position for all nodes to keep them in a straight line
  const baseXPosition = 250;

  // Space between each node vertically
  const nodeVerticalSpacing = 100;
  const initialTopMargin = 50;

  // State to track which node is currently being edited (null if none)
  const [editingNodeId, setEditingNodeId] = useState(null);

  // Keep track of the node order to properly connect them
  const [nodeOrder, setNodeOrder] = useState(["start", "end"]);
  const [nextNodeId, setNextNodeId] = useState(0);

  // Using refs to avoid dependency issues
  const nodeOrderRef = useRef(nodeOrder);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);

  // Declare custom components
  const edgeTypes = { buttonedge: ButtonEdge };
  const nodeTypes = { actionNode: ActionNode };

  // Function to handle when a node's Edit button is clicked
  const handleNodeEdit = useCallback((nodeId) => {
    // Set this node as the one being edited
    setEditingNodeId(nodeId);
  }, []);

  // Function to handle form submission when editing a node name
  const handleFormClose = useCallback((nodeId, newName) => {
    // Stop editing if cancelled
    setEditingNodeId(null);

    // If new name entered, update the node
    if (nodeId && newName) {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: newName,
                  onEdit: handleNodeEdit, // Keep the edit handler
                },
              }
            : node,
        ),
      );
    }
  }, []);

  // Function to handle node deletion
  const handleNodeDelete = useCallback(
    (nodeId) => {
      // Find node's position in order
      const nodeIndex = nodeOrder.indexOf(nodeId);

      // Remove node from order
      const newOrder = [...nodeOrder];
      newOrder.splice(nodeIndex, 1);

      // Update node order
      setNodeOrder(newOrder);

      // Remove node from nodes array
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

      // Close the edit panel
      setEditingNodeId(null);
    },
    [nodeOrder],
  );

  // Create initial nodes - the start and end nodes
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "start",
      position: { x: baseXPosition, y: 50 },
      data: {
        label: "Start",
        onEdit: handleNodeEdit,
      },
      style: nodeStyle,
    },
    {
      id: "end",
      position: { x: baseXPosition, y: 200 },
      data: {
        label: "End",
        onEdit: handleNodeEdit,
      },
      style: nodeStyle,
    },
  ]);

  // Initialize empty edges array
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Keep reference values updated
  useEffect(() => {
    nodeOrderRef.current = nodeOrder;
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodeOrder, nodes, edges]);

  // Update node positions based on their order
  useEffect(() => {
    // Skip if we don't have nodes or order
    if (nodes.length === 0 || nodeOrder.length === 0) {
      return;
    }

    // Track if any positions actually need updating
    let needsUpdate = false;

    // Update all node positions based on their order
    const updatedNodes = nodes.map((node) => {
      // Find this node's position in the order array
      const index = nodeOrder.indexOf(node.id);

      // If the node is in our order, check if position needs updating
      if (index !== -1) {
        const newY = initialTopMargin + index * nodeVerticalSpacing;

        // Only update if position has changed
        if (node.position.x !== baseXPosition || node.position.y !== newY) {
          needsUpdate = true;
          return {
            ...node,
            position: {
              x: baseXPosition,
              y: newY,
            },
          };
        }
      }

      // Return unchanged node
      return node;
    });

    // Only update nodes if positions actually changed
    if (needsUpdate) {
      setNodes(updatedNodes);
    }
  }, [nodeOrder, baseXPosition, initialTopMargin, nodeVerticalSpacing]);

  // Function that handles when a user clicks the + button on an edge
  const handleEdgeClick = useCallback(
    (id, position) => {
      // Find which edge was clicked
      const clickedEdge = edgesRef.current.find((edge) => edge.id === id);
      if (!clickedEdge) return;

      // Get the source node ID of that edge
      const sourceId = clickedEdge.source;

      // Find where in the sequence these nodes are
      const currentNodeOrder = nodeOrderRef.current;
      const sourceIndex = currentNodeOrder.indexOf(sourceId);

      // Create a new action node with our edit handler
      const newNodeId = `node-${nextNodeId}`;
      const newNode = {
        id: newNodeId,
        position: { x: baseXPosition, y: 0 }, // Temporary position
        type: "actionNode",
        data: {
          label: "Action Node",
          onEdit: handleNodeEdit, // Add the edit handler to new nodes too
        },
        style: nodeStyle,
      };

      // Add the new node to the flow
      setNodes((prevNodes) => [...prevNodes, newNode]);

      // Insert the new node into our ordered sequence
      const newOrder = [...currentNodeOrder];
      newOrder.splice(sourceIndex + 1, 0, newNodeId); // Insert after source node
      setNodeOrder(newOrder);

      // Increment the counter for the next node ID
      setNextNodeId((prevId) => prevId + 1);
    },
    [nextNodeId, baseXPosition, handleNodeEdit],
  );

  // Create edges between nodes based on their order
  useEffect(() => {
    // This will hold all our new edges
    const newEdges = [];

    // For each pair of adjacent nodes in our order
    for (let i = 0; i < nodeOrder.length - 1; i++) {
      const sourceId = nodeOrder[i];
      const targetId = nodeOrder[i + 1];

      // Create an edge with a + button between them
      const edge = {
        id: `edge-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        label: "+",
        type: "buttonedge",
        data: { onClick: handleEdgeClick },
      };

      newEdges.push(edge);
    }

    // Update all edges at once
    setEdges(newEdges);
  }, [nodeOrder, handleEdgeClick]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      {/* Main flow area */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        />
      </div>

      {/* Side panel form (only visible when editing) */}
      {editingNodeId && (
        <div
          style={{
            width: "300px",
            padding: "20px",
            backgroundColor: "#f0f0f0",
            borderLeft: "1px solid #ddd",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#333333" }}>Edit Node</h3>
          <NodeForm
            nodeId={editingNodeId}
            onClose={handleFormClose}
            onDelete={handleNodeDelete}
          />
        </div>
      )}
    </div>
  );
}
