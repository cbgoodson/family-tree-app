import React, { useState } from 'react';
import { FamilyProvider } from './context/FamilyContext';
import FamilyTree from './components/FamilyTree';
import Sidebar from './components/Sidebar';
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return <FamilyProvider>
      <div className="flex w-full h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <FamilyTree />
        </main>
      </div>
    </FamilyProvider>;
}