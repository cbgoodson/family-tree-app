import React, { useState } from 'react';
import type { Person } from '../types/Person';
import { useFamilyContext } from '../context/FamilyContext';

interface TreeNode {
  person: Person;
  children: TreeNode[];
  x: number;
  y: number;
  level: number;
}

export const SimpleTreeView: React.FC = () => {
  const { people, getPersonById } = useFamilyContext();
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);

  if (people.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-inner">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">Your family tree awaits</p>
          <p className="text-gray-500 text-sm mt-1">Add family members to see the beautiful tree visualization</p>
        </div>
      </div>
    );
  }

  const buildTreeData = (): TreeNode[] => {
    const rootPeople = people.filter(person => person.parentIds.length === 0);
    const peopleToShow = rootPeople.length > 0 ? rootPeople : people.slice(0, 1);
    
    const buildNode = (person: Person, level: number = 0): TreeNode => {
      const children = person.childrenIds
        .map(id => getPersonById(id))
        .filter(Boolean) as Person[];
      
      return {
        person,
        children: children.map(child => buildNode(child, level + 1)),
        x: 0,
        y: 0,
        level
      };
    };
    
    return peopleToShow.map(person => buildNode(person));
  };

  const calculateAge = (person: Person): string => {
    if (!person.birthDate) return '';
    const birth = new Date(person.birthDate);
    const end = person.deathDate ? new Date(person.deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return person.deathDate ? `(${age})` : `(${age})`;
  };

  const renderPersonCard = (node: TreeNode) => {
    const { person } = node;
    const spouses = person.spouseIds.map(id => getPersonById(id)).filter(Boolean) as Person[];
    const isHovered = hoveredPerson === person.id;
    const isSelected = selectedPerson === person.id;
    const age = calculateAge(person);
    
    return (
      <div
        key={person.id}
        className={`relative transition-all duration-300 transform ${
          isHovered ? 'scale-105 z-10' : 'scale-100'
        } ${
          isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
        }`}
        onMouseEnter={() => setHoveredPerson(person.id)}
        onMouseLeave={() => setHoveredPerson(null)}
        onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
      >
        <div className={`
          bg-gradient-to-br from-white to-gray-50 
          border-2 rounded-2xl p-4 shadow-lg 
          min-w-[240px] max-w-[280px] cursor-pointer
          transition-all duration-300
          ${
            person.deathDate 
              ? 'border-gray-300 shadow-gray-200' 
              : 'border-emerald-200 shadow-emerald-100'
          }
          ${
            isHovered 
              ? 'shadow-xl border-blue-300 bg-gradient-to-br from-blue-50 to-white' 
              : ''
          }
        `}>
          {/* Gender indicator dot */}
          <div className={`
            absolute -top-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-md
            ${person.firstName.endsWith('a') || person.firstName.endsWith('e') 
              ? 'bg-gradient-to-br from-pink-400 to-rose-400' 
              : 'bg-gradient-to-br from-blue-400 to-cyan-400'
            }
          `} />
          
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-1 leading-tight">
              {person.firstName}
            </h3>
            <h4 className="font-semibold text-gray-700 mb-3">
              {person.lastName}
            </h4>
            
            <div className="space-y-2 text-sm">
              {person.birthDate && (
                <div className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-600">
                    Born {new Date(person.birthDate).getFullYear()} {age}
                  </span>
                </div>
              )}
              
              {person.deathDate && (
                <div className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">
                    Died {new Date(person.deathDate).getFullYear()}
                  </span>
                </div>
              )}
            </div>
            
            {spouses.length > 0 && (
              <div className="mt-3 p-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-rose-600">Married to</span>
                </div>
                <p className="text-xs text-rose-700 font-medium">
                  {spouses.map(s => `${s.firstName} ${s.lastName}`).join(', ')}
                </p>
              </div>
            )}
            
            {person.notes && isSelected && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 italic">{person.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTree = (nodes: TreeNode[], isRoot = true) => {
    return (
      <div className={`${isRoot ? 'space-y-8' : 'space-y-6'}`}>
        {nodes.map((node) => (
          <div key={node.person.id} className="flex flex-col items-center">
            {renderPersonCard(node)}
            
            {node.children.length > 0 && (
              <div className="relative mt-6">
                {/* Connecting line down */}
                <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-blue-400 transform -translate-x-0.5" />
                
                {/* Horizontal line for multiple children */}
                {node.children.length > 1 && (
                  <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                )}
                
                {/* Children container */}
                <div className={`
                  pt-12 flex gap-8 justify-center items-start
                  ${node.children.length > 1 ? 'flex-wrap' : ''}
                `}>
                  {node.children.map((child) => (
                    <div key={child.person.id} className="relative">
                      {/* Connecting line to child */}
                      {node.children.length > 1 && (
                        <div className="absolute -top-12 left-1/2 w-0.5 h-4 bg-blue-400 transform -translate-x-0.5" />
                      )}
                      
                      <div className="flex flex-col items-center">
                        {renderPersonCard(child)}
                        
                        {child.children.length > 0 && (
                          <div className="mt-6">
                            {renderTree([child], false)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const treeData = buildTreeData();

  return (
    <div className="w-full min-h-[600px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl overflow-auto p-8 shadow-inner">
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Family Tree</h2>
          <p className="text-gray-600 text-sm">
            Click on family members to see more details • Hover for enhanced view
          </p>
        </div>
        
        {renderTree(treeData)}
      </div>
    </div>
  );
};