import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { Person } from '../types/Person';
import { useFamilyContext } from '../context/FamilyContext';

interface RelationshipEditorInlineProps {
  person: Person;
}

export const RelationshipEditorInline: React.FC<RelationshipEditorInlineProps> = ({ person }) => {
  const { people, addRelationship, removeRelationship, getPersonById } = useFamilyContext();
  
  // Get the live person data from context instead of using the static prop
  const livePerson = getPersonById(person.id) || person;
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [relationshipType, setRelationshipType] = useState<'parent' | 'spouse' | 'child'>('parent');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availablePeople = useMemo(() => {
    return people.filter(p => {
      if (p.id === livePerson.id) return false;
      const isRelated = livePerson.parentIds.includes(p.id) || livePerson.spouseIds.includes(p.id) || livePerson.childrenIds.includes(p.id);
      return !isRelated;
    });
  }, [people, livePerson]);

  const filteredPeople = useMemo(() => (
    availablePeople.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [availablePeople, searchTerm]);

  const getRelatedPeople = (ids: string[]) => ids.map(id => getPersonById(id)).filter(Boolean) as Person[];

  const handleAdd = () => {
    if (selectedPersonId) {
      addRelationship(livePerson.id, selectedPersonId, relationshipType);
      setSelectedPersonId('');
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3" ref={searchRef}>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Select Person</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                placeholder="Type to search..."
                onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); setSelectedPersonId(''); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {showDropdown && searchTerm && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow max-h-40 overflow-y-auto">
                  {filteredPeople.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedPersonId(p.id); setSearchTerm(`${p.firstName} ${p.lastName}`); setShowDropdown(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-b-0 cursor-pointer text-sm"
                    >
                      {p.firstName} {p.lastName}
                    </button>
                  ))}
                  {filteredPeople.length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">No people found</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Relationship</label>
            <select
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value as 'parent' | 'spouse' | 'child')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="parent">Parent</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAdd}
              disabled={!selectedPersonId}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h4 className="font-medium text-sm mb-2">Parents ({livePerson.parentIds.length})</h4>
          {getRelatedPeople(livePerson.parentIds).length === 0 ? (
            <p className="text-sm text-gray-500">No parents added</p>
          ) : (
            <div className="space-y-2">
              {getRelatedPeople(livePerson.parentIds).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <span className="text-sm">{p.firstName} {p.lastName}</span>
                  <button onClick={() => removeRelationship(livePerson.id, p.id)} className="text-xs text-red-600 hover:text-red-800 p-1 cursor-pointer">Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h4 className="font-medium text-sm mb-2">Spouses ({livePerson.spouseIds.length})</h4>
          {getRelatedPeople(livePerson.spouseIds).length === 0 ? (
            <p className="text-sm text-gray-500">No spouses added</p>
          ) : (
            <div className="space-y-2">
              {getRelatedPeople(livePerson.spouseIds).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-pink-50 border border-pink-200 rounded-md">
                  <span className="text-sm">{p.firstName} {p.lastName}</span>
                  <button onClick={() => removeRelationship(livePerson.id, p.id)} className="text-xs text-red-600 hover:text-red-800 p-1 cursor-pointer">Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h4 className="font-medium text-sm mb-2">Children ({livePerson.childrenIds.length})</h4>
          {getRelatedPeople(livePerson.childrenIds).length === 0 ? (
            <p className="text-sm text-gray-500">No children added</p>
          ) : (
            <div className="space-y-2">
              {getRelatedPeople(livePerson.childrenIds).map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <span className="text-sm">{p.firstName} {p.lastName}</span>
                  <button onClick={() => removeRelationship(livePerson.id, p.id)} className="text-xs text-red-600 hover:text-red-800 p-1 cursor-pointer">Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

