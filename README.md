# Git Reading UI

Interactive web interface for exploring author influence networks and book graphs from your reading history.

## Features

- **Author Search** - Search for authors by name with partial matching
- **Graph Visualization** - Interactive force-directed graph using React Flow
- **Author Influence Networks** - Explore who influenced whom with adjustable depth
- **Book Connections** - See books connected to authors in the graph
- **GraphQL Integration** - Powered by the git-reading GraphQL API

## Prerequisites

- Node.js 18+
- npm or yarn
- The git-reading GraphQL API running (see [main repo](../git-reading))

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Start the API**: Make sure the git-reading API is running:
   ```bash
   cd ../git-reading
   make api
   ```

2. **Search for Authors**: Type an author name in the search box and press Enter

3. **Explore the Graph**: Click on an author to view their influence network

4. **Adjust Depth**: Use the depth buttons (1-3) to explore deeper connections

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Apollo Client** - GraphQL client
- **React Flow** - Graph visualization
- **@xyflow/react** - Modern flow-based UI components

## Project Structure

```
git-reading-ui/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with Apollo Provider
│   └── page.tsx           # Main author graph page
├── components/            # React components
│   └── AuthorGraph.tsx    # Graph visualization component
├── lib/                   # Utilities and configurations
│   ├── apollo-client.ts   # Apollo Client setup
│   ├── apollo-provider.tsx # Apollo Provider wrapper
│   ├── graphql-queries.ts # GraphQL query definitions
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Environment Variables

Create a `.env.local` file (copy from `.env.local.example`):

```env
NEXT_PUBLIC_GRAPHQL_API_URL=http://localhost:8000/graphql
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Type check
npm run build

# Lint
npm run lint
```

## GraphQL Queries

The app uses these main queries:

- `searchAuthors(query: String!)` - Search authors by name
- `author(id: ID!)` - Get author details
- `authorGraph(authorId: ID!, depth: Int!)` - Get author influence graph
- `book(id: ID!)` - Get book details

See [lib/graphql-queries.ts](lib/graphql-queries.ts) for full schema.

## Graph Visualization

The graph uses React Flow with custom styling:

- **Blue nodes**: Authors
- **Yellow nodes**: Books
- **Gray edges**: "wrote" relationships
- **Red animated edges**: "influenced" relationships

Nodes are arranged using a circular layout for authors with books positioned around them.

## Troubleshooting

### API Connection Errors

If you see connection errors:
1. Verify the API is running at `http://localhost:8000/graphql`
2. Check the `NEXT_PUBLIC_GRAPHQL_API_URL` in `.env.local`
3. Ensure the API has enriched author data with influences

### No Authors Found

If searches return no results:
1. Check that you've loaded data into the git-reading database
2. Verify author enrichment has run (`make run-enrich ARGS='--sources wikidata --entity-type authors'`)
3. Try searching for known authors in your database

### Graph Not Loading

If the graph doesn't appear:
1. Check browser console for errors
2. Verify the selected author has influence data
3. Try reducing the depth to 1

## License

Same license as the main git-reading project.
