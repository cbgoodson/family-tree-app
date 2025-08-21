import React, { useState } from 'react';
import '@xyflow/react/dist/style.css';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { UserIcon, EditIcon } from 'lucide-react';
import { useFamily, Person } from '../context/FamilyContext';
const PersonNode: React.FC<NodeProps<Person>> = ({
  data,
  id
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    centerOnPerson,
    showPersonDetails
  } = useFamily();
  const handleNodeClick = () => {
    centerOnPerson(id);
  };
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showPersonDetails(id);
  };
  // Format date to display only year if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };
  const birthYear = formatDate(data.birthDate);
  const deathYear = formatDate(data.deathDate);
  const yearsText = birthYear ? deathYear ? `${birthYear} - ${deathYear}` : `b. ${birthYear}` : '';
  // Determine node color based on gender
  const getNodeColor = () => {
    switch (data.gender) {
      case 'male':
        return 'bg-blue-50 border-blue-300';
      case 'female':
        return 'bg-pink-50 border-pink-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };
  return <>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className={`relative px-4 py-3 rounded-lg shadow-md border-2 w-[180px] transition-all duration-200 ${getNodeColor()} ${isHovered ? 'scale-105' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleNodeClick}>
        <button className="absolute top-1 right-1 p-1 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100" onClick={handleEditClick} title="Edit person">
          <EditIcon size={14} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          {data.imageUrl ? <img src={data.imageUrl} alt={data.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" /> : <div className={`w-12 h-12 rounded-full flex items-center justify-center ${data.gender === 'male' ? 'bg-blue-100' : data.gender === 'female' ? 'bg-pink-100' : 'bg-gray-100'}`}>
              <UserIcon size={24} className={data.gender === 'male' ? 'text-blue-500' : data.gender === 'female' ? 'text-pink-500' : 'text-gray-500'} />
            </div>}
          <div>
            <h3 className="font-medium text-gray-800 leading-tight">
              {data.name}
            </h3>
            {yearsText && <p className="text-xs text-gray-500">{yearsText}</p>}
          </div>
        </div>
        {/* Extended info shown on hover */}
        {isHovered && data.notes && <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 line-clamp-3">{data.notes}</p>
          </div>}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </>;
};
export default PersonNode;