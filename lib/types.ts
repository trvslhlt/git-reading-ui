export interface Subject {
  name: string;
  source?: string;
}

export interface Author {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  deathPlace?: string;
  nationality?: string;
  bio?: string;
  wikidataId?: string;
  viafId?: string;
  wikipediaUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  publicationYear?: number;
  dateRead?: string;
  isbn13?: string;
  isbn10?: string;
  openlibraryId?: string;
  wikidataId?: string;
  description?: string;
  coverUrl?: string;
  subjects?: Subject[];
}

export interface GraphNode {
  id: string;
  type: "AUTHOR" | "BOOK";
  label: string;
  metadata?: {
    birthYear?: number;
    deathYear?: number;
    publicationYear?: number;
    [key: string]: any;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  type: "WROTE" | "INFLUENCED";
}

export interface AuthorGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
