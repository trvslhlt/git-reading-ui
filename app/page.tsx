"use client";

import { useState } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { GET_AUTHOR_GRAPH, SEARCH_AUTHORS, GET_AUTHOR, GET_BOOK, SEARCH_BOOKS_BY_SUBJECT } from "@/lib/graphql-queries";
import { AuthorGraph as AuthorGraphType, Author, Book } from "@/lib/types";
import AuthorGraph from "@/components/AuthorGraph";
import DetailPanel from "@/components/DetailPanel";
import SubjectBooksModal from "@/components/SubjectBooksModal";

// Create a client instance for manual queries
const createClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:8000/graphql",
    }),
  });
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [depth, setDepth] = useState(1);
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [graphData, setGraphData] = useState<AuthorGraphType | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [detailPanel, setDetailPanel] = useState<{
    type: "author" | "book";
    data: Author | Book | null;
  } | null>(null);
  const [subjectModal, setSubjectModal] = useState<{
    subject: string;
    books: Book[];
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const client = createClient();
      const { data } = await client.query({
        query: SEARCH_AUTHORS,
        variables: { query: searchQuery },
      });
      setSearchResults((data as any).searchAuthors || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAuthorSelect = async (author: Author) => {
    setSelectedAuthor(author);
    setGraphLoading(true);
    setGraphError(null);

    try {
      const client = createClient();
      const { data } = await client.query({
        query: GET_AUTHOR_GRAPH,
        variables: { authorId: author.id, depth },
      });
      setGraphData((data as any).authorGraph);
    } catch (error: any) {
      console.error("Graph error:", error);
      setGraphError(error.message || "Failed to load graph");
      setGraphData(null);
    } finally {
      setGraphLoading(false);
    }
  };

  const handleDepthChange = async (newDepth: number) => {
    setDepth(newDepth);
    if (!selectedAuthor) return;

    setGraphLoading(true);
    setGraphError(null);

    try {
      const client = createClient();
      const { data } = await client.query({
        query: GET_AUTHOR_GRAPH,
        variables: { authorId: selectedAuthor.id, depth: newDepth },
      });
      setGraphData((data as any).authorGraph);
    } catch (error: any) {
      console.error("Graph error:", error);
      setGraphError(error.message || "Failed to load graph");
      setGraphData(null);
    } finally {
      setGraphLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Git Reading - Author Graph Explorer
        </h1>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for an author..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-gray-700">Results:</h3>
              {searchResults.map((author) => (
                <button
                  key={author.id}
                  onClick={() => handleAuthorSelect(author)}
                  className="w-full text-left p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium">{author.name}</div>
                  {(author.birthYear || author.nationality) && (
                    <div className="text-sm text-gray-600">
                      {author.birthYear && `${author.birthYear}${author.deathYear ? ` - ${author.deathYear}` : ""}`}
                      {author.nationality && ` • ${author.nationality}`}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchQuery && !searchLoading && (
            <div className="mt-4 text-gray-600">No authors found.</div>
          )}
        </div>

        {/* Selected Author & Controls */}
        {selectedAuthor && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedAuthor.name}
                </h2>
                {(selectedAuthor.birthYear || selectedAuthor.nationality) && (
                  <p className="text-gray-600 mt-1">
                    {selectedAuthor.birthYear && `${selectedAuthor.birthYear}${selectedAuthor.deathYear ? ` - ${selectedAuthor.deathYear}` : ""}`}
                    {selectedAuthor.nationality && ` • ${selectedAuthor.nationality}`}
                    {selectedAuthor.birthPlace && ` • ${selectedAuthor.birthPlace}`}
                  </p>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-700">
                  Graph Depth:
                </label>
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDepthChange(d)}
                    className={`px-3 py-1 rounded ${
                      depth === d
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Graph Visualization */}
        {graphLoading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-600">Loading graph...</div>
          </div>
        )}

        {graphError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-800 mb-2">Error loading graph</h3>
            <p className="text-red-600">{graphError}</p>
          </div>
        )}

        {graphData && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Author Influence Network
              </h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded"></div>
                  <span>Author</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-600 rounded"></div>
                  <span>Book</span>
                </div>
              </div>
            </div>
            <AuthorGraph
              data={graphData}
              onNodeClick={async (nodeId, nodeType) => {
                const client = createClient();
                try {
                  if (nodeType === "author") {
                    const { data } = await client.query({
                      query: GET_AUTHOR,
                      variables: { id: nodeId },
                    });
                    setDetailPanel({
                      type: "author",
                      data: (data as any).author,
                    });
                  } else if (nodeType === "book") {
                    const { data } = await client.query({
                      query: GET_BOOK,
                      variables: { id: nodeId },
                    });
                    setDetailPanel({
                      type: "book",
                      data: (data as any).book,
                    });
                  }
                } catch (error) {
                  console.error("Error fetching node details:", error);
                }
              }}
            />
          </div>
        )}

        {/* Instructions */}
        {!selectedAuthor && searchResults.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Make sure the GraphQL API is running (make api in git-reading)</li>
              <li>Search for an author by name</li>
              <li>Click on an author to view their influence network</li>
              <li>Adjust the graph depth to explore deeper connections</li>
            </ol>
          </div>
        )}

        {/* Detail Panel */}
        {detailPanel && (
          <DetailPanel
            type={detailPanel.type}
            data={detailPanel.data}
            onClose={() => setDetailPanel(null)}
            onSubjectClick={async (subject) => {
              const client = createClient();
              try {
                const { data } = await client.query({
                  query: SEARCH_BOOKS_BY_SUBJECT,
                  variables: { subject },
                });
                setSubjectModal({
                  subject,
                  books: (data as any).searchBooksBySubject || [],
                });
              } catch (error) {
                console.error("Error searching books by subject:", error);
              }
            }}
          />
        )}

        {/* Subject Books Modal */}
        {subjectModal && (
          <SubjectBooksModal
            subject={subjectModal.subject}
            books={subjectModal.books}
            onClose={() => setSubjectModal(null)}
            onBookClick={async (bookId) => {
              const client = createClient();
              try {
                const { data } = await client.query({
                  query: GET_BOOK,
                  variables: { id: bookId },
                });
                setDetailPanel({
                  type: "book",
                  data: (data as any).book,
                });
              } catch (error) {
                console.error("Error fetching book details:", error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
