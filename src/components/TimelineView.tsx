import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFamilyContext } from '../context/FamilyContext';
import { PersonCard } from './PersonCard';
import type { Person } from '../types/Person';

const ROW_HEIGHT = 260; // height of each row including padding

export const TimelineView: React.FC = () => {
  const { people } = useFamilyContext();

  const sorted = useMemo(() => {
    return [...people].sort((a, b) => {
      const aDate = a.birthDate ?? '';
      const bDate = b.birthDate ?? '';
      return aDate.localeCompare(bDate);
    });
  }, [people]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = Math.min(
    sorted.length,
    startIndex + Math.ceil(viewportHeight / ROW_HEIGHT) + 5
  );

  const handleEdit = (person: Person) => {
    window.dispatchEvent(new CustomEvent('editPerson', { detail: person }));
  };

  const handleRelationships = (person: Person) => {
    window.dispatchEvent(new CustomEvent('manageRelationships', { detail: person }));
  };

  const items: React.ReactNode[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    const person = sorted[i];
    items.push(
      <div
        key={person.id}
        style={{ position: 'absolute', top: i * ROW_HEIGHT, left: 0, right: 0, height: ROW_HEIGHT }}
        className="p-2"
      >
        <PersonCard person={person} onEdit={handleEdit} onViewRelationships={handleRelationships} />
      </div>
    );
  }

  return (
    <div ref={containerRef} onScroll={onScroll} className="h-full overflow-auto relative">
      <div style={{ height: sorted.length * ROW_HEIGHT, position: 'relative' }}>
        {items}
      </div>
    </div>
  );
};

export default TimelineView;
