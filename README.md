# Vue Task

A modern Vue.js 3 application built with TypeScript, Vite, and Pinia. This project follows best practices for component architecture, state management, and API integration.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type safety and enhanced developer experience
- **Vite** - Next-generation frontend build tool
- **Pinia** - State management library for Vue
- **Vue Router** - Official router for Vue.js
- **Jest** - JavaScript testing framework
- **Axios** - Promise-based HTTP client

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Project Structure

```
src/
├── api/                    # API service layer
│   ├── client.ts          # Axios instance configuration
│   ├── types.ts           # Global API types
│   ├── index.ts           # API helpers and exports
│   └── entities/          # Entity-specific API functions
│       ├── tasks/         # Tasks API
│       │   ├── types.ts   # Task type definitions
│       │   ├── consts.ts  # API endpoint URLs
│       │   └── index.ts   # Task API functions
│       └── users/         # Users API
│           ├── types.ts
│           ├── consts.ts
│           └── index.ts
├── components/            # Global components (if any)
├── containers/            # Page containers (business logic)
│   ├── home/
│   ├── about/
│   └── contact/
├── pages/                 # Route pages (thin wrappers)
│   ├── Home.vue
│   ├── About.vue
│   └── Contact.vue
├── router/                # Vue Router configuration
│   └── index.ts
├── shared/                # Shared code
│   ├── components/       # Reusable components
│   │   └── atoms/        # Atomic Design: atoms
│   │       ├── text/     # Text component
│   │       └── heading/ # Heading component
│   └── composables/      # Shared composables
│       └── use-on-click-outside/
├── stores/                # Pinia stores
│   ├── counter/
│   │   ├── types.ts
│   │   └── index.ts
│   └── index.ts
├── App.vue                # Root component
├── main.ts                # Application entry point
└── styles.scss            # Global styles
```

## Architecture Patterns

### Component Architecture

The project follows **Atomic Design** principles:

- **Atoms** - Basic building blocks (e.g., `Text`, `Heading`)
- **Molecules** - Simple component combinations
- **Organisms** - Complex UI components

Each component follows a consistent structure:

- `{ComponentName}.vue` - Main component file
- `{ComponentName}.test.ts` - Test file (required for shared components)
- `types.ts` - TypeScript type definitions
- `utils.ts` - Utility functions (if needed)
- `styles.scss` - Component-specific styles
- `index.ts` - Component exports

### Pages and Containers Pattern

- **Pages** (`src/pages/`) - Thin wrappers that import containers
- **Containers** (`src/containers/`) - Hold business logic and templates

This separation allows for:

- Clean routing configuration
- Reusable container logic
- Better code organization

### State Management

Pinia stores are organized by entity:

- Each store has its own folder
- `types.ts` - Store type definitions
- `index.ts` - Store implementation using Setup Store pattern

### API Service Layer

API functions are organized by entity:

- `types.ts` - Entity type definitions
- `consts.ts` - API endpoint URLs
- `index.ts` - API functions

All API calls go through a centralized Axios instance with interceptors for error handling and request/response transformation.

### Composables

Shared composables follow a consistent structure:

- `index.ts` - Main composable logic
- `types.ts` - TypeScript type definitions
- `utils.ts` - Utility functions (if needed)
- `index.test.ts` - Test file (required for shared composables)

## Development Guidelines

This project follows strict development guidelines defined in `.cursor/rules/`:

- **Components** (`components.mdc`) - Component structure, styling, and testing requirements
- **State Management** (`state-management.mdc`) - Pinia store patterns and best practices
- **API Service** (`api.mdc`) - API structure and entity organization
- **Composables** (`composables.mdc`) - Composable structure and implementation patterns
- **Routing** (`routing.mdc`) - Router configuration and page/container patterns

## Key Features

- ✅ TypeScript for type safety
- ✅ Component-based architecture
- ✅ State management with Pinia
- ✅ API service layer with Axios
- ✅ Routing with Vue Router
- ✅ Comprehensive test coverage with Jest
- ✅ Reusable composables
- ✅ Consistent code organization

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.example.com
```

## Scripts Reference

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Build for production     |
| `npm run preview`       | Preview production build |
| `npm test`              | Run tests                |
| `npm run test:watch`    | Run tests in watch mode  |
| `npm run test:coverage` | Run tests with coverage  |

## Contributing

When contributing to this project, please follow the guidelines in `.cursor/rules/`:

1. Follow the component structure patterns
2. Write tests for shared components and composables
3. Use TypeScript types consistently
4. Follow the API service patterns
5. Maintain consistent code style

## License

MIT
