import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Person } from '../types/Person';
import { PersonFormInline } from './PersonFormInline';
import { RelationshipEditorInline } from './RelationshipEditorInline';

interface PersonEditorOverlayProps {
  person?: Person;
  onSubmit: (data: Omit<Person, 'id'>) => void;
  onCancel: () => void;
}

type TabKey = 'details' | 'relationships';

export const PersonEditorOverlay: React.FC<PersonEditorOverlayProps> = ({ person, onSubmit, onCancel }) => {
  const [active, setActive] = useState<TabKey>('details');
  const [openedAt] = useState<number>(() => Date.now());

  console.log('PersonEditorOverlay: Rendering with person:', person);
  console.log('PersonEditorOverlay: This overlay should be VISIBLE on screen right now!');

  const handleBackdropClick = () => {
    // Prevent immediate close if opened via double-click
    if (Date.now() - openedAt < 200) return;
    onCancel();
  };

  // Use portal to render directly to document body - inline content
  console.log('About to return overlay content via portal');
  return createPortal(
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Proper dark overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '768px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontWeight: '600', margin: 0 }}>{person ? 'Edit Person' : 'Add New Person'}</h2>
              {person && <p style={{ fontSize: '12px', opacity: 0.8, margin: '4px 0 0 0' }}>{person.firstName} {person.lastName}</p>}
            </div>
            <button onClick={onCancel} style={{
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer'
            }}>
              ✕
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
            <button 
              onClick={() => setActive('details')} 
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                border: 'none',
                backgroundColor: active === 'details' ? 'white' : 'transparent',
                color: active === 'details' ? '#1d4ed8' : 'rgba(255,255,255,0.9)',
                cursor: 'pointer'
              }}
            >
              Details
            </button>
            <button 
              onClick={() => setActive('relationships')} 
              style={{
                padding: '6px 12px',
                fontSize: '14px',
                border: 'none',
                backgroundColor: active === 'relationships' ? 'white' : 'transparent',
                color: active === 'relationships' ? '#1d4ed8' : 'rgba(255,255,255,0.9)',
                cursor: 'pointer'
              }}
            >
              Relationships
            </button>
          </div>
        </div>
        <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
          {active === 'details' && (
            <PersonFormInline
              person={person}
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          )}
          {active === 'relationships' && (
            person ? (
              <RelationshipEditorInline person={person} />
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: '#fefce8',
                border: '1px solid #fde047',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#a16207'
              }}>
                Save this person first, then manage relationships.
              </div>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
