import React, { useState, useEffect } from 'react';
import type { Person } from '../types/Person';

interface PersonFormInlineProps {
  person?: Person;
  onSubmit: (person: Omit<Person, 'id'>) => void;
  onCancel: () => void;
}

export const PersonFormInline: React.FC<PersonFormInlineProps> = ({ person, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: person?.firstName || '',
    lastName: person?.lastName || '',
    birthDate: person?.birthDate || '',
    deathDate: person?.deathDate || '',
    notes: person?.notes || '',
    parentIds: person?.parentIds || [],
    spouseIds: person?.spouseIds || [],
    childrenIds: person?.childrenIds || [],
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (person) {
      setFormData({
        firstName: person.firstName || '',
        lastName: person.lastName || '',
        birthDate: person.birthDate || '',
        deathDate: person.deathDate || '',
        notes: person.notes || '',
        parentIds: person.parentIds || [],
        spouseIds: person.spouseIds || [],
        childrenIds: person.childrenIds || [],
      });
    }
  }, [person]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (formData.birthDate && formData.deathDate) {
      const birth = new Date(formData.birthDate);
      const death = new Date(formData.deathDate);
      if (death < birth) {
        newErrors.deathDate = 'Death date cannot be before birth date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name fields */}
        <div>
          <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 text-sm border rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
              ${errors.firstName 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 bg-white'
              }
            `}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 text-sm border rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
              ${errors.lastName 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 bg-white'
              }
            `}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Date fields */}
        <div>
          <label htmlFor="birthDate" className="block text-xs font-medium text-gray-700 mb-1">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 bg-white transition-colors"
          />
        </div>

        <div>
          <label htmlFor="deathDate" className="block text-xs font-medium text-gray-700 mb-1">
            Death Date
          </label>
          <input
            type="date"
            id="deathDate"
            name="deathDate"
            value={formData.deathDate}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 text-sm border rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
              ${errors.deathDate 
                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                : 'border-gray-200 focus:border-blue-500 bg-white'
              }
            `}
          />
          {errors.deathDate && (
            <p className="mt-1 text-xs text-red-600">{errors.deathDate}</p>
          )}
        </div>

        {/* Notes field */}
        <div>
          <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 bg-white transition-colors resize-none"
            placeholder="Any additional information..."
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 text-sm rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-20 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-3 text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors font-medium"
          >
            {person ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};