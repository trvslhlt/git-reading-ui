"use client";

import { Author, Book } from "@/lib/types";
import { X, ExternalLink, Globe, BookOpen, Tag } from "lucide-react";

interface DetailPanelProps {
  type: "author" | "book";
  data: Author | Book | null;
  onClose: () => void;
  onSubjectClick?: (subject: string) => void;
}

export default function DetailPanel({ type, data, onClose, onSubjectClick }: DetailPanelProps) {
  if (!data) return null;

  const isAuthor = type === "author";
  const author = isAuthor ? (data as Author) : null;
  const book = !isAuthor ? (data as Book) : null;

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {isAuthor ? author?.name : book?.title}
          </h2>
          {isAuthor && (author?.birthYear || author?.nationality) && (
            <p className="text-sm text-gray-600 mt-1">
              {author?.birthYear && `${author.birthYear}${author.deathYear ? ` - ${author.deathYear}` : ""}`}
              {author?.nationality && ` • ${author.nationality}`}
            </p>
          )}
          {!isAuthor && book?.publicationYear && (
            <p className="text-sm text-gray-600 mt-1">
              Published {book.publicationYear}
              {book.dateRead && ` • Read ${book.dateRead}`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* External Links */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            External Resources
          </h3>
          <div className="flex flex-wrap gap-2">
            {isAuthor && author?.wikipediaUrl && (
              <a
                href={author.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                Wikipedia
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {isAuthor && author?.wikidataId && (
              <a
                href={`https://www.wikidata.org/wiki/${author.wikidataId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                Wikidata
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {isAuthor && author?.viafId && (
              <a
                href={`https://viaf.org/viaf/${author.viafId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                VIAF
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {!isAuthor && book?.openlibraryId && (
              <a
                href={`https://openlibrary.org/works/${book.openlibraryId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Open Library
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {!isAuthor && book?.wikidataId && (
              <a
                href={`https://www.wikidata.org/wiki/${book.wikidataId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                Wikidata
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {!isAuthor && book?.isbn13 && (
              <a
                href={`https://www.google.com/search?q=isbn+${book.isbn13}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Search by ISBN
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Cover Image for Books */}
        {!isAuthor && book?.coverUrl && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Cover
            </h3>
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Biography/Description */}
        {isAuthor && author?.bio && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Biography
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{author.bio}</p>
          </div>
        )}
        {!isAuthor && book?.description && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{book.description}</p>
          </div>
        )}

        {/* Birth/Death Places for Authors */}
        {isAuthor && (author?.birthPlace || author?.deathPlace) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Places
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {author?.birthPlace && (
                <div>
                  <span className="font-medium">Born:</span> {author.birthPlace}
                </div>
              )}
              {author?.deathPlace && (
                <div>
                  <span className="font-medium">Died:</span> {author.deathPlace}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subjects for Books */}
        {!isAuthor && book?.subjects && book.subjects.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Subjects & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {book.subjects.map((subject, idx) => (
                <button
                  key={idx}
                  onClick={() => onSubjectClick?.(subject.name)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                  title={`Click to find books about "${subject.name}"${subject.source ? ` • Source: ${subject.source}` : ""}`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Metadata
          </h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>
              <span className="font-medium">ID:</span>{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{data.id}</code>
            </div>
            {!isAuthor && book?.isbn13 && (
              <div>
                <span className="font-medium">ISBN-13:</span> {book.isbn13}
              </div>
            )}
            {!isAuthor && book?.isbn10 && (
              <div>
                <span className="font-medium">ISBN-10:</span> {book.isbn10}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
