# Family Tree App

A modern, interactive family tree visualization web application built with React, TypeScript, and ReactFlow. Create, manage, and visualize your family relationships with an intuitive interface and multiple viewing modes.

![Family Tree App](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue) ![Vite](https://img.shields.io/badge/Vite-7.1-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-4.1-teal)

## ✨ Features

### 📊 Multiple Visualization Modes
- **Interactive Tree View**: Drag-and-drop family tree with ReactFlow
- **Timeline View**: Chronological view of family members sorted by birth date
- Smooth switching between visualization modes

### 👥 Comprehensive Person Management
- Add, edit, and delete family members
- Rich profile information including:
  - Basic details (name, birth/death dates)
  - Gender selection with custom icons
  - Photo uploads for visual identification
  - Personal notes and descriptions

### 🔗 Advanced Relationship Mapping
- **Bidirectional Relationships**: Automatically maintains consistency
- **Parent-Child Relationships**: Visual arrows in tree view
- **Spouse Relationships**: Dashed connecting lines
- **Multi-generational Support**: Unlimited family tree depth

### 🔍 Real-time Search & Navigation
- Live search functionality in sidebar
- Quick person lookup by name
- Instant navigation to family members

### 🎨 Modern User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Collapsible Sidebar**: Toggle for better tree viewing
- **Modern Styling**: Tailwind CSS with gradient backgrounds
- **Interactive Elements**: Hover effects and smooth animations

### 💾 Local Data Persistence
- Browser localStorage for offline functionality
- No external database required
- Data persists across sessions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd family-tree-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the application.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:5173/ |
| `npm run build` | Build for production (includes TypeScript check) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Run tests with Vitest |
| `npm run test -- --watch` | Run tests in watch mode |

## 🏗️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.1 for fast development and building
- **Styling**: Tailwind CSS v4 for modern, utility-first styling
- **Tree Visualization**: ReactFlow (@xyflow/react) for interactive diagrams
- **Icons**: Lucide React for consistent iconography
- **Testing**: Vitest with React Testing Library
- **Data Storage**: Browser localStorage (no backend required)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── FamilyTree.tsx   # Interactive tree visualization
│   ├── TimelineView.tsx # Chronological timeline view
│   ├── PersonCard.tsx   # Person display cards
│   ├── PersonForm.tsx   # Add/edit person modal
│   ├── Sidebar.tsx      # Collapsible navigation sidebar
│   ├── SearchBar.tsx    # Real-time search functionality
│   └── RelationshipManager.tsx # Relationship editing modal
├── context/
│   └── FamilyContext.tsx # Global state management
├── types/
│   └── Person.ts        # TypeScript interfaces
├── utils/
│   └── storage.ts       # localStorage utilities
└── App.tsx              # Main application component
```

## 🎯 Key Features Explained

### Interactive Tree Visualization
- Built with ReactFlow for professional diagram rendering
- Automatic layout with generation-based positioning
- Drag-and-drop nodes for custom arrangements
- Zoom controls and fit-to-view functionality
- Custom node and edge styling

### Relationship Management System
- **Bidirectional Updates**: Adding a child automatically updates the parent
- **Relationship Types**: Distinguishes between parent-child and spouse relationships
- **Visual Representation**: Different edge styles for different relationship types
- **Conflict Prevention**: Maintains data consistency across all relationships

### Modal Architecture
- React Portals for proper z-index handling
- Custom event system for cross-component communication
- Escape and overlay-click dismiss functionality
- Mobile-responsive design

### Data Architecture
- **Person Interface**: Comprehensive data model with optional fields
- **UUID Generation**: Unique identifiers for all persons
- **LocalStorage Integration**: Automatic saving and loading
- **Type Safety**: Full TypeScript coverage for data structures

## 🧪 Testing

The project uses Vitest with React Testing Library for comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- src/context/FamilyContext.test.tsx
```

Test coverage includes:
- Component rendering and interactions
- Context provider functionality
- LocalStorage integration
- Relationship management logic

## 🎨 Customization

### Adding New Person Fields
1. Update the `Person` interface in `src/types/Person.ts`
2. Modify `PersonForm.tsx` to include new input fields
3. Update `PersonCard.tsx` to display new information

### Styling Customization
- Tailwind configuration: `tailwind.config.js`
- Global styles: `src/index.css`
- Component-specific styling uses Tailwind utility classes

### New Visualization Modes
- Create new component in `src/components/`
- Add to view mode type in `App.tsx`
- Implement mode switching logic

## 🔧 Development

### Code Quality
- ESLint configuration with React-specific rules
- TypeScript strict mode enabled
- Consistent code formatting

### Architecture Decisions
- **Component-based Architecture**: Modular, reusable components
- **Context for State**: Global state management without external libraries
- **Local-first Data**: No backend dependency for core functionality
- **Mobile-first Design**: Responsive layout principles

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder contains the production build ready for deployment to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 🔮 Future Enhancements

- Export functionality (PDF, image formats)
- Import from GEDCOM files
- Advanced search and filtering
- Relationship statistics and insights
- Collaborative editing features
- Mobile app version (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, TypeScript, and modern web technologies.