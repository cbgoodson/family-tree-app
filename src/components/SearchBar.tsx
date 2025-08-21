import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search family members..." }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`
        relative transition-all duration-300 transform
        ${isFocused ? 'scale-105' : 'scale-100'}
      `}>
        <div className={`
          relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 transition-all duration-200
          ${isFocused 
            ? 'border-blue-400 shadow-xl bg-white' 
            : 'border-white/50 hover:border-white/80 hover:shadow-xl'
          }
        `}>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full px-6 py-4 pl-14 bg-transparent text-gray-800 placeholder-gray-500 text-lg font-medium rounded-2xl focus:outline-none"
          />
          
          {/* Search icon */}
          <div className={`
            absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-200
            ${isFocused ? 'text-blue-500' : 'text-gray-400'}
          `}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-5 flex items-center group"
            >
              <div className="p-1 rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors duration-200">
                <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </button>
          )}
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-50 opacity-20 rounded-2xl pointer-events-none"></div>
        </div>
        
        {/* Search suggestions hint */}
        {isFocused && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
            <p className="text-sm text-gray-600 mb-2 font-medium">Search suggestions:</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">First names</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Last names</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Full names</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};