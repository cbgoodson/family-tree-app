export type LifeEvent = {
  id: string;
  type: 'birth' | 'marriage' | 'death' | 'other';
  date?: string; // ISO YYYY-MM-DD
  place?: string;
  note?: string;
};

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  deathDate?: string;
  photo?: string; // existing field (data URL or URL)
  notes?: string;

  // Relationships
  parentIds: string[];
  spouseIds: string[];
  childrenIds: string[];

  // Optional enhancements (safe, non-breaking)
  nickname?: string;
  tags?: string[];
  lifeEvents?: LifeEvent[];
  ui?: {
    collapsed?: boolean;
  };
};

export type Relationship = {
  type: 'parent' | 'spouse' | 'child';
  personId: string;
  relatedPersonId: string;
};
