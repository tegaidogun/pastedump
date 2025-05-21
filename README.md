# PasteDump

A modern, responsive pastebin clone for sharing code and text snippets.

## Features

- Create and share text/code pastes
- Syntax highlighting for code
- Expiration options (1 hour, 1 day, 1 week)
- View pastes in raw format
- Search for pastes by content, title, or ID
- Character limit of 100KB for pastes
- View count tracking (one increment per session)
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests

The project includes comprehensive API tests. Before running tests, make sure the development server is running:

```bash
# In one terminal window, start the server
npm run dev

# In another terminal window, run the tests
npm test

# Or run tests in watch mode
npm run test:watch
```

## API Endpoints

- `POST /api/pastes` - Create a new paste
- `GET /api/pastes` - Get recent pastes (limited to 5)
- `GET /api/pastes/:id` - Get a paste by ID
- `GET /api/pastes/:id/raw` - Get raw content of a paste
- `GET /api/pastes/search?q=query` - Search for pastes

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable UI components
- `/data` - File-based paste storage
- `/lib` - Utility functions and database operations
- `/public` - Static assets
- `/styles` - Global styles
- `/tests` - API test suite

## Contact

Tega Idogun - [idogunoghenetega@gmail.com](mailto:idogunoghenetega@gmail.com)

GitHub: [tegaidogun](https://github.com/tegaidogun) 