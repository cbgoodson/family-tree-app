import React, { useState } from 'react';
import type { Person } from '../types/Person';
import { useFamilyContext } from '../context/FamilyContext';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onViewRelationships: (person: Person) => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onEdit, onViewRelationships }) => {
  const { deletePerson, getPersonById } = useFamilyContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${person.firstName} ${person.lastName}?`)) {
      deletePerson(person.id);
    }
  };

  const calculateAge = () => {
    if (!person.birthDate) return null;
    const birth = new Date(person.birthDate);
    const end = person.deathDate ? new Date(person.deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  const getRelationshipCounts = () => {
    return {
      parents: person.parentIds.length,
      spouses: person.spouseIds.length,
      children: person.childrenIds.length
    };
  };

  const getRelationshipHighlights = () => {
    const parents = person.parentIds.map(id => getPersonById(id)).filter(Boolean);
    const spouses = person.spouseIds.map(id => getPersonById(id)).filter(Boolean);
    const children = person.childrenIds.map(id => getPersonById(id)).filter(Boolean);

    return { parents, spouses, children };
  };

  const age = calculateAge();
  const counts = getRelationshipCounts();
  const relationships = getRelationshipHighlights();

  return (
      <div
        className={`
          relative bg-gradient-to-br from-white to-gray-50
          rounded-2xl shadow-lg border-2 transition-all duration-300
          transform hover:scale-[1.02] hover:shadow-xl
          ${person.deathDate
            ? 'border-gray-300 shadow-gray-200'
            : 'border-blue-300 shadow-blue-100 hover:border-blue-400'
          }
          ${isHovered ? 'bg-gradient-to-br from-blue-50 to-white border-blue-300' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Status indicator */}
      <div className={`
        absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-md
        ${person.deathDate 
          ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
          : 'bg-gradient-to-br from-green-400 to-emerald-500'
        }
      `} />
      
      {/* Gender indicator */}
      <div className={`
        absolute -top-2 -left-2 w-6 h-6 rounded-full border-4 border-white shadow-md
        ${person.firstName.endsWith('a') || person.firstName.endsWith('e') 
          ? 'bg-gradient-to-br from-pink-400 to-rose-400' 
          : 'bg-gradient-to-br from-blue-400 to-cyan-400'
        }
      `} />

      <div className="p-6">
        {person.photo && (
          <div className="mb-4 flex justify-center">
            <img
              src={person.photo}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-32 h-32 rounded-full object-cover shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        {/* Header with actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">
              {person.firstName}
            </h3>
            <h4 className="text-lg font-semibold text-gray-600">
              {person.lastName}
            </h4>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onEdit(person);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Life dates */}
        {(person.birthDate || person.deathDate) && (
          <div className="mb-4 space-y-2">
            {person.birthDate && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">
                  Born {new Date(person.birthDate).toLocaleDateString()}
                  {age && ` (${person.deathDate ? `lived ${age} years` : `age ${age}`})`}
                </span>
              </div>
            )}
            
            {person.deathDate && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600">
                  Died {new Date(person.deathDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Relationship summary */}
        <div className="mb-4">
          <div className="flex gap-4 mb-3">
            {counts.parents > 0 && (
              <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {counts.parents} parent{counts.parents !== 1 ? 's' : ''}
              </div>
            )}
            
            {counts.spouses > 0 && (
              <div className="flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {counts.spouses} spouse{counts.spouses !== 1 ? 's' : ''}
              </div>
            )}
            
            {counts.children > 0 && (
              <div className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {counts.children} child{counts.children !== 1 ? 'ren' : ''}
              </div>
            )}
            
            {counts.parents === 0 && counts.spouses === 0 && counts.children === 0 && (
              <div className="text-xs text-gray-500 italic">No relationships yet</div>
            )}
          </div>
          
          {/* Quick relationship preview */}
          {isHovered && (relationships.spouses.length > 0 || relationships.children.length > 0) && (
            <div className="space-y-1 text-xs">
              {relationships.spouses.length > 0 && (
                <div className="text-rose-600">
                  <strong>Married to:</strong> {relationships.spouses.map(s => `${s!.firstName} ${s!.lastName}`).join(', ')}
                </div>
              )}
              {relationships.children.length > 0 && (
                <div className="text-yellow-600">
                  <strong>Children:</strong> {relationships.children.slice(0, 2).map(c => `${c!.firstName} ${c!.lastName}`).join(', ')}
                  {relationships.children.length > 2 && ` and ${relationships.children.length - 2} more`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        {person.notes && (
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700 italic leading-relaxed">{person.notes}</p>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={() => onViewRelationships(person)}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Manage Relationships
        </button>
      </div>
      
      {/* Click outside handler for actions menu */}
      {showActions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};