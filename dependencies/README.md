# Dependencies

This folder contains local implementations of external dependencies to reduce package dependencies and improve self-containment.

## Structure

Each dependency is organized in its own subfolder:

```
dependencies/
├── cache/           # @fwd/cache implementation
│   ├── cache.js     # Core cache functionality
│   ├── index.js     # Cache API wrapper
│   └── README.md    # Cache-specific documentation
└── README.md        # This file
```

## Benefits

- **Reduced Dependencies**: Fewer external packages to manage
- **Self-Contained**: No external package dependencies
- **Version Control**: Full control over implementation and updates
- **Customization**: Can be modified to fit specific needs
- **Security**: No external package vulnerabilities
- **Scalable Structure**: Easy to add more dependencies

## Adding New Dependencies

To add a new dependency:

1. Create a new folder: `dependencies/package-name/`
2. Add the implementation files
3. Create a `README.md` explaining the package
4. Update the main server imports
5. Remove the external package from `package.json`

## Current Dependencies

- **cache**: In-memory caching with TTL support (replaces `@fwd/cache`)
- **time**: Time to millisecond conversion (replaces `@fwd/time`)
- **cron**: Simple cron-like task scheduling (replaces `@fwd/cron`)
- **date-parser**: Natural language date parsing (replaces `chrono-node`)