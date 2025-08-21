export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  photo?: string;
  notes?: string;
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];
};

export type Relationship = {
  type: 'parent' | 'spouse' | 'child';
  personId: string;
  relatedPersonId: string;
};