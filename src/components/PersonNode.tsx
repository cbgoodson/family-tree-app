import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { EditIcon, UserIcon } from 'lucide-react';
import type { Person } from '../types/Person';

export interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  onEdit?: (person: Person) => void;
}

interface PersonNodeProps {
  data: PersonNodeData;
  selected?: boolean;
}

const PersonNode: React.FC<PersonNodeProps> = ({ data, selected }) => {
  const { person, onEdit } = data;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(person);
    }
  };

  const calculateAge = (person: Person): string => {
    if (!person.birthDate) return '';
    const birth = new Date(person.birthDate);
    const end = person.deathDate ? new Date(person.deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return person.deathDate ? `(${age})` : `(${age})`;
  };

  const age = calculateAge(person);

    const borderClasses = person.gender === 'female'
      ? selected ? 'border-pink-500 shadow-pink-200' : 'border-pink-300 hover:border-pink-400'
      : person.gender === 'male'
        ? selected ? 'border-blue-500 shadow-blue-200' : 'border-blue-300 hover:border-blue-400'
        : selected ? 'border-gray-500 shadow-gray-200' : 'border-gray-300 hover:border-gray-400';

    const avatarClasses = person.gender === 'female'
      ? 'bg-pink-100 text-pink-500'
      : person.gender === 'male'
        ? 'bg-blue-100 text-blue-500'
        : 'bg-gray-100 text-gray-500';

    return (
      <div
        className={`
          bg-white border-2 rounded-xl p-3 shadow-lg min-w-[200px] max-w-[220px]
          transition-all duration-200
          ${borderClasses}
          ${person.deathDate ? 'opacity-75' : ''}
        `}
      >
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${avatarClasses}`}>
            <UserIcon size={20} />
          </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {person.firstName} {person.lastName}
          </h3>
          
          {person.birthDate && (
            <p className="text-xs text-gray-500">
              b. {new Date(person.birthDate).getFullYear()} {age}
            </p>
          )}
          
          {person.deathDate && (
            <p className="text-xs text-gray-500">
              d. {new Date(person.deathDate).getFullYear()}
            </p>
          )}
        </div>
        
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full flex-shrink-0"
          >
            <EditIcon size={14} />
          </button>
        )}
      </div>
      
      {person.notes && selected && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700 italic">{person.notes}</p>
        </div>
      )}
    </div>
  );
};

export default PersonNode;