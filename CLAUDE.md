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
- **Test Runner**: Vitest with jsdom environment
- **Testing Library**: React Testing Library with Jest DOM matchers
- Tests are located alongside components (e.g., `FamilyContext.test.tsx`)
- Tests mock localStorage via `storage.ts` utilities and ReactFlow components for DOM rendering
- Focus on relationship management and graph visualization functionality

## Project Architecture

This is a React TypeScript family tree web application built with Vite. The app helps users manage family relationships and visualize them in both grid and tree formats.

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

#### Layout & Navigation
- `src/App.tsx` - Main application component with sidebar and tree view
- `src/components/Sidebar.tsx` - Collapsible sidebar with person management and search

### Key Features

1. **Person Management**: Add, edit, delete family members with detailed info including gender and photos
2. **Relationship Mapping**: Define parent-child, spouse relationships with automatic bidirectional updates
3. **Interactive Tree Visualization**: Single tree view with ReactFlow for drag-and-drop interaction
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

### Usage Notes

- Data is stored locally in browser localStorage via `src/utils/storage.ts`
- Relationships are automatically bidirectional (adding parent also adds child relationship)
- Tree view uses ReactFlow with custom nodes and edges
- Search works on first and last names with live filtering
- All forms have basic validation
- Global state managed through React Context (`src/context/FamilyContext.tsx`)
- Custom events used for cross-component communication (e.g., 'manageRelationships')

### Important Files

- `src/types/Person.ts` - Core data types and interfaces
- `src/utils/storage.ts` - LocalStorage utilities and ID generation
- `src/context/FamilyContext.tsx` - Global state management with CRUD operations