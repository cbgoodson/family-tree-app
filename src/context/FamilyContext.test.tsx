import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FamilyProvider, useFamilyContext } from './FamilyContext';
import type { FamilyContextType } from './FamilyContext';

// Mock storage utilities to avoid localStorage side effects
vi.mock('../utils/storage', () => ({
  loadPeople: () => [],
  savePeople: vi.fn(),
  generateId: () => Math.random().toString(36).substring(2, 9),
}));

let ctx: FamilyContextType;
const Harness = () => {
  ctx = useFamilyContext();
  return null;
};

describe('FamilyContext relationships', () => {
  beforeEach(() => {
    render(
      <FamilyProvider>
        <Harness />
      </FamilyProvider>
    );
  });

  it('adds parent-child relationships bidirectionally and prevents duplicates', () => {
    act(() => {
      ctx.addPerson({ firstName: 'Parent', lastName: 'One', birthDate: '1990', parentIds: [], spouseIds: [], childrenIds: [] });
      ctx.addPerson({ firstName: 'Child', lastName: 'One', birthDate: '2020', parentIds: [], spouseIds: [], childrenIds: [] });
    });

    const parentId = ctx.people[0].id;
    const childId = ctx.people[1].id;

    act(() => {
      ctx.addRelationship(parentId, childId, 'parent');
      ctx.addRelationship(parentId, childId, 'parent'); // duplicate
    });

    const parent = ctx.getPersonById(parentId)!;
    const child = ctx.getPersonById(childId)!;
    expect(parent.childrenIds).toEqual([childId]);
    expect(child.parentIds).toEqual([parentId]);
  });

  it('removes relationships bidirectionally', () => {
    const parentId = ctx.people[0].id;
    const childId = ctx.people[1].id;

    act(() => {
      ctx.removeRelationship(parentId, childId);
    });

    const parent = ctx.getPersonById(parentId)!;
    const child = ctx.getPersonById(childId)!;
    expect(parent.childrenIds).not.toContain(childId);
    expect(child.parentIds).not.toContain(parentId);
  });

  it('deletes a person and cascades relationship removal', () => {
    // recreate relationship for deletion
    const parentId = ctx.people[0].id;
    const childId = ctx.people[1].id;

    act(() => {
      ctx.addRelationship(parentId, childId, 'parent');
    });

    act(() => {
      ctx.deletePerson(childId);
    });

    const parent = ctx.getPersonById(parentId)!;
    expect(parent.childrenIds).not.toContain(childId);
    expect(ctx.getPersonById(childId)).toBeUndefined();
  });
});
