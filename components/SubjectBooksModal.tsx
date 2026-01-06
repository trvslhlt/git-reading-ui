"use client";

import { Book } from "@/lib/types";
import { X, BookOpen, Calendar } from "lucide-react";

interface SubjectBooksModalProps {
  subject: string;
  books: Book[];
  onClose: () => void;
  onBookClick: (bookId: string) => void;
}

export default function SubjectBooksModal({
  subject,
  books,
  onClose,
  onBookClick,
}: SubjectBooksModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Books about "{subject}"
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {books.length} {books.length === 1 ? "book" : "books"} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Book List */}
        <div className="flex-1 overflow-y-auto p-6">
          {books.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No books found with this subject.
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    onBookClick(book.id);
                    onClose();
                  }}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Cover placeholder or actual cover */}
                    <div className="flex-shrink-0 w-16 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>

                    {/* Book info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {book.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {book.publicationYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {book.publicationYear}
                          </div>
                        )}
                        {book.dateRead && (
                          <div className="text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            Read {book.dateRead}
                          </div>
                        )}
                      </div>
                      {/* Show other subjects */}
                      {book.subjects && book.subjects.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {book.subjects.slice(0, 5).map((s, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                s.name.toLowerCase().includes(subject.toLowerCase())
                                  ? "bg-indigo-100 text-indigo-700 font-medium"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {s.name}
                            </span>
                          ))}
                          {book.subjects.length > 5 && (
                            <span className="text-xs text-gray-500">
                              +{book.subjects.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
