/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Person } from '../types/Person';
import { loadPeople, savePeople, generateId } from '../utils/storage';

interface FamilyContextType {
  people: Person[];
  addPerson: (person: Omit<Person, 'id'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addRelationship: (personId: string, relatedPersonId: string, type: 'parent' | 'spouse' | 'child') => void;
  removeRelationship: (personId: string, relatedPersonId: string) => void;
  getPersonById: (id: string) => Person | undefined;
  searchPeople: (query: string) => Person[];
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamilyContext = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamilyContext must be used within a FamilyProvider');
  }
  return context;
};

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const savedPeople = loadPeople();
    setPeople(savedPeople);
  }, []);

  useEffect(() => {
    savePeople(people);
  }, [people]);

  const addPerson = (personData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...personData,
      id: generateId(),
    };
    setPeople(prev => [...prev, newPerson]);
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople(prev => prev.map(person => 
      person.id === id ? { ...person, ...updates } : person
    ));
  };

  const deletePerson = (id: string) => {
    setPeople(prev => {
      const updatedPeople = prev.filter(person => person.id !== id);
      return updatedPeople.map(person => ({
        ...person,
        parentIds: person.parentIds.filter(pid => pid !== id),
        spouseIds: person.spouseIds.filter(sid => sid !== id),
        childrenIds: person.childrenIds.filter(cid => cid !== id),
      }));
    });
  };

  const addRelationship = (personId: string, relatedPersonId: string, type: 'parent' | 'spouse' | 'child') => {
    if (personId === relatedPersonId) return;

    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        if (type === 'parent' && !person.parentIds.includes(relatedPersonId)) {
          return { ...person, parentIds: [...person.parentIds, relatedPersonId] };
        } else if (type === 'spouse' && !person.spouseIds.includes(relatedPersonId)) {
          return { ...person, spouseIds: [...person.spouseIds, relatedPersonId] };
        } else if (type === 'child' && !person.childrenIds.includes(relatedPersonId)) {
          return { ...person, childrenIds: [...person.childrenIds, relatedPersonId] };
        }
      }
      if (person.id === relatedPersonId) {
        if (type === 'parent' && !person.childrenIds.includes(personId)) {
          return { ...person, childrenIds: [...person.childrenIds, personId] };
        } else if (type === 'spouse' && !person.spouseIds.includes(personId)) {
          return { ...person, spouseIds: [...person.spouseIds, personId] };
        } else if (type === 'child' && !person.parentIds.includes(personId)) {
          return { ...person, parentIds: [...person.parentIds, personId] };
        }
      }
      return person;
    }));
  };

  const removeRelationship = (personId: string, relatedPersonId: string) => {
    setPeople(prev => prev.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          parentIds: person.parentIds.filter(id => id !== relatedPersonId),
          spouseIds: person.spouseIds.filter(id => id !== relatedPersonId),
          childrenIds: person.childrenIds.filter(id => id !== relatedPersonId),
        };
      }
      if (person.id === relatedPersonId) {
        return {
          ...person,
          parentIds: person.parentIds.filter(id => id !== personId),
          spouseIds: person.spouseIds.filter(id => id !== personId),
          childrenIds: person.childrenIds.filter(id => id !== personId),
        };
      }
      return person;
    }));
  };

  const getPersonById = (id: string): Person | undefined => {
    return people.find(person => person.id === id);
  };

  const searchPeople = (query: string): Person[] => {
    const lowercaseQuery = query.toLowerCase();
    return people.filter(person => 
      person.firstName.toLowerCase().includes(lowercaseQuery) ||
      person.lastName.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: FamilyContextType = {
    people,
    addPerson,
    updatePerson,
    deletePerson,
    addRelationship,
    removeRelationship,
    getPersonById,
    searchPeople,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};