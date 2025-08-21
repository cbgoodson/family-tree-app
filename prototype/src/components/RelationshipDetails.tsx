import React, { useEffect, useState, useRef } from 'react';
import { Relationship, useFamily } from '../context/FamilyContext';
import { XIcon, EditIcon, TrashIcon } from 'lucide-react';
type RelationshipDetailsProps = {
  relationship: Relationship;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
};
const RelationshipDetails: React.FC<RelationshipDetailsProps> = ({
  relationship,
  position,
  onClose
}) => {
  const {
    people,
    deleteRelationship,
    updateRelationship
  } = useFamily();
  const [isEditing, setIsEditing] = useState(false);
  const [editedType, setEditedType] = useState(relationship.type);
  const [customType, setCustomType] = useState('');
  const detailsRef = useRef<HTMLDivElement>(null);
  const sourcePerson = people.find(p => p.id === relationship.source);
  const targetPerson = people.find(p => p.id === relationship.target);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  const handleDelete = () => {
    deleteRelationship(relationship.id);
    onClose();
  };
  const handleSave = () => {
    const finalType = editedType === 'custom' ? customType : editedType;
    updateRelationship(relationship.id, {
      type: finalType
    });
    setIsEditing(false);
  };
  return <div ref={detailsRef} className="absolute bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200 min-w-[250px]" style={{
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)'
  }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">Relationship Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XIcon size={18} />
        </button>
      </div>
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{sourcePerson?.name}</span> is{' '}
          {isEditing ? <div className="mt-2">
              <select value={editedType} onChange={e => setEditedType(e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm">
                <option value="parent-child">Parent of</option>
                <option value="child-parent">Child of</option>
                <option value="spouse">Spouse of</option>
                <option value="ex-spouse">Ex-spouse of</option>
                <option value="sibling">Sibling of</option>
                <option value="dating">Dating</option>
                <option value="custom">Custom...</option>
              </select>
              {editedType === 'custom' && <input type="text" value={customType} onChange={e => setCustomType(e.target.value)} placeholder="Enter custom relationship" className="mt-2 w-full px-2 py-1 border border-gray-300 rounded-md text-sm" />}
            </div> : <span className="font-medium text-blue-600">
              {relationship.type}
            </span>}{' '}
          <span className="font-medium">{targetPerson?.name}</span>
        </p>
      </div>
      <div className="flex justify-end gap-2">
        {isEditing ? <>
            <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
              Save
            </button>
          </> : <>
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">
              <EditIcon size={14} />
              Edit
            </button>
            <button onClick={handleDelete} className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">
              <TrashIcon size={14} />
              Delete
            </button>
          </>}
      </div>
    </div>;
};
export default RelationshipDetails;