// Import the React Flow handle component for node connections
import { Handle, Position } from "@xyflow/react";

export default function ActionNode({ id, data }) {
  // When Edit button is clicked, tell the parent component which node to edit
  const handleEditClick = () => {
    // Only proceed if the parent provided an onEdit function
    if (data.onEdit) {
      data.onEdit(id); // Tell the parent which node needs editing
    }
  };

  return (
    <div
      style={{
        background: "#f7f7f7",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "5px",
        padding: "10px",
        fontWeight: "bold",
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        gap: "8px", // Space between button and text
      }}
    >
      <Handle type="target" position={Position.Top} style={{ left: "50%" }} />

      {/* Edit button for this node */}
      <button
        onClick={handleEditClick}
        style={{
          height: "16px",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 3px",
          borderRadius: "3px",
          order: 1, // Place button first in flex container
        }}
      >
        Edit
      </button>

      {/* Node label text - Show the actual label from data */}
      <span style={{ order: 2 }}>{data.label || "Action Node"}</span>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: "50%" }}
      />
    </div>
  );
}
