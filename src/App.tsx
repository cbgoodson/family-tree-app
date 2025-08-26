import React, { useEffect, useState } from 'react';
import { FamilyProvider, useFamilyContext } from './context/FamilyContext';
import { FamilyTree } from './components/FamilyTree';
import type { Person } from './types/Person';
import { PersonEditorOverlay } from './components/PersonEditorOverlay';
import { RelationshipDefineModal } from './components/RelationshipDefineModal';

const FamilyTreeApp: React.FC = () => {
  const { addPerson, updatePerson } = useFamilyContext();

  const [editorPerson, setEditorPerson] = useState<Person | undefined>();
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const handleEditPerson = (event: CustomEvent<Person | undefined>) => {
      console.log('App.tsx: editPerson event received:', event.detail);
      setEditorPerson(event.detail);
      setShowEditor(true);
      console.log('App.tsx: showEditor set to true');
    };
    const handleCreatePerson = () => {
      console.log('App.tsx: createPerson event received');
      setEditorPerson(undefined);
      setShowEditor(true);
      console.log('App.tsx: showEditor set to true for new person');
    };

    console.log('App.tsx: Adding event listeners for editPerson and createPerson');
    window.addEventListener('editPerson', handleEditPerson as EventListener);
    window.addEventListener('createPerson', handleCreatePerson as EventListener);

    return () => {
      console.log('App.tsx: Removing event listeners');
      window.removeEventListener('editPerson', handleEditPerson as EventListener);
      window.removeEventListener('createPerson', handleCreatePerson as EventListener);
    };
  }, []);

  const [pendingRelateIds, setPendingRelateIds] = useState<{ sourceId: string; targetId: string } | undefined>();
  useEffect(() => {
    const handler = (event: CustomEvent<{ sourceId: string; targetId: string }>) => {
      setPendingRelateIds(event.detail);
    };
    window.addEventListener('defineRelationship', handler as EventListener);
    return () => window.removeEventListener('defineRelationship', handler as EventListener);
  }, []);

  console.log('App.tsx: Rendering app, showEditor:', showEditor, 'editorPerson:', editorPerson);

  return (
    <div className="w-full h-screen">
      <main className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <FamilyTree />
        </div>
      </main>

      {showEditor && (
        <PersonEditorOverlay
          person={editorPerson}
          onCancel={() => setShowEditor(false)}
          onSubmit={(data) => {
            if (editorPerson) {
              updatePerson(editorPerson.id, data);
            } else {
              addPerson(data);
            }
            setShowEditor(false);
          }}
        />
      )}

      {pendingRelateIds && (
        <RelationshipDefineModal
          sourceId={pendingRelateIds.sourceId}
          targetId={pendingRelateIds.targetId}
          onClose={() => setPendingRelateIds(undefined)}
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
