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
import PersonNode, { type PersonNodeData } from './PersonNode';
import CustomEdge from './CustomEdge';

type FamilyTreeProps = {
  focusPersonId?: string;
  sidebarOpen?: boolean;
};

const SpacerNode: React.FC<{ data: { width: number } }> = ({ data }) => (
  <div style={{ width: data.width, height: 1, opacity: 0, pointerEvents: 'none' }} />
);

const nodeTypes = {
  personNode: PersonNode,
  spacerNode: SpacerNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const FamilyTreeFlow: React.FC<FamilyTreeProps> = ({ focusPersonId, sidebarOpen }) => {
  const { people, updatePerson } = useFamilyContext();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node<PersonNodeData>, Edge> | null>(null);

  // Build an index and helpers
  const peopleById = useMemo(() => {
    const m = new Map<string, Person>();
    for (const p of people) m.set(p.id, p);
    return m;
  }, [people]);

  const descendantsOf = useCallback((id: string, out: Set<string>) => {
    const p = peopleById.get(id);
    if (!p) return;
    for (const cid of p.childrenIds ?? []) {
      if (!out.has(cid)) {
        out.add(cid);
        descendantsOf(cid, out);
      }
    }
  }, [peopleById]);

  const collapsedSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of people) {
      if (p.ui?.collapsed) s.add(p.id);
    }
    return s;
  }, [people]);

  const excluded = useMemo(() => {
    const ex = new Set<string>();
    for (const id of collapsedSet) descendantsOf(id, ex);
    return ex;
  }, [collapsedSet, descendantsOf]);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node<PersonNodeData>[] = [];
    const edges: Edge[] = [];
    const nodePositions = new Map<string, { x: number; y: number }>();

    const generations = new Map<string, number>();
    const visited = new Set<string>();

    // BFS-ish level computation, honoring excluded set
    const calculateGeneration = (personId: string, generation = 0): void => {
      if (visited.has(personId)) return;
      visited.add(personId);

      const person = peopleById.get(personId);
      if (!person || excluded.has(personId)) return;

      if (!generations.has(personId) || (generations.get(personId) as number) > generation) {
        generations.set(personId, generation);
      }

      // Parents one level up
      for (const pid of person.parentIds ?? []) {
        if (!excluded.has(pid)) calculateGeneration(pid, generation - 1);
      }
      // Children one level down
      for (const cid of person.childrenIds ?? []) {
        if (!excluded.has(cid)) calculateGeneration(cid, generation + 1);
      }
      // Keep spouses in same generation
      for (const sid of person.spouseIds ?? []) {
        if (!excluded.has(sid)) calculateGeneration(sid, generation);
      }
    };

    // Start from focus or all roots (people without parents)
    const roots = focusPersonId
      ? [focusPersonId]
      : people.filter(p => (p.parentIds ?? []).length === 0).map(p => p.id);
    if (roots.length === 0 && people.length) roots.push(people[0].id);
    for (const r of roots) calculateGeneration(r, 0);

    // Group by generation and assign simple grid positions
    const generationGroups = new Map<number, string[]>();
    generations.forEach((gen, personId) => {
      if (!generationGroups.has(gen)) generationGroups.set(gen, []);
      generationGroups.get(gen)!.push(personId);
    });

    const sortedGenerations = Array.from(generationGroups.keys()).sort((a, b) => a - b);
    sortedGenerations.forEach((gen, genIndex) => {
      const peopleInGen = generationGroups.get(gen)!;
      peopleInGen.forEach((personId, personIndex) => {
        const x = (personIndex - (peopleInGen.length - 1) / 2) * 270;
        const y = (genIndex) * 210;
        nodePositions.set(personId, { x, y });
      });
    });

    // Nodes
    generations.forEach((_gen, personId) => {
      const person = peopleById.get(personId);
      if (!person) return;
      const pos = nodePositions.get(personId) || { x: 0, y: 0 };
      nodes.push({
        id: personId,
        type: 'personNode',
        position: pos,
        data: {
          person,
          onEdit: (p: Person) => {
            // Use window target so listeners attached on window receive it
            window.dispatchEvent(new CustomEvent<Person>('editPerson', { detail: p }));
          },
          onManageRelationships: (p: Person) => {
            window.dispatchEvent(new CustomEvent<Person>('manageRelationships', { detail: p }));
          },
          onToggleCollapse: () => {
            const current = !!person.ui?.collapsed;
            // Merge ui shallowly via updatePerson
            updatePerson(personId, { ui: { collapsed: !current } } as Partial<Person>);
          },
        },
      } as Node<PersonNodeData>);
    });

    // Ensure isolated or cyclic nodes are still included: add any missing, unexcluded people at generation 0
    people.forEach(p => {
      if (!excluded.has(p.id) && !generations.has(p.id)) {
        generations.set(p.id, 0);
        const pos = { x: 0, y: (sortedGenerations.length) * 210 };
        nodePositions.set(p.id, pos);
        nodes.push({
          id: p.id,
          type: 'personNode',
          position: pos,
          data: {
            person: p,
            onEdit: (pp: Person) => window.dispatchEvent(new CustomEvent<Person>('editPerson', { detail: pp })),
            onManageRelationships: (pp: Person) => window.dispatchEvent(new CustomEvent<Person>('manageRelationships', { detail: pp })),
            onToggleCollapse: () => updatePerson(p.id, { ui: { collapsed: !p.ui?.collapsed } } as Partial<Person>),
          },
        } as Node<PersonNodeData>);
      }
    });

    // Optionally inject a left gutter spacer when sidebar is open
    const SAFE_LEFT = sidebarOpen ? 320 : 0; // px, matches sidebar width (w-80)
    if (SAFE_LEFT > 0 && nodes.length) {
      let minX = Infinity;
      nodes.forEach(n => { if (n.position.x < minX) minX = n.position.x; });
      nodes.push({
        id: 'left-gutter',
        type: 'spacerNode',
        position: { x: minX - SAFE_LEFT, y: 0 },
        data: { width: SAFE_LEFT },
      } as unknown as Node<PersonNodeData>);
    }

    // Edges (only if both nodes are included)
    people.forEach(person => {
      if (excluded.has(person.id)) return;
      for (const cid of person.childrenIds ?? []) {
        if (generations.has(cid)) {
          edges.push({
            id: `edge-${person.id}-${cid}`,
            source: person.id,
            target: cid,
            type: 'customEdge',
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#60a5fa' },
            style: { stroke: '#60a5fa', strokeWidth: 2 },
          });
        }
      }
      for (const sid of person.spouseIds ?? []) {
        if ((person.id < sid) && generations.has(sid)) {
          edges.push({
            id: `spouse-${person.id}-${sid}`,
            source: person.id,
            target: sid,
            type: 'customEdge',
            style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: '#ec4899' },
          });
        }
      }
    });

    return { nodes, edges };
  }, [people, focusPersonId, peopleById, excluded, updatePerson, sidebarOpen]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<PersonNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Fit view after layout
  useEffect(() => {
    if (reactFlowInstance) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      const t = setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
      return () => clearTimeout(t);
    }
  }, [initialNodes, initialEdges, reactFlowInstance, setNodes, setEdges]);

  // Re-fit when sidebar toggles to avoid content beneath the sidebar
  useEffect(() => {
    if (reactFlowInstance) {
      const t = setTimeout(() => reactFlowInstance.fitView({ padding: 0.25 }), 100);
      return () => clearTimeout(t);
    }
  }, [sidebarOpen, reactFlowInstance]);

  const onInit = useCallback((instance: ReactFlowInstance<Node<PersonNodeData>, Edge>) => {
    setReactFlowInstance(instance);
    instance.fitView({ padding: 0.2 });
  }, []);

  const centerOnFocus = useCallback(() => {
    if (!reactFlowInstance || !focusPersonId) return;
    const node = nodes.find(n => n.id === focusPersonId);
    if (node) {
      reactFlowInstance.setCenter(node.position.x, node.position.y, { zoom: 1.2, duration: 400 });
    }
  }, [reactFlowInstance, nodes, focusPersonId]);

  return (
    <div className="relative w-full h-full">
      {/* subtle canvas gradient for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(59,130,246,0.06),transparent),radial-gradient(40%_30%_at_100%_30%,rgba(236,72,153,0.05),transparent)]" />
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        fitView
      >
        <Background gap={20} size={1} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} />
        <Panel position="top-right" className="bg-white/80 dark:bg-neutral-900/80 rounded-md shadow p-2 space-x-2">
          <button
            className="text-xs rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => reactFlowInstance?.fitView({ padding: 0.2 })}
          >
            Fit
          </button>
          <button
            className="text-xs rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              people.forEach(p => p.ui?.collapsed && updatePerson(p.id, { ui: { collapsed: false } } as Partial<Person>));
            }}
          >
            Expand All
          </button>
          <button
            className="text-xs rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              people.forEach(p => (p.childrenIds?.length ?? 0) > 0 && updatePerson(p.id, { ui: { collapsed: true } } as Partial<Person>));
            }}
          >
            Collapse All
          </button>
          {focusPersonId && (
            <button
              className="text-xs rounded border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
              onClick={centerOnFocus}
            >
              Focus
            </button>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const FamilyTree: React.FC<FamilyTreeProps> = (props) => (
  <ReactFlowProvider>
    <FamilyTreeFlow {...props} />
  </ReactFlowProvider>
);
