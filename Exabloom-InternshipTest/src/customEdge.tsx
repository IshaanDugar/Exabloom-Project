// Since we need the button on the edges, we need to create a custom edge component.
// This component will render a button on the edge and handle the click event.

// Import necessary libraries and components
import {
  EdgeLabelRenderer,
  getBezierPath,
} from '@xyflow/react';

// Declaring the ButtonEdge component as an export default function.
export default function ButtonEdge(props) {
  // Destructuring the props object to extract necessary properties based on the syntax from the documentation.
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
  } = props;

  // Using the getBezierPath function to calculate the path of the edge.
  // This function takes the source and target coordinates, as well as their positions, to create a bezier curve path.
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      {/* The path element is used to draw the edge. The id is set to the id passed in props, and the className is set to a specific class for styling. */}
      {/* The d attribute of the path element is set to the edgePath calculated earlier. */}
      {/* The EdgeLabelRenderer component is used to render the label on the edge with additional customizations and tweaks. */}    
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button 
          onClick={() => console.log("Button clicked!")}
          style={{
              background: '#FFFFFF',
              color: '#333333',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '2px 4px',
              minWidth: '20px',
              minHeight: '20px',
              lineHeight: '1',
              border: '1px solid #ccc',
              borderRadius: '2px'
          }}
            >{label}</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}