# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:5173/
- `npm run build` - Build the application for production (runs TypeScript check first)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally
- `npm run test` - Run all tests with Vitest
- `npm run test -- --watch` - Run tests in watch mode
- `npm run test -- src/context/FamilyContext.test.tsx` - Run specific test file

## Code Quality & Testing

Always run `npm run lint` after making changes to ensure code quality. The project uses ESLint with React-specific rules.

### Testing Framework
- **Test Runner**: Vitest with jsdom environment, globals enabled
- **Testing Library**: React Testing Library with Jest DOM matchers
- Tests are located alongside components (e.g., `FamilyContext.test.tsx`)
- Tests mock localStorage via `storage.ts` utilities and ReactFlow components for DOM rendering
- Focus on relationship management and graph visualization functionality
- Use `vi.mock()` for mocking external dependencies

## Project Architecture

This is a React TypeScript family tree web application built with Vite. The app helps users manage family relationships and visualize them in tree and timeline formats.

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 
- **Tree Visualization**: ReactFlow (@xyflow/react)
- **Icons**: Lucide React
- **Data Storage**: Local Storage (browser)

### Core Architecture

#### Data Layer
- `src/types/Person.ts` - Person interface and relationship types
- `src/utils/storage.ts` - LocalStorage utilities for data persistence
- `src/context/FamilyContext.tsx` - React Context for global state management

#### Components
- `src/components/PersonForm.tsx` - Add/edit person modal form
- `src/components/PersonCard.tsx` - Individual person display card
- `src/components/SearchBar.tsx` - Real-time search functionality
- `src/components/RelationshipManager.tsx` - Modal for managing family relationships
- `src/components/FamilyTree.tsx` - Interactive tree visualization using ReactFlow
- `src/components/TimelineView.tsx` - Chronological timeline view of family members

#### Layout & Navigation
- `src/App.tsx` - Main application component with sidebar and view mode switching (tree/timeline)
- `src/components/Sidebar.tsx` - Collapsible sidebar with person management and search

### Key Features

1. **Person Management**: Add, edit, delete family members with detailed info including gender and photos
2. **Relationship Mapping**: Define parent-child, spouse relationships with automatic bidirectional updates
3. **Multiple Visualization Modes**: Interactive tree view with ReactFlow and chronological timeline view
4. **Real-time Search**: Search people by name with live results in sidebar
5. **Collapsible Sidebar**: Toggle sidebar visibility for better tree viewing experience
6. **Local Storage**: All data persists in browser localStorage

### Data Structure

Each person has:
- Basic info: firstName, lastName, gender (optional), birthDate, deathDate, photo (optional), notes
- Relationship arrays: parentIds, spouseIds, childrenIds
- Unique ID generated automatically
- Relationships are bidirectional and automatically maintained

### Mobile-Ready Design

Built with mobile-first approach using Tailwind CSS. Future iPhone app conversion considerations:
- React Native compatible component patterns
- Tailwind-style utility classes
- Local-first data architecture

### Modal System Architecture

The application uses React Portals for proper modal rendering to avoid z-index and stacking context issues:

- **RelationshipManager**: Rendered via `createPortal(modalContent, document.body)` to escape parent containers
- **Modal Triggers**: Custom events (`editPerson`, `manageRelationships`) for cross-component communication
- **State Management**: Modal state handled in both App.tsx and Sidebar.tsx components
- **Z-Index Hierarchy**: Sidebar (z-40), modals (z-50), toggle buttons (z-50)

### Sidebar Implementation

The collapsible sidebar uses CSS transforms for smooth animations:
- **Collapsed State**: `translate-x-full` (slides off-screen left)
- **Expanded State**: `translate-x-0` (normal position)  
- **Fixed Width**: Always `w-80` (20rem), animates via transform, not width
- **Content Layout**: Main content uses `ml-80` margin when sidebar is open

### Tree Visualization Logic

The FamilyTree component handles both connected and unconnected family members:
- **Connected Relationships**: Uses generation calculation and bidirectional traversal
- **Unconnected People**: Added to generation 0 to ensure all people appear in tree
- **ReactFlow Integration**: Custom nodes, edges, and positioning with drag-and-drop support
- **Node Creation**: Iterates through all people in generations map, not just visited nodes

### Data Persistence & State

- **Local Storage**: All data persists in browser localStorage via `src/utils/storage.ts`
- **Bidirectional Relationships**: Adding parent automatically adds child relationship and vice versa
- **Context Provider**: Global state managed through React Context (`src/context/FamilyContext.tsx`)
- **Relationship Types**: parent-child (solid blue arrows), spouse (dashed pink lines)

### Important Files

- `src/types/Person.ts` - Core data types and interfaces
- `src/utils/storage.ts` - LocalStorage utilities and ID generation  
- `src/context/FamilyContext.tsx` - Global state management with CRUD operations
- `src/components/FamilyTree.tsx` - Tree visualization logic and ReactFlow integration
- `src/components/RelationshipManager.tsx` - Portal-based modal for relationship management