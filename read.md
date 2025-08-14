# Overview

FinanceAI is a modern, AI-powered personal finance management application built as a full-stack web application. The system provides intelligent transaction categorization, budget tracking, spending analytics, and financial health insights. It features a React-based frontend with a clean, responsive UI built using shadcn/ui components and Tailwind CSS, paired with an Express.js backend that serves both API endpoints and static assets.

The application emphasizes user experience with automated transaction categorization using machine learning-like keyword matching, real-time financial health scoring, and comprehensive spending analytics. The system is designed to help users understand their financial patterns and make informed decisions about their spending habits.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side application is built with React and TypeScript, utilizing a component-based architecture with clear separation of concerns:

- **UI Framework**: React with TypeScript for type safety and better developer experience
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Charts & Visualization**: Recharts for financial data visualization

The frontend follows a modular structure with dedicated directories for components (UI, dashboard, layout, transactions), pages, hooks, and utilities. The application uses a responsive design that adapts to both desktop and mobile viewports with a collapsible sidebar on desktop and bottom navigation on mobile.

## Backend Architecture

The server-side is built with Express.js and follows a clean API architecture:

- **Framework**: Express.js with TypeScript for the REST API
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Data Storage**: Abstracted storage interface allowing for both in-memory (development) and database persistence
- **Development Setup**: Vite integration for hot module replacement and development server
- **API Design**: RESTful endpoints for transactions, budgets, categories, and analytics

The backend implements a storage abstraction pattern that allows switching between in-memory storage (for development/testing) and persistent database storage without changing the business logic.

## Database Design

The application uses PostgreSQL with Drizzle ORM and follows a normalized schema design:

- **Transactions Table**: Stores financial transactions with amount, description, category, type (income/expense), date, and auto-categorization flags
- **Budgets Table**: Monthly budget limits per category with spent amount tracking
- **Categories Table**: Predefined expense categories with icons and colors for UI representation
- **Schema Validation**: Zod schemas for runtime type checking and data validation

The database configuration supports UUID primary keys and timestamp tracking for audit purposes.

## Machine Learning Integration

The application includes a simplified ML-like categorization system:

- **Keyword-Based Classification**: Transactions are automatically categorized based on description matching against predefined keyword sets
- **Category Prediction**: New transactions without explicit categories are automatically classified
- **Learning Intent**: The system is designed to be extensible for future integration with more sophisticated ML models

## Authentication & Security

While authentication is not fully implemented in the current codebase, the architecture includes:

- **Session Management**: Connection to PostgreSQL session storage is configured
- **CORS Configuration**: Express server is set up to handle cross-origin requests appropriately
- **Input Validation**: All API endpoints use Zod schemas for request validation

## Development & Build Process

The application uses a modern development workflow:

- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript Configuration**: Strict type checking with path mapping for clean imports
- **Development Server**: Integrated development experience with hot reloading
- **Production Build**: Separate client and server build processes with optimized asset bundling

The development setup includes error overlays, source mapping, and development-specific tooling for an enhanced developer experience.

# External Dependencies

## Core Framework Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL dialect
- **express**: Web application framework for the backend API server
- **react**: Frontend UI library with TypeScript support
- **@tanstack/react-query**: Server state management and caching for the frontend

## UI & Styling Libraries

- **@radix-ui/react-***: Comprehensive set of accessible, unstyled UI primitives (accordion, dialog, dropdown, form controls, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating type-safe component variants
- **clsx**: Utility for conditional CSS class names
- **lucide-react**: Icon library for consistent iconography

## Form & Validation

- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Integration between React Hook Form and validation libraries
- **zod**: TypeScript-first schema validation for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation

## Data Visualization

- **recharts**: React charting library for financial data visualization
- **embla-carousel-react**: Carousel component for responsive layouts

## Development Tools

- **vite**: Fast build tool and development server
- **typescript**: Static type checking for JavaScript
- **esbuild**: Fast JavaScript bundler for production builds

## Additional Utilities

- **date-fns**: Date manipulation and formatting utilities
- **wouter**: Lightweight router for single-page applications
- **cmdk**: Command palette component for improved user experience
- **nanoid**: URL-safe unique string ID generator