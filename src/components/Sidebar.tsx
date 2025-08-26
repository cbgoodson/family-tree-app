import React, { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UsersIcon, PlusIcon, UserPlusIcon, LinkIcon, EditIcon, TrashIcon } from 'lucide-react';
import { PersonFormInline } from './PersonFormInline';
import { useFamilyContext } from '../context/FamilyContext';
import type { Person } from '../types/Person';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  onOpenRelationshipManager: (person: Person) => void;
};

type TabType = 'people' | 'add-person' | 'add-relationship';

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  onOpenRelationshipManager
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('people');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [editingPerson, setEditingPerson] = useState<Person | undefined>();
  const [query, setQuery] = useState('');
  

  const { people, addPerson, updatePerson, deletePerson } = useFamilyContext();

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }, [people, query]);

  // Listen for edit person events from tree nodes
    React.useEffect(() => {
      const handleEditPersonEvent = (event: CustomEvent<Person>) => {
        setEditingPerson(event.detail);
        handleTabChange('add-person');
      };

      const handleManageRelationshipsEvent = (event: CustomEvent<Person>) => {
        // Use callback to open relationship manager
        onOpenRelationshipManager(event.detail);
      };

      window.addEventListener('editPerson', handleEditPersonEvent as EventListener);
      window.addEventListener('manageRelationships', handleManageRelationshipsEvent as EventListener);

      return () => {
        window.removeEventListener('editPerson', handleEditPersonEvent as EventListener);
        window.removeEventListener('manageRelationships', handleManageRelationshipsEvent as EventListener);
      };
  }, [onOpenRelationshipManager]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'add-person') {
      setEditingPerson(undefined);
    }
  };

  const handleEditPerson = (person: Person, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPerson(person);
    handleTabChange('add-person');
  };

  const handleDeletePerson = (person: Person, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}? This will also remove all their relationships.`)) {
      deletePerson(person.id);
      if (selectedPerson?.id === person.id) {
        setSelectedPerson(null);
      }
      if (editingPerson?.id === person.id) {
        setEditingPerson(undefined);
        handleTabChange('people');
      }
    }
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
      onOpenRelationshipManager(selectedPerson);
      handleTabChange('add-relationship');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'people':
        return (
          <div className="space-y-2">
            <div className="sticky top-0 z-20 bg-white pb-2 pt-1">
              <div className="relative overflow-hidden">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search people..."
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500">Family Members</h3>
            <div className="space-y-1">
              {filteredPeople.map(person => {
                const avatarClasses = person.gender === 'female'
                  ? 'bg-pink-100 text-pink-500'
                  : person.gender === 'male'
                    ? 'bg-blue-100 text-blue-500'
                    : 'bg-gray-100 text-gray-500';
                return (
                  <div
                    key={person.id}
                    className={`p-2 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${selectedPerson?.id === person.id ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'hover:bg-gray-100'}`}
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
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleEditPerson(person, e)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer"
                        title="Edit person"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeletePerson(person, e)}
                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                        title="Delete person"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 cursor-pointer"
              onClick={handleAddPersonTab}
            >
              <PlusIcon size={16} />
              <span>Add New Person</span>
            </button>

            {selectedPerson && (
              <button
                className="w-full mt-2 py-2 flex items-center justify-center gap-2 text-sm text-green-600 hover:bg-green-50 rounded-md border border-green-200 cursor-pointer"
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
        if (selectedPerson) {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-medium text-blue-800">Managing relationships for:</h3>
                <p className="text-blue-700">{selectedPerson.firstName} {selectedPerson.lastName}</p>
              </div>
              <button
                onClick={() => {
                  if (selectedPerson) {
                    onOpenRelationshipManager(selectedPerson);
                  }
                }}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium cursor-pointer"
              >
                Open Relationship Manager
              </button>
            </div>
          );
        }
        return (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500">Select a person from the People tab to manage their relationships.</p>
            <button
              onClick={() => handleTabChange('people')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Go to People
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className={`fixed top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 w-80`}
        style={{ left: isOpen ? '0' : '-320px' }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Family Tree</h2>
            <button onClick={toggleSidebar} className="p-1 rounded hover:bg-gray-200 cursor-pointer" aria-label="Close sidebar">
              <ChevronLeftIcon size={20} />
            </button>
          </div>

          {/* Segmented tabs */}
          <div className="p-2 border-b border-gray-200 bg-white">
            <div className="flex gap-1 bg-gray-100 rounded-full p-1">
              <button
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-full cursor-pointer transition ${activeTab === 'people' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => handleTabChange('people')}
              >
                <div className="flex items-center justify-center gap-2">
                  <UsersIcon size={16} />
                  <span>People</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-full cursor-pointer transition ${activeTab === 'add-person' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={handleAddPersonTab}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlusIcon size={16} />
                  <span>Add</span>
                </div>
              </button>
              <button
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-full cursor-pointer transition ${activeTab === 'add-relationship' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => handleTabChange('add-relationship')}
              >
                <div className="flex items-center justify-center gap-2">
                  <LinkIcon size={16} />
                  <span>Relate</span>
                </div>
              </button>
            </div>
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
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 border border-gray-200 cursor-pointer"
        >
          <ChevronRightIcon size={20} />
        </button>
      )}

    </>
  );
};

export default Sidebar;
