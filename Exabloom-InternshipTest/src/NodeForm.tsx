import { useState } from "react";

export default function NodeForm({ nodeId, onClose, onDelete }) {
  // State to hold the new name for the node
  const [nodeName, setNodeName] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the function to update the node name in the parent component
    onClose(nodeId, nodeName);
  };

  // Handle node deletion with an extra layer of confirmation.
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this node?")) {
      onDelete(nodeId);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          color: "#333333",
        }}
      >
        Enter new node name:
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
          placeholder="Enter node name"
          autoFocus
        />
      </label>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          type="submit"
          style={{
            flex: "1",
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => onClose(null)}
          style={{
            flex: "1",
            padding: "8px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Cancel
        </button>
      </div>

      {/* Only show delete button if it's not Start or End node */}
      {!["start", "end"].includes(nodeId) && (
        <button
          type="button"
          onClick={handleDelete}
          style={{
            marginTop: "20px",
            padding: "8px",
            backgroundColor: "#ff5252",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Delete Node
        </button>
      )}
    </form>
  );
}
