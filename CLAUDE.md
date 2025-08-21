# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server on http://localhost:5173/
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Architecture

This is a React TypeScript family tree web application built with Vite. The app helps users manage family relationships and visualize them in both grid and tree formats.

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Tree Visualization**: ReactFlow
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

#### Main App
- `src/App.tsx` - Main application component with view switching (grid/tree)

### Key Features

1. **Person Management**: Add, edit, delete family members with basic info
2. **Relationship Mapping**: Define parent-child, spouse, sibling relationships
3. **Dual Views**: Switch between grid view (cards) and interactive tree visualization
4. **Real-time Search**: Search people by name with live results
5. **Local Storage**: All data persists in browser localStorage

### Data Structure

Each person has:
- Basic info: firstName, lastName, birthDate, deathDate, notes
- Relationship arrays: parentIds, spouseIds, childrenIds
- Relationships are bidirectional and automatically maintained

### Mobile-Ready Design

Built with mobile-first approach using Tailwind CSS. Future iPhone app conversion considerations:
- React Native compatible component patterns
- Tailwind-style utility classes
- Local-first data architecture

### Usage Notes

- Data is stored locally in browser localStorage
- Relationships are automatically bidirectional (adding parent also adds child relationship)
- Tree view shows generations vertically with smart positioning
- Search works on first and last names
- All forms have basic validation