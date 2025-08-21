import React, { useEffect, useState } from 'react';
import { XIcon, SaveIcon } from 'lucide-react';
import { Person, useFamily } from '../context/FamilyContext';
type PersonDetailsProps = {
  person: Person;
  onClose: () => void;
};
const PersonDetails: React.FC<PersonDetailsProps> = ({
  person,
  onClose
}) => {
  const {
    updatePerson,
    deletePerson
  } = useFamily();
  const [formData, setFormData] = useState<Person>({
    ...person
  });
  useEffect(() => {
    setFormData({
      ...person
    });
  }, [person]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    updatePerson(person.id, formData);
    onClose();
  };
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      deletePerson(person.id);
      onClose();
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Edit Person</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender || 'other'} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Birth Date
                </label>
                <input type="date" id="birthDate" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="deathDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Death Date
                </label>
                <input type="date" id="deathDate" name="deathDate" value={formData.deathDate || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
            </div>
          </div>
          <div className="mt-5 flex justify-between">
            <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
              Delete Person
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1">
                <SaveIcon size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>;
};
export default PersonDetails;