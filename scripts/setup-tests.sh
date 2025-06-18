#!/bin/bash

echo "🧪 Setting up test environment..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Install testing dependencies if not already installed
echo "🔧 Installing testing dependencies..."
pnpm add -D jest @types/jest ts-jest @testing-library/jest-dom @testing-library/react

# Run type check
echo "🔍 Running type check..."
pnpm typecheck

# Run linting
echo "🧹 Running linter..."
pnpm lint

# Run unit tests
echo "⚡ Running unit tests..."
pnpm test tests/unit/

# Run component tests
echo "🎨 Running component tests..."
pnpm test tests/components/

echo "✅ Test setup complete!"
echo ""
echo "Available test commands:"
echo "  pnpm test              - Run all tests"
echo "  pnpm test:watch        - Run tests in watch mode"
echo "  pnpm test:coverage     - Run tests with coverage"
echo "  pnpm test:parser       - Run manual parser test"
echo ""
echo "To run integration tests (real API calls):"
echo "  pnpm test tests/integration/" 