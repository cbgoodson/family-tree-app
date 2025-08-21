import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Person, useFamily } from '../context/FamilyContext';
type RelationshipModalProps = {
  sourcePerson: Person;
  targetPerson: Person;
  onClose: () => void;
};
const RelationshipModal: React.FC<RelationshipModalProps> = ({
  sourcePerson,
  targetPerson,
  onClose
}) => {
  const {
    addRelationship
  } = useFamily();
  const [relationshipType, setRelationshipType] = useState('parent-child');
  const [customType, setCustomType] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = relationshipType === 'custom' ? customType : relationshipType;
    addRelationship({
      source: sourcePerson.id,
      target: targetPerson.id,
      type: finalType
    });
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Define Relationship</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <p className="text-center text-gray-700 mb-2">
              Define the relationship between:
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">{sourcePerson.name}</span>
              <span className="text-gray-500">and</span>
              <span className="font-medium">{targetPerson.name}</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Type
            </label>
            <select value={relationshipType} onChange={e => setRelationshipType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="parent-child">
                {sourcePerson.name} is parent of {targetPerson.name}
              </option>
              <option value="child-parent">
                {sourcePerson.name} is child of {targetPerson.name}
              </option>
              <option value="spouse">
                {sourcePerson.name} is spouse of {targetPerson.name}
              </option>
              <option value="ex-spouse">
                {sourcePerson.name} is ex-spouse of {targetPerson.name}
              </option>
              <option value="sibling">
                {sourcePerson.name} is sibling of {targetPerson.name}
              </option>
              <option value="dating">
                {sourcePerson.name} is dating {targetPerson.name}
              </option>
              <option value="custom">Custom relationship...</option>
            </select>
            {relationshipType === 'custom' && <input type="text" value={customType} onChange={e => setCustomType(e.target.value)} placeholder="Enter custom relationship" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md" disabled={relationshipType === 'custom' && !customType}>
              Create Relationship
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default RelationshipModal;