# Cache Implementation

Local implementation of the `@fwd/cache` package to reduce external dependencies.

## Package Details

### @fwd/cache
- **Original Package**: `@fwd/cache@0.0.3`
- **Files**: `cache.js`, `index.js`
- **Description**: In-memory caching implementation with TTL support
- **Features**:
  - Key-value storage
  - Time-to-live (TTL) expiration
  - Automatic cleanup of expired entries
  - Callback support for expiration events
  - JSON import/export functionality
  - Debug mode with hit/miss statistics

## Usage

These dependencies are automatically loaded by the main server module and provide the same API as their original npm packages.

## Benefits

- **Reduced Dependencies**: Fewer external packages to manage
- **Self-Contained**: No external package dependencies
- **Version Control**: Full control over implementation and updates
- **Customization**: Can be modified to fit specific needs
- **Security**: No external package vulnerabilities
