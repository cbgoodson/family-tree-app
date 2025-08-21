import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import '@xyflow/react/dist/style.css';
import { Edge, Node, NodeChange, EdgeChange, Connection } from '@xyflow/react';
export type Person = {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  imageUrl?: string;
  gender?: 'male' | 'female' | 'other';
  notes?: string;
};
export type Relationship = {
  id: string;
  source: string;
  target: string;
  type: string; // Changed from enum to string to allow custom relationships
};
type FamilyContextType = {
  people: Person[];
  relationships: Relationship[];
  nodes: Node[];
  edges: Edge[];
  selectedPerson: Person | null;
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  setSelectedPerson: (person: Person | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  centerOnPerson: (id: string) => void;
  repositionNodesBasedOnRelationships: () => void;
  showPersonDetails: (personId: string) => void;
  hidePersonDetails: () => void;
  personInEditMode: string | null;
};
const FamilyContext = createContext<FamilyContextType | undefined>(undefined);
// Sample initial data
const initialPeople: Person[] = [{
  id: '1',
  name: 'John Smith',
  birthDate: '1950-05-15',
  gender: 'male'
}, {
  id: '2',
  name: 'Mary Smith',
  birthDate: '1952-08-22',
  gender: 'female'
}, {
  id: '3',
  name: 'Sarah Johnson',
  birthDate: '1975-03-10',
  gender: 'female'
}, {
  id: '4',
  name: 'Michael Johnson',
  birthDate: '1973-11-30',
  gender: 'male'
}, {
  id: '5',
  name: 'Emily Johnson',
  birthDate: '2005-06-12',
  gender: 'female'
}, {
  id: '6',
  name: 'David Johnson',
  birthDate: '2008-02-28',
  gender: 'male'
}];
const initialRelationships: Relationship[] = [{
  id: 'r1',
  source: '1',
  target: '2',
  type: 'spouse'
}, {
  id: 'r2',
  source: '1',
  target: '3',
  type: 'parent-child'
}, {
  id: 'r3',
  source: '2',
  target: '3',
  type: 'parent-child'
}, {
  id: 'r4',
  source: '3',
  target: '4',
  type: 'spouse'
}, {
  id: 'r5',
  source: '3',
  target: '5',
  type: 'parent-child'
}, {
  id: 'r6',
  source: '4',
  target: '5',
  type: 'parent-child'
}, {
  id: 'r7',
  source: '3',
  target: '6',
  type: 'parent-child'
}, {
  id: 'r8',
  source: '4',
  target: '6',
  type: 'parent-child'
}];
// Convert people to nodes
const createNodesFromPeople = (people: Person[]): Node[] => {
  return people.map((person, index) => ({
    id: person.id,
    type: 'personNode',
    position: {
      x: 100 + index % 3 * 200,
      y: 100 + Math.floor(index / 3) * 150
    },
    data: {
      ...person
    }
  }));
};
// Convert relationships to edges
const createEdgesFromRelationships = (relationships: Relationship[]): Edge[] => {
  return relationships.map(rel => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    type: 'customEdge',
    animated: false,
    style: {
      stroke: getRelationshipColor(rel.type),
      strokeWidth: 2
    },
    data: {
      type: rel.type
    }
  }));
};
// Helper function to get edge color based on relationship type
const getRelationshipColor = (type: string): string => {
  switch (type) {
    case 'spouse':
      return '#ff9900';
    case 'ex-spouse':
      return '#ff6666';
    case 'dating':
      return '#ff66cc';
    case 'sibling':
      return '#66cc66';
    case 'parent-child':
    case 'child-parent':
      return '#0080ff';
    default:
      return '#9966ff';
  }
};
// Helper to position nodes based on relationships
const calculateNodePositions = (people: Person[], relationships: Relationship[], nodes: Node[]): Node[] => {
  // Create a copy of nodes to work with
  const updatedNodes = [...nodes];
  // Create a map of node IDs to their indices in the updatedNodes array
  const nodeMap = new Map<string, number>();
  updatedNodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
  });
  // First, identify all parent-child relationships
  const parentChildRelations = relationships.filter(rel => rel.type === 'parent-child' || rel.type === 'child-parent');
  // Group nodes by generation (parents, children, etc.)
  const generations = new Map<string, number>();
  // Start with parents at generation 0
  const processedNodes = new Set<string>();
  const nodesToProcess: {
    id: string;
    generation: number;
  }[] = [];
  // Find root nodes (those that are only parents, never children)
  people.forEach(person => {
    const isChild = parentChildRelations.some(rel => rel.type === 'parent-child' && rel.target === person.id || rel.type === 'child-parent' && rel.source === person.id);
    if (!isChild) {
      generations.set(person.id, 0);
      nodesToProcess.push({
        id: person.id,
        generation: 0
      });
    }
  });
  // If no root nodes found, just use the first person
  if (nodesToProcess.length === 0 && people.length > 0) {
    generations.set(people[0].id, 0);
    nodesToProcess.push({
      id: people[0].id,
      generation: 0
    });
  }
  // Process the queue to assign generations
  while (nodesToProcess.length > 0) {
    const {
      id,
      generation
    } = nodesToProcess.shift()!;
    if (processedNodes.has(id)) continue;
    processedNodes.add(id);
    // Find all children of this node
    const childRelations = parentChildRelations.filter(rel => rel.type === 'parent-child' && rel.source === id || rel.type === 'child-parent' && rel.target === id);
    // Process all children
    childRelations.forEach(rel => {
      const childId = rel.type === 'parent-child' ? rel.target : rel.source;
      if (!processedNodes.has(childId)) {
        generations.set(childId, generation + 1);
        nodesToProcess.push({
          id: childId,
          generation: generation + 1
        });
      }
    });
  }
  // Position nodes based on generations
  const generationCounts = new Map<number, number>();
  const generationWidth = 250;
  const generationHeight = 150;
  // Count nodes per generation
  for (const [, gen] of generations) {
    generationCounts.set(gen, (generationCounts.get(gen) || 0) + 1);
  }
  // Position nodes within their generations
  const generationPositions = new Map<number, number>();
  for (const [nodeId, generation] of generations) {
    const nodeIndex = nodeMap.get(nodeId);
    if (nodeIndex !== undefined) {
      // Calculate x position based on generation
      const x = generation * generationWidth + 100;
      // Calculate y position based on position within generation
      const posInGeneration = generationPositions.get(generation) || 0;
      const totalInGeneration = generationCounts.get(generation) || 1;
      const y = 100 + posInGeneration * generationHeight;
      // Update position
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        position: {
          x,
          y
        }
      };
      // Increment position counter for this generation
      generationPositions.set(generation, posInGeneration + 1);
    }
  }
  // Handle spouse and sibling relationships (horizontal alignment)
  const spouseAndSiblingRelations = relationships.filter(rel => rel.type === 'spouse' || rel.type === 'ex-spouse' || rel.type === 'dating' || rel.type === 'sibling');
  spouseAndSiblingRelations.forEach(rel => {
    const sourceIndex = nodeMap.get(rel.source);
    const targetIndex = nodeMap.get(rel.target);
    if (sourceIndex !== undefined && targetIndex !== undefined) {
      const sourceNode = updatedNodes[sourceIndex];
      const targetNode = updatedNodes[targetIndex];
      // Align nodes horizontally (same y-coordinate)
      const avgY = (sourceNode.position.y + targetNode.position.y) / 2;
      // Position source to the left of target
      updatedNodes[sourceIndex] = {
        ...sourceNode,
        position: {
          x: Math.min(sourceNode.position.x, targetNode.position.x) - 50,
          y: avgY
        }
      };
      updatedNodes[targetIndex] = {
        ...targetNode,
        position: {
          x: Math.max(sourceNode.position.x, targetNode.position.x) + 50,
          y: avgY
        }
      };
    }
  });
  return updatedNodes;
};
export const FamilyProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [relationships, setRelationships] = useState<Relationship[]>(initialRelationships);
  const [nodes, setNodes] = useState<Node[]>(createNodesFromPeople(initialPeople));
  const [edges, setEdges] = useState<Edge[]>(createEdgesFromRelationships(initialRelationships));
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [personInEditMode, setPersonInEditMode] = useState<string | null>(null);
  // Reposition nodes when relationships change
  const repositionNodesBasedOnRelationships = useCallback(() => {
    setNodes(prevNodes => calculateNodePositions(people, relationships, prevNodes));
  }, [people, relationships]);
  // Update edges when relationships change
  useEffect(() => {
    setEdges(createEdgesFromRelationships(relationships));
  }, [relationships]);
  // Show person details modal
  const showPersonDetails = useCallback((personId: string) => {
    setPersonInEditMode(personId);
  }, []);
  // Hide person details modal
  const hidePersonDetails = useCallback(() => {
    setPersonInEditMode(null);
  }, []);
  const addPerson = (person: Omit<Person, 'id'>) => {
    const id = `p${Date.now()}`;
    const newPerson = {
      ...person,
      id
    };
    setPeople([...people, newPerson]);
    // Add node for the new person
    const newNode: Node = {
      id,
      type: 'personNode',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500
      },
      data: {
        ...newPerson
      }
    };
    setNodes([...nodes, newNode]);
  };
  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople(people.map(p => p.id === id ? {
      ...p,
      ...updates
    } : p));
    setNodes(nodes.map(n => n.id === id ? {
      ...n,
      data: {
        ...n.data,
        ...updates
      }
    } : n));
  };
  const deletePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
    setNodes(nodes.filter(n => n.id !== id));
    setRelationships(relationships.filter(r => r.source !== id && r.target !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
  };
  const addRelationship = (relationship: Omit<Relationship, 'id'>) => {
    const id = `r${Date.now()}`;
    const newRelationship = {
      ...relationship,
      id
    };
    // If relationship is child-parent, swap source and target and change to parent-child
    const finalRelationship = relationship.type === 'child-parent' ? {
      ...newRelationship,
      source: relationship.target,
      target: relationship.source,
      type: 'parent-child'
    } : newRelationship;
    setRelationships([...relationships, finalRelationship]);
    // Add edge for the new relationship
    const newEdge: Edge = {
      id,
      source: finalRelationship.source,
      target: finalRelationship.target,
      type: 'customEdge',
      animated: false,
      style: {
        stroke: getRelationshipColor(finalRelationship.type),
        strokeWidth: 2
      },
      data: {
        type: finalRelationship.type
      }
    };
    setEdges([...edges, newEdge]);
    // Reposition nodes based on new relationship
    setTimeout(() => repositionNodesBasedOnRelationships(), 100);
  };
  const updateRelationship = (id: string, updates: Partial<Relationship>) => {
    setRelationships(relationships.map(rel => rel.id === id ? {
      ...rel,
      ...updates
    } : rel));
    setEdges(edges.map(edge => edge.id === id ? {
      ...edge,
      style: {
        ...edge.style,
        stroke: getRelationshipColor(updates.type || edge.data.type)
      },
      data: {
        ...edge.data,
        ...updates
      }
    } : edge));
    // Reposition nodes if relationship type changed
    if (updates.type) {
      setTimeout(() => repositionNodesBasedOnRelationships(), 100);
    }
  };
  const deleteRelationship = (id: string) => {
    setRelationships(relationships.filter(r => r.id !== id));
    setEdges(edges.filter(e => e.id !== id));
  };
  const onNodesChange = (changes: NodeChange[]) => {
    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          const nodeIndex = updatedNodes.findIndex(n => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: change.position
            };
          }
        }
      });
      return updatedNodes;
    });
  };
  const onEdgesChange = (changes: EdgeChange[]) => {
    // Handle edge changes if needed
  };
  const onConnect = (connection: Connection) => {
    if (connection.source && connection.target) {
      addRelationship({
        source: connection.source,
        target: connection.target,
        type: 'parent-child' // Default relationship type
      });
    }
  };
  const centerOnPerson = (id: string) => {
    // This function will be implemented in the FamilyTree component
    // It's included here in the context to maintain the API
    const person = people.find(p => p.id === id) || null;
    setSelectedPerson(person);
  };
  return <FamilyContext.Provider value={{
    people,
    relationships,
    nodes,
    edges,
    selectedPerson,
    addPerson,
    updatePerson,
    deletePerson,
    addRelationship,
    updateRelationship,
    deleteRelationship,
    setSelectedPerson,
    onNodesChange,
    onEdgesChange,
    onConnect,
    centerOnPerson,
    repositionNodesBasedOnRelationships,
    showPersonDetails,
    hidePersonDetails,
    personInEditMode
  }}>
      {children}
    </FamilyContext.Provider>;
};
export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};