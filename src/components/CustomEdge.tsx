import React from 'react';
import { getBezierPath, Position } from '@xyflow/react';

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  style?: React.CSSProperties;
  markerEnd?: string;
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSpouse = id.startsWith('spouse-');
  const stroke = (style as any)?.stroke || (isSpouse ? '#ec4899' : '#60a5fa');
  const strokeWidth = (style as any)?.strokeWidth || 2;

  return (
    <g className="group">
      {/* soft halo for subtle depth */}
      <path
        d={edgePath}
        className="pointer-events-none"
        style={{ stroke: 'rgba(2,6,23,0.08)', strokeWidth: strokeWidth + 4, fill: 'none' }}
      />
      {/* main edge */}
      <path
        id={id}
        style={{ ...style, stroke, strokeWidth }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* enlarged invisible hit area for easier hover/selection */}
      <path
        d={edgePath}
        className="react-flow__edge-interaction"
        style={{ fill: 'none', stroke: 'transparent', strokeWidth: 14 }}
      />
      {/* optional label for spouse edges, visible on hover */}
      {isSpouse && (
        <text className="opacity-0 group-hover:opacity-80 transition-opacity duration-200 text-[10px]" dy={-6}>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" fill="#9f1239">
            spouse
          </textPath>
        </text>
      )}
    </g>
  );
};

export default CustomEdge;
