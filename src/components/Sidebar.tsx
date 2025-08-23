import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, PlusIcon, UserPlusIcon, LinkIcon, EditIcon } from 'lucide-react';
import { PersonFormInline } from './PersonFormInline';
import { RelationshipManager } from './RelationshipManager';
import { useFamilyContext } from '../context/FamilyContext';
import type { Person } from '../types/Person';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

type TabType = 'people' | 'add-person' | 'add-relationship';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('people');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | undefined>();
  const [relationshipPerson, setRelationshipPerson] = useState<Person | undefined>();

  const { people, addPerson, updatePerson } = useFamilyContext();

  // Listen for edit person events from tree nodes
    React.useEffect(() => {
      const handleEditPersonEvent = (event: CustomEvent<Person>) => {
        setEditingPerson(event.detail);
        handleTabChange('add-person');
      };

      window.addEventListener('editPerson', handleEditPersonEvent as EventListener);

      return () => {
        window.removeEventListener('editPerson', handleEditPersonEvent as EventListener);
      };
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'add-person') {
      setEditingPerson(undefined);
    }
    if (tab !== 'add-relationship') {
      setRelationshipPerson(undefined);
    }
  };

  const handleEditPerson = (person: Person, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPerson(person);
    handleTabChange('add-person');
  };

  const handleFormSubmit = (personData: Omit<Person, 'id'>) => {
    if (editingPerson) {
      updatePerson(editingPerson.id, personData);
    } else {
      addPerson(personData);
    }
    setEditingPerson(undefined);
    handleTabChange('people');
  };

  const handleFormCancel = () => {
    setEditingPerson(undefined);
    handleTabChange('people');
  };

  const handleAddPersonTab = () => {
    setEditingPerson(undefined);
    handleTabChange('add-person');
  };

  const handleAddRelationship = () => {
    if (selectedPerson) {
      setRelationshipPerson(selectedPerson);
      handleTabChange('add-relationship');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'people':
        return (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Family Members
            </h3>
            <div className="space-y-1">
              {people.map(person => {
                const avatarClasses = person.gender === 'female'
                  ? 'bg-pink-100 text-pink-500'
                  : person.gender === 'male'
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-gray-100 text-gray-500';
                return (
                  <div
                    key={person.id}
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 ${selectedPerson?.id === person.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${avatarClasses}`}>
                      <UsersIcon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{person.firstName} {person.lastName}</p>
                      {person.birthDate && (
                        <p className="text-xs text-gray-500">
                          b. {new Date(person.birthDate).getFullYear()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleEditPerson(person, e)}
                      className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                    >
                      <EditIcon size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200"
              onClick={handleAddPersonTab}
            >
              <PlusIcon size={16} />
              <span>Add New Person</span>
            </button>

            {selectedPerson && (
              <button
                className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-green-600 hover:bg-green-50 rounded-md border border-green-200"
                onClick={handleAddRelationship}
              >
                <LinkIcon size={16} />
                <span>Add Relationship</span>
              </button>
            )}
          </div>
        );

      case 'add-person':
        return (
          <PersonFormInline
            person={editingPerson}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        );

      case 'add-relationship':
        return relationshipPerson ? (
          <RelationshipManager
            person={relationshipPerson}
            onClose={() => handleTabChange('people')}
          />
        ) : (
          <p className="text-sm text-gray-500">Select a person to manage relationships.</p>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-10 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Family Tree</h2>
            <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-200">
              <ChevronLeftIcon size={20} />
            </button>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'people' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('people')}
            >
              <div className="flex items-center justify-center gap-2">
                <UsersIcon size={16} />
                <span>People</span>
              </div>
            </button>
            
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'add-person' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={handleAddPersonTab}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlusIcon size={16} />
                <span>Add Person</span>
              </div>
            </button>
            
            <button
              className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'add-relationship' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('add-relationship')}
            >
              <div className="flex items-center justify-center gap-2">
                <LinkIcon size={16} />
                <span>Relation</span>
              </div>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Toggle button when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar} 
          className="fixed top-4 left-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronRightIcon size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
