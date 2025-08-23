import React, { useState } from 'react';
import { FamilyProvider } from './context/FamilyContext';
import { FamilyTree } from './components/FamilyTree';
import Sidebar from './components/Sidebar';

const FamilyTreeApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="w-full h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'} h-full`}>
        <FamilyTree />
      </main>
    </div>
  );
};

function App() {
  return (
    <FamilyProvider>
      <FamilyTreeApp />
    </FamilyProvider>
  );
}

export default App;
