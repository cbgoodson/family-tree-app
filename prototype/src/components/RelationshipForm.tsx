import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
const RelationshipForm: React.FC = () => {
  const {
    people,
    addRelationship
  } = useFamily();
  const [formData, setFormData] = useState({
    source: '',
    target: '',
    type: 'parent-child'
  });
  const [customType, setCustomType] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.target) {
      // Use custom type if selected
      const finalType = formData.type === 'custom' ? customType : formData.type;
      addRelationship({
        source: formData.source,
        target: formData.target,
        type: finalType
      });
      // Reset form
      setFormData({
        source: '',
        target: '',
        type: 'parent-child'
      });
      setCustomType('');
    }
  };
  return <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Add Relationship
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Person 1
          </label>
          <select id="source" name="source" value={formData.source} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">Select a person</option>
            {people.map(person => <option key={person.id} value={person.id}>
                {person.name}
              </option>)}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Type
          </label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="parent-child">Parent-Child</option>
            <option value="child-parent">Child-Parent</option>
            <option value="spouse">Spouse</option>
            <option value="ex-spouse">Ex-Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="dating">Dating</option>
            <option value="custom">Custom...</option>
          </select>
          {formData.type === 'custom' && <input type="text" name="customType" value={customType} onChange={e => setCustomType(e.target.value)} placeholder="Enter custom relationship type" className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" required />}
        </div>
        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            Person 2
          </label>
          <select id="target" name="target" value={formData.target} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">Select a person</option>
            {people.filter(person => person.id !== formData.source).map(person => <option key={person.id} value={person.id}>
                  {person.name}
                </option>)}
          </select>
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={!formData.source || !formData.target || formData.type === 'custom' && !customType}>
          Add Relationship
        </button>
      </form>
    </div>;
};
export default RelationshipForm;