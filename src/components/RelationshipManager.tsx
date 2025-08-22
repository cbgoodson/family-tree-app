import React, { useState, useEffect, useRef } from 'react';
import type { Person } from '../types/Person';
import { useFamilyContext } from '../context/FamilyContext';

interface RelationshipManagerProps {
  person: Person;
  onClose: () => void;
}

export const RelationshipManager: React.FC<RelationshipManagerProps> = ({ person, onClose }) => {
  const { people, addRelationship, removeRelationship, getPersonById } = useFamilyContext();
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [relationshipType, setRelationshipType] = useState<'parent' | 'spouse' | 'child'>('parent');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const availablePeople = people.filter(p => {
    if (p.id === person.id) return false;
    const alreadyRelated = 
      person.parentIds.includes(p.id) ||
      person.spouseIds.includes(p.id) ||
      person.childrenIds.includes(p.id);
    return !alreadyRelated;
  });

  const filteredPeople = availablePeople.filter(p => 
    searchTerm === '' || 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRelationship = () => {
    if (selectedPersonId) {
      addRelationship(person.id, selectedPersonId, relationshipType);
      setSelectedPersonId('');
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleRemoveRelationship = (relatedPersonId: string) => {
    if (window.confirm('Are you sure you want to remove this relationship?')) {
      removeRelationship(person.id, relatedPersonId);
    }
  };

  const getRelatedPeople = (ids: string[]) => {
    return ids.map(id => getPersonById(id)).filter(Boolean) as Person[];
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 150);
  };

  const getRelationshipIcon = (type: 'parent' | 'spouse' | 'child') => {
    switch (type) {
      case 'parent':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'spouse':
        return (
          <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        );
      case 'child':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
    }
  };

  const getRelationshipColor = (type: 'parent' | 'spouse' | 'child') => {
    switch (type) {
      case 'parent': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'spouse': return 'from-rose-50 to-pink-50 border-rose-200';
      case 'child': return 'from-yellow-50 to-amber-50 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-300`}>
        
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Manage Relationships</h2>
            <p className="text-blue-100 text-sm">{person.firstName} {person.lastName}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Add relationship form */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg mb-4">Add New Relationship</h3>
            
            <div className="space-y-4">
              {/* Search input */}
              <div ref={searchRef}>
                <label className="block text-sm font-medium mb-1">Select Person</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(e.target.value.length > 0);
                      setSelectedPersonId('');
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {showDropdown && searchTerm && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredPeople.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedPersonId(p.id);
                            setSearchTerm(`${p.firstName} ${p.lastName}`);
                            setShowDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
                        >
                          {p.firstName} {p.lastName}
                          {p.birthDate && (
                            <span className="text-xs text-gray-500 ml-2">
                              (Born {new Date(p.birthDate).getFullYear()})
                            </span>
                          )}
                        </button>
                      ))}
                      {filteredPeople.length === 0 && (
                        <div className="px-3 py-2 text-gray-500 text-sm">No people found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Relationship type and button */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Relationship</label>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value as 'parent' | 'spouse' | 'child')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="parent">Parent</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddRelationship}
                    disabled={!selectedPersonId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current relationships */}
          <div className="p-6 space-y-4">
            {/* Parents */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Parents ({getRelatedPeople(person.parentIds).length})</h4>
              {getRelatedPeople(person.parentIds).length === 0 ? (
                <p className="text-gray-500 text-sm">No parents added</p>
              ) : (
                <div className="space-y-2">
                  {getRelatedPeople(person.parentIds).map(parent => (
                    <div key={parent.id} className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div>
                        <span className="font-medium">{parent.firstName} {parent.lastName}</span>
                        {parent.birthDate && (
                          <span className="text-sm text-gray-600 ml-2">Born {new Date(parent.birthDate).getFullYear()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(parent.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spouses */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Spouses ({getRelatedPeople(person.spouseIds).length})</h4>
              {getRelatedPeople(person.spouseIds).length === 0 ? (
                <p className="text-gray-500 text-sm">No spouses added</p>
              ) : (
                <div className="space-y-2">
                  {getRelatedPeople(person.spouseIds).map(spouse => (
                    <div key={spouse.id} className="flex justify-between items-center p-3 bg-pink-50 border border-pink-200 rounded-md">
                      <div>
                        <span className="font-medium">{spouse.firstName} {spouse.lastName}</span>
                        {spouse.birthDate && (
                          <span className="text-sm text-gray-600 ml-2">Born {new Date(spouse.birthDate).getFullYear()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(spouse.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Children */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Children ({getRelatedPeople(person.childrenIds).length})</h4>
              {getRelatedPeople(person.childrenIds).length === 0 ? (
                <p className="text-gray-500 text-sm">No children added</p>
              ) : (
                <div className="space-y-2">
                  {getRelatedPeople(person.childrenIds).map(child => (
                    <div key={child.id} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div>
                        <span className="font-medium">{child.firstName} {child.lastName}</span>
                        {child.birthDate && (
                          <span className="text-sm text-gray-600 ml-2">Born {new Date(child.birthDate).getFullYear()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(child.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <button
            onClick={handleClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};