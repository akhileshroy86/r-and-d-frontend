# Healthcare Management System - Frontend

A modern healthcare management system built with Next.js, Redux Toolkit, PrimeReact, and PrimeFlex.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Redux Toolkit** - State management
- **PrimeReact** - UI component library
- **PrimeFlex** - CSS utility framework
- **TypeScript** - Type safety
- **Axios** - HTTP client

## Features

### Admin Dashboard 🏥
- Overview statistics and analytics
- User management (doctors, staff, patients)
- System configuration
- Reports and analytics

### Doctor Management 👨‍⚕️
- Doctor profiles and specializations
- Schedule management
- Patient appointments
- Medical records

### Staff Management 👩‍💼
- Staff profiles and roles
- Appointment scheduling
- Queue management
- Patient check-in/out

### Patient Portal 🏥
- Doctor search and booking
- Appointment management
- Medical history
- Profile management
- Reviews and ratings

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── doctor/           # Doctor-specific components
│   ├── staff/            # Staff-specific components
│   ├── patient/          # Patient-specific components
│   ├── common/           # Shared components
│   └── layout/           # Layout components
├── store/                # Redux store
│   └── slices/           # Redux slices
├── services/             # API services
│   └── api/              # API client and services
├── types/                # TypeScript types
│   └── models/           # Data models
├── utils/                # Utility functions
│   └── helpers/          # Helper functions
├── hooks/                # Custom React hooks
│   └── custom/           # Custom hooks
└── styles/               # Global styles
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local` and update the API URL if needed.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Components

### Redux Store
- **authSlice**: Authentication state management
- **doctorSlice**: Doctor data management
- **patientSlice**: Patient data management
- **appointmentSlice**: Appointment management
- **staffSlice**: Staff management

### API Services
- **authService**: Authentication endpoints
- **apiClient**: Configured Axios instance with interceptors

### Custom Hooks
- **useAuth**: Authentication logic and user management

## UI Components (PrimeReact)

The application uses PrimeReact components for a consistent and professional UI:

- **DataTable**: For displaying tabular data
- **Calendar**: Date/time selection
- **Dialog**: Modal dialogs
- **Card**: Content containers
- **Button**: Interactive buttons
- **InputText**: Text inputs
- **Dropdown**: Select dropdowns
- **Chart**: Data visualization
- **Rating**: Star ratings
- **Menubar**: Navigation menu

## Styling (PrimeFlex)

PrimeFlex provides utility classes for:
- **Grid System**: Responsive layouts
- **Flexbox**: Flexible layouts
- **Spacing**: Margins and padding
- **Typography**: Text styling
- **Colors**: Color utilities

## Development Guidelines

1. **Component Structure**: Use functional components with TypeScript
2. **State Management**: Use Redux for global state, local state for component-specific data
3. **API Calls**: Use the configured API client with proper error handling
4. **Styling**: Prefer PrimeFlex utilities over custom CSS
5. **Type Safety**: Define proper TypeScript interfaces for all data structures

## Build and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version

## Contributing

1. Follow the established folder structure
2. Use TypeScript for all new components
3. Implement proper error handling
4. Add appropriate loading states
5. Follow PrimeReact component patterns