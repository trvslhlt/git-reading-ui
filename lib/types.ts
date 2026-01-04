export interface Author {
  id: string;
  name: string;
  birthYear?: number;
  deathYear?: number;
  birthPlace?: string;
  nationality?: string;
  biography?: string;
  wikidataId?: string;
  wikipediaUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  publicationYear?: number;
  isbn13?: string;
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
