// This custom edge component adds a button on edges
import { EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

// Custom edge component with a clickable button
export default function ButtonEdge(props) {
  // Extract the props we need from ReactFlow
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
  } = props;

  // Calculate the path and center point of the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Handle button clicks and pass the event up to the parent
  const handleButtonClick = () => {
    // If we have a click handler in the data prop, call it
    if (data && data.onClick) {
      data.onClick(id, { x: labelX, y: labelY });
    }
  };

  return (
    <>
      {/* Draw the actual edge path */}
      <path id={id} className="react-flow__edge-path" d={edgePath} />

      {/* Render the button at the midpoint of the edge */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            onClick={handleButtonClick}
            style={{
              background: "#FFFFFF",
              color: "#333333",
              cursor: "pointer",
              fontSize: "12px",
              padding: "2px 4px",
              minWidth: "20px",
              minHeight: "20px",
              lineHeight: "1",
              border: "1px solid #ccc",
              borderRadius: "2px",
            }}
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
