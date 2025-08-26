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
  const accent = person.gender === 'female' ? 'from-pink-300/60 to-pink-400/60'
                : person.gender === 'male' ? 'from-blue-300/60 to-blue-400/60'
                : 'from-slate-300/60 to-slate-400/60';

  return (
    <div
      tabIndex={0}
      className={[
        'relative w-[260px] rounded-2xl border border-white/40 shadow-lg',
        'bg-white/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur',
        'focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2',
        'transition-all duration-200 hover:shadow-xl hover:ring-1 hover:ring-blue-200/60',
        selected ? 'ring-2 ring-blue-400/60' : ''
      ].join(' ')}
    >
      {/* Accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${accent}`} />
      {/* Top content */}
      <div className="p-3 pt-4 flex items-center gap-3">
        {person.photo ? (
          <img src={person.photo} alt={name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/70" />
        ) : (
          <div className="h-12 w-12 rounded-full grid place-items-center ring-2 ring-white/70 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-neutral-700 dark:to-neutral-800">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 select-none">{initialsOf(person)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="truncate font-semibold text-neutral-900 dark:text-neutral-100">{name || 'Unnamed'}</div>
          {life && <div className="text-xs opacity-70">{life}</div>}
          {person.notes && <div className="text-[11px] opacity-70 line-clamp-2">{person.notes}</div>}
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
          className="h-7 w-7 grid place-items-center rounded-md border text-neutral-600 hover:text-blue-600 hover:bg-blue-50"
          title="Edit person"
          aria-label="Edit person"
        >
          <Edit3 size={14}/>
        </button>
        <button
          onClick={() => onManageRelationships?.(person)}
          className="h-7 w-7 grid place-items-center rounded-md border text-neutral-600 hover:text-pink-600 hover:bg-pink-50"
          title="Manage relationships"
          aria-label="Manage relationships"
        >
          <Users2 size={14}/>
        </button>
      </div>

      {/* Connection handles for edges */}
      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(PersonNode);
