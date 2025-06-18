# Tests

This folder contains all the tests for the project, organized by type and functionality.

## Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── provider/           # Parser and provider tests
│   └── utils.test.ts       # Utility function tests
├── integration/            # Integration tests (real API calls)
│   └── parser-integration.test.ts
├── components/             # Component tests
│   └── Button.test.tsx
├── setup.ts               # Jest setup file
└── README.md              # This file
```

## Running Tests

### Install Dependencies
First, install the testing dependencies:
```bash
pnpm install
```

### Run All Tests
```bash
pnpm test
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

### Run Specific Test Files
```bash
# Run only unit tests
pnpm test tests/unit/

# Run only integration tests
pnpm test tests/integration/

# Run specific test file
pnpm test tests/unit/provider/CuuTruyenParser.test.ts
```

### Run Manual Parser Test
```bash
pnpm test:parser
```

## Test Types

### Unit Tests (`tests/unit/`)
- **Provider Tests**: Test the `CuuTruyenParser` class with mocked HTTP requests
- **Utils Tests**: Test utility functions like `cn()` for class name merging

### Integration Tests (`tests/integration/`)
- **Real API Tests**: Test the parser against the actual CuuTruyen API
- **Error Handling**: Test how the parser handles various error conditions
- **Performance**: Test with real network requests (longer timeouts)

### Component Tests (`tests/components/`)
- **UI Component Tests**: Test React components using React Testing Library
- **User Interactions**: Test button clicks, form submissions, etc.

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses `ts-jest` for TypeScript support
- Collects coverage from `src/**/*.ts` files
- Generates coverage reports in multiple formats
- Maps `@/` imports to `src/` directory

### Setup File (`tests/setup.ts`)
- Configures Jest DOM matchers
- Sets up global test environment
- Can suppress console output during tests

## Writing Tests

### Unit Test Example
```typescript
describe('MyFunction', () => {
    it('should do something', () => {
        const result = myFunction('input');
        expect(result).toBe('expected output');
    });
});
```

### Integration Test Example
```typescript
describe('API Integration', () => {
    it('should fetch data from API', async () => {
        const result = await apiCall();
        expect(result).toBeInstanceOf(Array);
    }, 30000); // 30 second timeout
});
```

### Component Test Example
```typescript
describe('MyComponent', () => {
    it('should render correctly', () => {
        render(<MyComponent />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });
});
```

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear sections
3. **Mock External Dependencies**: Use mocks for HTTP requests, timers, etc.
4. **Test Edge Cases**: Include tests for error conditions and edge cases
5. **Keep Tests Fast**: Unit tests should run quickly, integration tests can be slower
6. **Use Meaningful Assertions**: Test the behavior, not the implementation

## Coverage

The test suite aims for:
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Critical paths covered
- **Component Tests**: All user interactions tested

Run `pnpm test:coverage` to see detailed coverage reports.

## Debugging Tests

### Debug Mode
```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output
```bash
# Run tests with verbose output
pnpm test --verbose
```

### Single Test
```bash
# Run only one test
pnpm test --testNamePattern="should do something"
```

## Continuous Integration

Tests are automatically run in CI/CD pipelines:
- Unit tests run on every commit
- Integration tests run on pull requests
- Coverage reports are generated and uploaded 