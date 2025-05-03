# Insulin Bolus Calculator Architecture

This document outlines the architectural design of the Insulin Bolus Calculator application.

## System Architecture

The application follows a client-server architecture with the following components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │◄───▶│  Express Server │◄───▶│   PostgreSQL    │
│                 │     │                 │     │    Database     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture with context-based state management.

#### Key Components:

1. **Pages**
   - `Calculator.tsx`: Main calculation interface
   - `Settings.tsx`: User preference settings
   - `Details.tsx`: Detailed explanation of calculations

2. **Components**
   - Calculator components: Input forms and result displays
   - Settings components: Form controls for user configuration
   - Details components: Visual explanations and charts
   - UI components: Reusable UI elements from shadcn/ui library

3. **State Management**
   - `CalculatorContext.tsx`: Global state for calculator values and results
   - `ThemeContext.tsx`: Theme management (light/dark mode)
   - React Query: For data fetching and API communication

4. **Utilities**
   - `calculations.ts`: Business logic for insulin calculations
   - `insulinTypes.ts`: Definitions of different insulin profiles
   - `queryClient.ts`: Centralized API request configuration

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── calculator/
│   │   │   ├── settings/
│   │   │   ├── details/
│   │   │   └── ui/
│   │   ├── contexts/
│   │   │   ├── CalculatorContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── calculations.ts
│   │   │   ├── insulinTypes.ts
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── Calculator.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Details.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
```

### Backend Architecture

The backend uses Express.js with a PostgreSQL database accessed through Drizzle ORM.

#### Key Components:

1. **API Routes**
   - User settings management
   - Calculation history storage and retrieval
   - Insulin calculation endpoints

2. **Storage Layer**
   - Database interface through Drizzle ORM
   - CRUD operations for user settings and calculation history

3. **Schema**
   - Shared data models between frontend and backend
   - Type definitions for consistent data validation

```
├── server/
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   └── index.ts
├── shared/
│   └── schema.ts
```

## Data Flow

1. **User Input Flow**
   - User enters data in the calculator interface
   - React state updates via context
   - Calculate button triggers calculation logic
   - Results displayed to user
   - If authenticated, calculation saved to database

2. **Settings Flow**
   - User configures personal settings
   - Settings saved to context and database
   - Settings retrieved on app initialization
   - Settings applied to all calculations

3. **Calculation Retrieval Flow**
   - User navigates to history view
   - Application fetches calculation history from backend
   - Past calculations displayed with ability to view details

## Security Considerations

- User authentication implemented with session-based approach
- Password hashing for secure storage
- Input validation on both client and server side
- PostgreSQL connection security via environment variables

## Deployment Architecture

The application is deployed on Replit with:
- Frontend and backend served from the same domain
- PostgreSQL database provisioned as a service
- Environment variables for secure configuration

## Scaling Considerations

- Database indexes for query performance
- Client-side caching for API responses
- Server-side optimization for calculation logic
- Separation of concerns for maintainability