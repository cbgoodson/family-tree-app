import React, { useState } from 'react';
import { FamilyProvider } from './context/FamilyContext';
import { FamilyTree } from './components/FamilyTree';
import Sidebar from './components/Sidebar';
import { RelationshipManager } from './components/RelationshipManager';
import type { Person } from './types/Person';

const FamilyTreeApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationshipPerson, setRelationshipPerson] = useState<Person | undefined>();

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  React.useEffect(() => {
    const handleOpenRelationshipManager = (event: CustomEvent<Person>) => {
      setRelationshipPerson(event.detail);
    };

    const handleManageRelationships = (event: CustomEvent<Person>) => {
      setRelationshipPerson(event.detail);
    };

    window.addEventListener('openRelationshipManager', handleOpenRelationshipManager as EventListener);
    window.addEventListener('manageRelationships', handleManageRelationships as EventListener);

    return () => {
      window.removeEventListener('openRelationshipManager', handleOpenRelationshipManager as EventListener);
      window.removeEventListener('manageRelationships', handleManageRelationships as EventListener);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        onOpenRelationshipManager={(person: Person) => {
          setRelationshipPerson(person);
        }}
      />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'} h-full`}>
        <FamilyTree />
      </main>

      {/* RelationshipManager as full-screen modal */}
      {relationshipPerson && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setRelationshipPerson(undefined)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <RelationshipManager
              person={relationshipPerson}
              onClose={() => setRelationshipPerson(undefined)}
            />
          </div>
        </div>
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
