import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFamilyContext } from '../context/FamilyContext';

interface RelationshipDefineModalProps {
  sourceId: string;
  targetId: string;
  onClose: () => void;
}

export const RelationshipDefineModal: React.FC<RelationshipDefineModalProps> = ({ sourceId, targetId, onClose }) => {
  const { getPersonById, addRelationship } = useFamilyContext();
  const source = useMemo(() => getPersonById(sourceId), [getPersonById, sourceId]);
  const target = useMemo(() => getPersonById(targetId), [getPersonById, targetId]);
  const [choice, setChoice] = useState<'parent' | 'child' | 'spouse'>('spouse');
  const [openedAt] = useState<number>(() => Date.now());

  if (!source || !target) return null;

  const confirm = () => {
    addRelationship(source.id, target.id, choice);
    onClose();
  };

  const handleBackdropClick = () => {
    if (Date.now() - openedAt < 200) return;
    onClose();
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 9999
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>Define Relationship</h3>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: '4px 0 0 0' }}>
            {source.firstName} {source.lastName} and {target.firstName} {target.lastName}
          </p>
        </div>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="rel" value="parent" checked={choice==='parent'} onChange={() => setChoice('parent')} />
            <span style={{ fontSize: '14px' }}>{source.firstName} is a parent of {target.firstName}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="rel" value="child" checked={choice==='child'} onChange={() => setChoice('child')} />
            <span style={{ fontSize: '14px' }}>{source.firstName} is a child of {target.firstName}</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="radio" name="rel" value="spouse" checked={choice==='spouse'} onChange={() => setChoice('spouse')} />
            <span style={{ fontSize: '14px' }}>{source.firstName} is a spouse of {target.firstName}</span>
          </label>
        </div>
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <button 
            onClick={onClose} 
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={confirm} 
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
