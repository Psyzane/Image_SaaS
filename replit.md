# Image Processing Web Application

## Overview

This is a modern image processing web application built with React and Express that allows users to convert, compress, and resize images entirely in the browser. The application features a client-side image processing engine that maintains user privacy by never uploading images to servers.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 25, 2025)

✓ Enhanced navigation with streamlined links (Features, Contact, Privacy, GitHub)
✓ Improved tab hover states with better transitions and text visibility
✓ Added micro-interactions to features section with staggered animations
✓ Enhanced feature cards with hover effects, scaling, rotation, and animated borders
✓ Added comprehensive Contact and Privacy sections to landing page
✓ Improved footer layout with consolidated navigation links

### Major Codebase Optimization (July 25, 2025)

✓ Removed 170+ unused npm packages (database, auth, form handling, UI components)
✓ Simplified server architecture to use pure Vite development server
✓ Deleted 29 unused UI components (kept only 18 essential ones)
✓ Removed backend infrastructure (routes, storage, database schemas)
✓ Eliminated TanStack Query dependency (client-side processing only)
✓ Reduced codebase from complex full-stack to streamlined frontend-only
✓ Node modules reduced to 201MB with only essential dependencies
✓ Simplified from 70+ files to 40 core files for easier maintenance

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: PostgreSQL session store with connect-pg-simple
- **Module System**: ES Modules throughout the application

### Key Design Decisions

1. **Client-Side Processing**: All image processing happens in the browser using Canvas API and FileReader, ensuring user privacy and eliminating server load for image operations.

2. **Unified Processing Tool**: Merged format conversion and compression into a single, comprehensive image processing tool that handles both operations simultaneously.

3. **Smart Compression**: Implements intelligent compression strategies:
   - JPEG/WebP: Uses quality parameter for lossy compression
   - PNG: Uses dimension reduction for compression when quality is below 90%
   - Automatic format suggestions (JPEG recommended for best compression)

4. **Monorepo Structure**: The application uses a shared folder structure with:
   - `client/` - React frontend
   - `server/` - Express backend
   - `shared/` - Shared TypeScript types and schemas

## Key Components

### Image Processing Engine (`client/src/lib/image-processor.ts`)
- Handles image format detection and conversion
- Manages image loading, resizing, and compression
- Supports JPEG, PNG, WebP, GIF, and BMP formats
- Uses HTML5 Canvas API for all transformations

### File Upload System (`client/src/components/file-upload.tsx`)
- Drag-and-drop interface for file selection
- Client-side file validation
- Progress indicators and error handling
- Integration with toast notifications

### Processing Panel (`client/src/components/processing-panel.tsx`)
- Real-time image processing controls
- Quality adjustment sliders
- Dimension controls with aspect ratio preservation
- Format conversion options
- Live preview functionality

### UI Components
- Modern design system using Radix UI primitives
- Consistent styling with Tailwind CSS
- Responsive design for mobile and desktop
- Dark mode support through CSS variables

## Data Flow

1. **Image Upload**: User selects or drops image files
2. **Client Validation**: File type and size validation on frontend
3. **Image Loading**: FileReader API loads image data
4. **Processing**: Canvas API handles all image transformations
5. **Preview**: Real-time preview updates as user adjusts settings
6. **Download**: Processed images downloaded directly from browser

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Library**: Radix UI components, Lucide React icons
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS, class-variance-authority
- **Utilities**: date-fns, clsx, nanoid

### Backend Dependencies
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Session Management**: express-session, connect-pg-simple
- **Validation**: Zod, drizzle-zod
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Repl.it Integration**: Custom plugins for development environment

## Deployment Strategy

### Development
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Database migrations handled by Drizzle Kit
- Environment variables for database connection

### Production
- Frontend built to static files using Vite
- Backend bundled with esbuild for Node.js deployment
- Static files served by Express in production
- Database provisioned through environment variables

### Environment Configuration
- `NODE_ENV` determines development/production behavior
- `DATABASE_URL` required for PostgreSQL connection
- Vite proxy configuration for API requests in development
- Session configuration with PostgreSQL storage

The application prioritizes user privacy through client-side processing while maintaining a professional, modern interface suitable for both casual users and professionals needing quick image processing capabilities.