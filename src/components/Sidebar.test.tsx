import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import { FamilyProvider, useFamilyContext } from '../context/FamilyContext';

const SidebarWrapper: React.FC = () => {
  const { addPerson } = useFamilyContext();
  React.useEffect(() => {
    addPerson({ firstName: 'John', lastName: 'Doe', gender: 'male', parentIds: [], spouseIds: [], childrenIds: [] });
  }, [addPerson]);
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
