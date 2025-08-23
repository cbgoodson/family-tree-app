import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FamilyProvider, useFamilyContext } from '../context/FamilyContext';
import { FamilyTree } from './FamilyTree';
import type { FamilyContextType } from '../context/FamilyContext';

// Mock storage to avoid localStorage side effects
vi.mock('../utils/storage', () => ({
  loadPeople: () => [],
  savePeople: vi.fn(),
  generateId: () => Math.random().toString(36).substring(2, 9),
}));

// Mock React Flow to simplify DOM rendering
type MockNode = { id: string };
type MockEdge = { id: string };

vi.mock('@xyflow/react', () => {
  const ReactFlow = ({ nodes, edges, children }: { nodes: MockNode[]; edges: MockEdge[]; children?: React.ReactNode }) => (
    <div>
      <div data-nodes>{nodes.map(n => (<div key={n.id} data-node>{n.id}</div>))}</div>
      <div data-edges>{edges.map(e => (<div key={e.id} data-edge>{e.id}</div>))}</div>
      {children}
    </div>
  );
  const useNodesState = (initial: MockNode[]) => {
    const [nodes, setNodes] = React.useState(initial);
    const onNodesChange = () => {};
    return [nodes, setNodes, onNodesChange] as const;
  };
  const useEdgesState = (initial: MockEdge[]) => {
    const [edges, setEdges] = React.useState(initial);
    const onEdgesChange = () => {};
    return [edges, setEdges, onEdgesChange] as const;
  };
  const Controls = () => null;
  const Background = () => null;
  const MiniMap = () => null;
  const Panel = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const MarkerType = { ArrowClosed: 'arrowclosed' };
  const ReactFlowProvider = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  return {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    Panel,
    MarkerType,
    ReactFlowProvider,
  };
});

let ctx: FamilyContextType;
const Harness = () => {
  ctx = useFamilyContext();
  return <FamilyTree />;
};

describe('FamilyTree graph updates', () => {
  beforeEach(() => {
    render(
      <FamilyProvider>
        <Harness />
      </FamilyProvider>
    );
  });

  it('renders nodes and edges when people and relationships change', () => {
    act(() => {
      ctx.addPerson({ firstName: 'A', lastName: 'A', birthDate: '1990', parentIds: [], spouseIds: [], childrenIds: [] });
      ctx.addPerson({ firstName: 'B', lastName: 'B', birthDate: '2010', parentIds: [], spouseIds: [], childrenIds: [] });
    });

    const nodes = document.querySelectorAll('[data-node]');
    expect(nodes).toHaveLength(2);

    const parentId = ctx.people[0].id;
    const childId = ctx.people[1].id;

    act(() => {
      ctx.addRelationship(parentId, childId, 'parent');
    });

    const edges = document.querySelectorAll('[data-edge]');
    expect(edges).toHaveLength(1);
  });
});
