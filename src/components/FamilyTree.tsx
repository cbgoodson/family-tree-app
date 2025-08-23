import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  MarkerType,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Node, Edge, ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Person } from '../types/Person';
import { useFamilyContext } from '../context/FamilyContext';
import PersonNode from './PersonNode';
import type { PersonNodeData } from './PersonNode';
import CustomEdge from './CustomEdge';
import { ZoomInIcon, ZoomOutIcon, HomeIcon, RefreshCwIcon } from 'lucide-react';

interface FamilyTreeProps {
  focusPersonId?: string;
}

const nodeTypes = {
  personNode: PersonNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const FamilyTreeFlow: React.FC<FamilyTreeProps> = ({ focusPersonId }) => {
  const { people, getPersonById } = useFamilyContext();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node<PersonNodeData>, Edge> | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node<PersonNodeData>[] = [];
    const edges: Edge[] = [];
    const nodePositions = new Map<string, { x: number; y: number }>();

    const generations = new Map<string, number>();
    const visited = new Set<string>();

    const calculateGeneration = (personId: string, generation = 0): void => {
      if (visited.has(personId)) return;
      visited.add(personId);

      const person = getPersonById(personId);
      if (!person) return;

      if (!generations.has(personId) || generations.get(personId)! > generation) {
        generations.set(personId, generation);
      }

      person.childrenIds.forEach(childId => {
        calculateGeneration(childId, generation + 1);
      });

      person.parentIds.forEach(parentId => {
        calculateGeneration(parentId, generation - 1);
      });
    };

    if (focusPersonId) {
      calculateGeneration(focusPersonId, 0);
    } else if (people.length > 0) {
      calculateGeneration(people[0].id, 0);
    }

    const generationGroups = new Map<number, string[]>();
    generations.forEach((gen, personId) => {
      if (!generationGroups.has(gen)) {
        generationGroups.set(gen, []);
      }
      generationGroups.get(gen)!.push(personId);
    });

    const sortedGenerations = Array.from(generationGroups.keys()).sort((a, b) => a - b);
    
    sortedGenerations.forEach((gen, genIndex) => {
      const peopleInGen = generationGroups.get(gen)!;
      peopleInGen.forEach((personId, personIndex) => {
        const x = (personIndex - (peopleInGen.length - 1) / 2) * 250;
        const y = genIndex * 200;
        nodePositions.set(personId, { x, y });
      });
    });

    visited.forEach(personId => {
      const person = getPersonById(personId);
      if (!person) return;

      const position = nodePositions.get(personId) || { x: 0, y: 0 };

      nodes.push({
        id: personId,
        type: 'personNode',
        position,
        data: {
          person,
          onEdit: (person: Person) => {
            window.dispatchEvent(new CustomEvent('editPerson', { detail: person }));
          },
          onManageRelationships: (person: Person) => {
            window.dispatchEvent(new CustomEvent('manageRelationships', { detail: person }));
          },
        },
      });

      person.childrenIds.forEach(childId => {
        if (visited.has(childId)) {
          edges.push({
            id: `${personId}-${childId}`,
            source: personId,
            target: childId,
            type: 'customEdge',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#3b82f6',
            },
          });
        }
      });

      person.spouseIds.forEach(spouseId => {
        if (visited.has(spouseId) && personId < spouseId) {
          edges.push({
            id: `spouse-${personId}-${spouseId}`,
            source: personId,
            target: spouseId,
            type: 'customEdge',
            style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#ec4899',
            },
          });
        }
      });
    });

    return { nodes, edges };
  }, [people, focusPersonId, getPersonById]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<PersonNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onInit = useCallback((instance: ReactFlowInstance<Node<PersonNodeData>, Edge>) => {
    setReactFlowInstance(instance);
    setTimeout(() => {
      instance.fitView({ padding: 0.2 });
    }, 100);
  }, []);

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  };

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  };

  const handleReorganize = () => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2 });
      }, 100);
    }
  };

  if (people.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Your family tree awaits</p>
          <p className="text-gray-500 text-sm mt-1">Add family members to see the interactive tree visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          type: 'customEdge',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: '#3b82f6',
          }
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
        <Panel position="top-right" className="flex gap-2">
          <button 
            onClick={handleZoomIn} 
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100" 
            title="Zoom in"
          >
            <ZoomInIcon size={20} />
          </button>
          <button 
            onClick={handleZoomOut} 
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100" 
            title="Zoom out"
          >
            <ZoomOutIcon size={20} />
          </button>
          <button 
            onClick={handleFitView} 
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100" 
            title="Fit view"
          >
            <HomeIcon size={20} />
          </button>
          <button 
            onClick={handleReorganize} 
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100" 
            title="Reorganize tree"
          >
            <RefreshCwIcon size={20} />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

// Wrapper with ReactFlowProvider
export const FamilyTree: React.FC<FamilyTreeProps> = ({ focusPersonId }) => {
  return (
    <ReactFlowProvider>
      <FamilyTreeFlow focusPersonId={focusPersonId} />
    </ReactFlowProvider>
  );
};