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
      firstName
      lastName
      birthYear
      deathYear
      birthPlace
      deathPlace
      nationality
      bio
      wikidataId
      viafId
      wikipediaUrl
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
      dateRead
      isbn13
      isbn10
      openlibraryId
      wikidataId
      description
      coverUrl
      subjects {
        name
        source
      }
    }
  }
`;

export const SEARCH_BOOKS_BY_SUBJECT = gql`
  query SearchBooksBySubject($subject: String!) {
    searchBooksBySubject(subject: $subject) {
      id
      title
      publicationYear
      subjects {
        name
      }
    }
  }
`;
