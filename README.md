# Rental Frontend

This is the frontend for the rental application, built with **Next.js** and styled using **Tailwind CSS**. It provides a user-friendly interface for browsing rental listings, filtering results, and viewing detailed information about properties. The backend for this project is available at [PoliHouseScraper](https://github.com/tommasopau/poliHouseScraper).

## Features

- **Home Page**: Displays the latest rental listings.
- **Search Page**: Advanced search functionality with filters for location, property type, price range, and more.
- **Infinite Scrolling**: Automatically loads more results as you scroll.
- **Rental Details Modal**: View detailed information about a rental property.
- **Health Status**: Displays the health status of the backend API.

## Project Structure

```
.
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout for the application
│   ├── page.tsx            # Home page
│   └── search/             # Search page
│       ├── loading.tsx     # Loading state for the search page
│       └── page.tsx        # Search page implementation
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and API integration
├── public/                 # Static assets
├── styles/                 # Additional styles
├── .next/                  # Next.js build output
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Prerequisites

- **Node.js**: Version 16 or higher.
- **pnpm**: Package manager for installing dependencies.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/rental-frontend.git
   cd rental-frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the backend by following the instructions in the [PoliHouseScraper](https://github.com/tommasopau/poliHouseScraper) repository.

4. Create a `.env.local` file in the root directory and configure the API base URL:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

## Development

To start the development server, run:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Build

To build the project for production, run:

```bash
pnpm build
```

The optimized build will be output to the `.next/` directory.

## Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the project for production.
- `pnpm start`: Start the production server.
- `pnpm lint`: Run linting checks.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TypeScript**: Static type checking.
- **Radix UI**: Accessible UI primitives.
- **Lucide Icons**: Icon library for React.

## Backend

The backend for this project is available at [PoliHouseScraper](https://github.com/tommasopau/poliHouseScraper). It provides the API endpoints for fetching rental data.
