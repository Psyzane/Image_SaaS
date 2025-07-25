# Image Processing Web Application

## Overview

This is a modern image processing web application built with React and Express that allows users to convert, compress, and resize images entirely in the browser. The application features a client-side image processing engine that maintains user privacy by never uploading images to servers.

## User Preferences

Preferred communication style: Simple, everyday language.

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

2. **Monorepo Structure**: The application uses a shared folder structure with:
   - `client/` - React frontend
   - `server/` - Express backend
   - `shared/` - Shared TypeScript types and schemas

3. **Database Schema**: Simple user management system with PostgreSQL, using Drizzle for type-safe database operations.

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