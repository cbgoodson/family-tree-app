import '@xyflow/react/dist/style.css';
import React, { useState } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';
import { useFamily } from '../context/FamilyContext';
import RelationshipDetails from './RelationshipDetails';
const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [detailsPosition, setDetailsPosition] = useState({
    x: 0,
    y: 0
  });
  const {
    relationships
  } = useFamily();
  const relationship = relationships.find(rel => rel.id === id);
  // Get the path for the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  const handleEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDetailsPosition({
      x: event.clientX,
      y: event.clientY
    });
    setShowDetails(!showDetails);
  };
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  return <>
      <path id={id} className="react-flow__edge-path" d={edgePath} style={style} onClick={handleEdgeClick} strokeWidth={3} markerEnd="url(#arrow)" />
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={10} onClick={handleEdgeClick} style={{
      cursor: 'pointer'
    }} />
      {relationship && showDetails && <RelationshipDetails relationship={relationship} position={detailsPosition} onClose={handleCloseDetails} />}
    </>;
};
export default CustomEdge;