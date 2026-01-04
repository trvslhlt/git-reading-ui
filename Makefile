.PHONY: help install dev build start lint format clean test

# Default target
help:
	@echo "Git Reading UI - Available Commands"
	@echo ""
	@echo "Setup:"
	@echo "  make install       Install dependencies"
	@echo "  make setup         Install + create .env.local from template"
	@echo ""
	@echo "Development:"
	@echo "  make dev           Start development server (with auto-open)"
	@echo "  make run-dev       Start development server (no auto-open)"
	@echo "  make build         Build production bundle"
	@echo "  make start         Start production server"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          Run ESLint"
	@echo "  make lint-fix      Run ESLint with auto-fix"
	@echo "  make format        Format code with Prettier (if installed)"
	@echo "  make typecheck     Run TypeScript type checking"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         Remove build artifacts and dependencies"
	@echo "  make clean-cache   Clear Next.js cache"
	@echo ""

# Setup
install:
	@echo "Installing dependencies..."
	npm install --legacy-peer-deps

setup: install
	@echo "Setting up environment..."
	@if [ ! -f .env.local ]; then \
		cp .env.local.example .env.local; \
		echo "✓ Created .env.local from template"; \
	else \
		echo "✓ .env.local already exists"; \
	fi
	@echo ""
	@echo "Setup complete! Run 'make dev' to start the development server."

# Development
dev: setup
	@echo "Starting development server..."
	@echo "  UI: http://localhost:3000"
	@echo ""
	@echo "Note: Make sure the GraphQL API is running at http://localhost:8000/graphql"
	@echo "      Run 'make api' in the git-reading repository"
	@echo ""
	@(sleep 2 && python3 -m webbrowser http://localhost:3000) &
	npm run dev

run-dev:
	@echo "Starting development server..."
	npm run dev

build:
	@echo "Building production bundle..."
	npm run build

start:
	@echo "Starting production server..."
	npm run start

# Code Quality
lint:
	@echo "Running ESLint..."
	npm run lint

lint-fix:
	@echo "Running ESLint with auto-fix..."
	npm run lint -- --fix

format:
	@echo "Formatting code with Prettier..."
	@if command -v npx >/dev/null 2>&1; then \
		npx prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"; \
	else \
		echo "Error: npx not found. Install Node.js/npm first."; \
		exit 1; \
	fi

typecheck:
	@echo "Running TypeScript type check..."
	npx tsc --noEmit

# Utilities
clean:
	@echo "Removing build artifacts and dependencies..."
	rm -rf .next
	rm -rf node_modules
	rm -rf out
	@echo "✓ Clean complete"

clean-cache:
	@echo "Clearing Next.js cache..."
	rm -rf .next/cache
	@echo "✓ Cache cleared"
