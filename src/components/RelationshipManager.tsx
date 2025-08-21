import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setIsAnimating(true);
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
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden
          transform transition-all duration-300
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Family Relationships
              </h2>
              <p className="text-indigo-100 text-sm">
                Managing relationships for <span className="font-semibold">{person.firstName} {person.lastName}</span>
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add relationship section */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Relationship
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Person search/select */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Person
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 bg-white transition-all duration-200"
                  />
                  <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {searchTerm && (
                  <div className="mt-2 max-h-32 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredPeople.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPersonId(p.id);
                          setSearchTerm(`${p.firstName} ${p.lastName}`);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                      >
                        {p.firstName} {p.lastName}
                      </button>
                    ))}
                    {filteredPeople.length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-sm">No people found</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Relationship type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Relationship Type
                </label>
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value as 'parent' | 'spouse' | 'child')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 bg-white transition-all duration-200"
                >
                  <option value="parent">Parent</option>
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                </select>
              </div>
              
              {/* Add button */}
              <div className="flex items-end">
                <button
                  onClick={handleAddRelationship}
                  disabled={!selectedPersonId}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {getRelationshipIcon(relationshipType)}
                  Add Relationship
                </button>
              </div>
            </div>
          </div>

          {/* Relationships display */}
          <div className="p-6 space-y-8">
            {/* Parents */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                {getRelationshipIcon('parent')}
                Parents
                <span className="text-sm font-normal text-gray-500">({getRelatedPeople(person.parentIds).length})</span>
              </h3>
              {getRelatedPeople(person.parentIds).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500">No parents added yet</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {getRelatedPeople(person.parentIds).map(parent => (
                    <div key={parent.id} className={`flex justify-between items-center p-4 bg-gradient-to-r ${getRelationshipColor('parent')} rounded-xl border-2 transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-3">
                        {getRelationshipIcon('parent')}
                        <div>
                          <span className="font-semibold text-gray-800">{parent.firstName} {parent.lastName}</span>
                          {parent.birthDate && (
                            <p className="text-sm text-gray-600">Born {new Date(parent.birthDate).getFullYear()}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(parent.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Remove relationship"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Spouses */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                {getRelationshipIcon('spouse')}
                Spouses
                <span className="text-sm font-normal text-gray-500">({getRelatedPeople(person.spouseIds).length})</span>
              </h3>
              {getRelatedPeople(person.spouseIds).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-500">No spouses added yet</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {getRelatedPeople(person.spouseIds).map(spouse => (
                    <div key={spouse.id} className={`flex justify-between items-center p-4 bg-gradient-to-r ${getRelationshipColor('spouse')} rounded-xl border-2 transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-3">
                        {getRelationshipIcon('spouse')}
                        <div>
                          <span className="font-semibold text-gray-800">{spouse.firstName} {spouse.lastName}</span>
                          {spouse.birthDate && (
                            <p className="text-sm text-gray-600">Born {new Date(spouse.birthDate).getFullYear()}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(spouse.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Remove relationship"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Children */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                {getRelationshipIcon('child')}
                Children
                <span className="text-sm font-normal text-gray-500">({getRelatedPeople(person.childrenIds).length})</span>
              </h3>
              {getRelatedPeople(person.childrenIds).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="text-gray-500">No children added yet</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {getRelatedPeople(person.childrenIds).map(child => (
                    <div key={child.id} className={`flex justify-between items-center p-4 bg-gradient-to-r ${getRelationshipColor('child')} rounded-xl border-2 transition-all duration-200 hover:shadow-md`}>
                      <div className="flex items-center gap-3">
                        {getRelationshipIcon('child')}
                        <div>
                          <span className="font-semibold text-gray-800">{child.firstName} {child.lastName}</span>
                          {child.birthDate && (
                            <p className="text-sm text-gray-600">Born {new Date(child.birthDate).getFullYear()}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRelationship(child.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Remove relationship"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Done Managing Relationships
          </button>
        </div>
      </div>
    </div>
  );
};