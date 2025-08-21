import React, { useState } from 'react';
import { FamilyProvider } from './context/FamilyContext';
import { RelationshipManager } from './components/RelationshipManager';
import { FamilyTree } from './components/FamilyTree';
import Sidebar from './components/Sidebar';
import type { Person } from './types/Person';

const FamilyTreeApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationshipPerson, setRelationshipPerson] = useState<Person | undefined>();

  React.useEffect(() => {
    const handleManageRelationshipsEvent = (event: CustomEvent<Person>) => {
      setRelationshipPerson(event.detail);
    };

    window.addEventListener('manageRelationships', handleManageRelationshipsEvent as EventListener);

    return () => {
      window.removeEventListener('manageRelationships', handleManageRelationshipsEvent as EventListener);
    };
  }, []);

  return (
    <div className="flex w-full h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        <FamilyTree />
      </main>

      {/* Modals - handled by Sidebar */}

      {relationshipPerson && (
        <RelationshipManager
          person={relationshipPerson}
          onClose={() => setRelationshipPerson(undefined)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <FamilyProvider>
      <FamilyTreeApp />
    </FamilyProvider>
  );
}

export default App;
