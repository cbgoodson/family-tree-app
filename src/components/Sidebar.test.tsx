import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import { FamilyProvider, useFamilyContext, type FamilyContextType } from '../context/FamilyContext';

let ctx: FamilyContextType;
const SidebarWrapper: React.FC = () => {
  ctx = useFamilyContext();
  React.useEffect(() => {
    ctx.addPerson({ firstName: 'John', lastName: 'Doe', gender: 'male', parentIds: [], spouseIds: [], childrenIds: [] });
  }, []);
  return <Sidebar isOpen={true} toggleSidebar={() => {}} />;
};

describe('Sidebar tab toggling', () => {
  it('renders only the active tab content', () => {
    render(
      <FamilyProvider>
        <SidebarWrapper />
      </FamilyProvider>
    );

    // People tab initially
    expect(screen.getByText('Family Members')).toBeInTheDocument();

    // Switch to Add Person
    fireEvent.click(screen.getByText('Add Person'));
    expect(screen.queryByText('Family Members')).not.toBeInTheDocument();
    expect(screen.getByLabelText('First Name *')).toBeInTheDocument();

    // Switch back to People
    fireEvent.click(screen.getByText('People'));
    expect(screen.getByText('Family Members')).toBeInTheDocument();
    expect(screen.queryByLabelText('First Name *')).not.toBeInTheDocument();
  });
});

describe('Relationship manager', () => {
  it('opens when manageRelationships event is dispatched', async () => {
    render(
      <FamilyProvider>
        <SidebarWrapper />
      </FamilyProvider>
    );

    await waitFor(() => expect(ctx.people.length).toBeGreaterThan(0));

    act(() => {
      window.dispatchEvent(new CustomEvent('manageRelationships', { detail: ctx.people[0] }));
    });

    expect(await screen.findByText('Manage Relationships')).toBeInTheDocument();
  });
});
