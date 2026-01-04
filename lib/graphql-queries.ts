import { gql } from "@apollo/client";

export const SEARCH_AUTHORS = gql`
  query SearchAuthors($query: String!) {
    searchAuthors(query: $query) {
      id
      name
      birthYear
      deathYear
      birthPlace
      nationality
      wikidataId
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($id: String!) {
    author(id: $id) {
      id
      name
      birthYear
      deathYear
      birthPlace
      nationality
      bio
      wikidataId
      viafId
    }
  }
`;

export const GET_AUTHOR_GRAPH = gql`
  query GetAuthorGraph($authorId: String!, $depth: Int!) {
    authorGraph(authorId: $authorId, depth: $depth) {
      nodes {
        id
        type
        label
        metadata {
          birthYear
          deathYear
          publicationYear
        }
      }
      edges {
        source
        target
        type
      }
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: String!) {
    book(id: $id) {
      id
      title
      publicationYear
      isbn13
    }
  }
`;
