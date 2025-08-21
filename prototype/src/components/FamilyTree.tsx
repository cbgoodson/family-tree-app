import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowInstance, Panel, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFamily } from '../context/FamilyContext';
import PersonNode from './PersonNode';
import CustomEdge from './CustomEdge';
import { ZoomInIcon, ZoomOutIcon, HomeIcon, RefreshCwIcon } from 'lucide-react';
import RelationshipModal from './RelationshipModal';
import PersonDetails from './PersonDetails';
// Register custom node and edge types
const nodeTypes = {
  personNode: PersonNode
};
const edgeTypes = {
  customEdge: CustomEdge
};
const FamilyTree: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedPerson,
    people,
    personInEditMode,
    hidePersonDetails,
    repositionNodesBasedOnRelationships
  } = useFamily();
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    setTimeout(() => {
      instance.fitView({
        padding: 0.2
      });
    }, 100);
  }, []);
  const handleZoomIn = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.zoomOut();
    }
  };
  const handleFitView = () => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({
        padding: 0.2
      });
    }
  };
  const handleReorganizeTree = () => {
    repositionNodesBasedOnRelationships();
    setTimeout(() => {
      if (reactFlowInstance.current) {
        reactFlowInstance.current.fitView({
          padding: 0.2
        });
      }
    }, 100);
  };
  // Handle node drag start
  const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
    setDraggedNode(node.id);
  }, []);
  // Handle node drag over another node
  const onNodeDragOver = useCallback((event: React.DragEvent, node: Node) => {
    if (draggedNode && draggedNode !== node.id) {
      setDropTarget(node.id);
    }
  }, [draggedNode]);
  // Handle node drag end
  const onNodeDragStop = useCallback(() => {
    if (draggedNode && dropTarget && draggedNode !== dropTarget) {
      setShowRelationshipModal(true);
    }
    setDraggedNode(null);
  }, [draggedNode, dropTarget]);
  // Reset drop target when drag ends
  const onPaneClick = useCallback(() => {
    setDropTarget(null);
  }, []);
  // Center on selected person when it changes
  useEffect(() => {
    if (selectedPerson && reactFlowInstance.current) {
      const node = nodes.find(n => n.id === selectedPerson.id);
      if (node) {
        reactFlowInstance.current.setCenter(node.position.x + 100, node.position.y + 75, {
          zoom: 1.5,
          duration: 800
        });
      }
    }
  }, [selectedPerson, nodes]);
  // Find the source and target people for relationship modal
  const sourcePerson = draggedNode ? people.find(p => p.id === draggedNode) : null;
  const targetPerson = dropTarget ? people.find(p => p.id === dropTarget) : null;
  // Find the person in edit mode
  const personToEdit = personInEditMode ? people.find(p => p.id === personInEditMode) : null;
  return <div className="w-full h-full">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onInit={onInit} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView attributionPosition="bottom-left" onNodeDragStart={onNodeDragStart} onNodeDragOver={onNodeDragOver} onNodeDragStop={onNodeDragStop} onPaneClick={onPaneClick} defaultEdgeOptions={{
      type: 'customEdge',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20
      }
    }}>
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="flex gap-2">
          <button onClick={handleZoomIn} className="p-2 bg-white rounded-full shadow hover:bg-gray-100" title="Zoom in">
            <ZoomInIcon size={20} />
          </button>
          <button onClick={handleZoomOut} className="p-2 bg-white rounded-full shadow hover:bg-gray-100" title="Zoom out">
            <ZoomOutIcon size={20} />
          </button>
          <button onClick={handleFitView} className="p-2 bg-white rounded-full shadow hover:bg-gray-100" title="Fit view">
            <HomeIcon size={20} />
          </button>
          <button onClick={handleReorganizeTree} className="p-2 bg-white rounded-full shadow hover:bg-gray-100" title="Reorganize tree">
            <RefreshCwIcon size={20} />
          </button>
        </Panel>
        {/* SVG Definitions for markers */}
        <svg style={{
        position: 'absolute',
        width: 0,
        height: 0
      }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
        </svg>
      </ReactFlow>
      {/* Relationship Modal */}
      {showRelationshipModal && sourcePerson && targetPerson && <RelationshipModal sourcePerson={sourcePerson} targetPerson={targetPerson} onClose={() => {
      setShowRelationshipModal(false);
      setDropTarget(null);
    }} />}
      {/* Person Details Modal */}
      {personToEdit && <PersonDetails person={personToEdit} onClose={hidePersonDetails} />}
    </div>;
};
export default FamilyTree;