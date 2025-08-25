import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ChevronDown, ChevronRight, Edit3, Users2 } from 'lucide-react';
import type { Person } from '../types/Person';

export interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  onEdit?: (person: Person) => void;
  onManageRelationships?: (person: Person) => void;
  onToggleCollapse?: (person: Person) => void;
}

interface PersonNodeProps {
  data: PersonNodeData;
  selected?: boolean;
}

function initialsOf(p: Person): string {
  const parts = `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim().split(/\s+/);
  return parts.slice(0, 2).map(s => s[0]?.toUpperCase() ?? '').join('');
}

function lifespan(p: Person): string | undefined {
  const b = p.birthDate ? new Date(p.birthDate).getFullYear() : undefined;
  const d = p.deathDate ? new Date(p.deathDate).getFullYear() : undefined;
  if (!b && !d) return undefined;
  if (b && !d) return `${b}–`;
  if (!b && d) return `–${d}`;
  return `${b}–${d}`;
}

const PersonNode: React.FC<PersonNodeProps> = ({ data, selected }) => {
  const { person, onEdit, onManageRelationships, onToggleCollapse } = data;
  const name = `${person.firstName} ${person.lastName}`.trim();
  const life = lifespan(person);
  const collapsed = !!person.ui?.collapsed;

  return (
    <div
      tabIndex={0}
      className={[
        'rounded-2xl border shadow-sm bg-white/90 dark:bg-neutral-900/90',
        'border-neutral-200 dark:border-neutral-800',
        'w-[240px] focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2',
        selected ? 'ring-2 ring-blue-500/60' : ''
      ].join(' ')}
    >
      {/* Top content */}
      <div className="p-3 flex items-center gap-3">
        {person.photo ? (
          <img src={person.photo} alt={name} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full grid place-items-center bg-gradient-to-br from-slate-200 to-slate-300 dark:from-neutral-700 dark:to-neutral-800">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{initialsOf(person)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="truncate font-semibold text-neutral-900 dark:text-neutral-100">{name || 'Unnamed'}</div>
          {life && <div className="text-xs opacity-70">{life}</div>}
          {person.notes && <div className="text-[10px] opacity-70 line-clamp-1">{person.notes}</div>}
        </div>
        <button
          aria-label={collapsed ? 'Expand branch' : 'Collapse branch'}
          onClick={() => onToggleCollapse?.(person)}
          className="shrink-0 rounded-md border px-1.5 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/5"
          title={collapsed ? 'Expand branch' : 'Collapse branch'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={() => onEdit?.(person)}
          className="text-xs rounded-md border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
          title="Edit person"
        >
          <Edit3 className="inline-block mr-1" size={14}/> Edit
        </button>
        <button
          onClick={() => onManageRelationships?.(person)}
          className="text-xs rounded-md border px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5"
          title="Manage relationships"
        >
          <Users2 className="inline-block mr-1" size={14}/> Relate
        </button>
      </div>

      {/* Connection handles for edges */}
      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(PersonNode);
