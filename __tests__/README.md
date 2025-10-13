# Test Suite for @fwd/server

This directory contains comprehensive test cases for the @fwd/server Node.js framework.

## Test Structure

### Test Files

- **`file-operations.test.js`** - Tests for file system operations (read, write, append, prepend, unlink, copy, list)
- **`utility-functions.test.js`** - Tests for utility functions (exec, sleep, uuid, time, date, timestamp)
- **`validation-functions.test.js`** - Tests for validation functions (isEmail, isPhone)
- **`cron-functionality.test.js`** - Tests for cron job functionality
- **`cache-functionality.test.js`** - Tests for caching functionality
- **`server-setup.test.js`** - Tests for server setup and routing
- **`integration.test.js`** - Integration tests that combine multiple functionalities
- **`setup.js`** - Jest setup file for global test configuration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The test suite covers:

### File Operations
- ✅ File reading (existing and non-existent files)
- ✅ File writing (new files and overwriting)
- ✅ File appending
- ✅ File prepending
- ✅ File deletion (unlink)
- ✅ File copying
- ✅ Directory listing

### Utility Functions
- ✅ Command execution (exec)
- ✅ Sleep/wait functionality
- ✅ UUID generation with various options
- ✅ Time conversion
- ✅ Date parsing and formatting
- ✅ Timestamp generation with timezone support

### Validation Functions
- ✅ Email validation (valid and invalid cases)
- ✅ Phone number validation (various formats)

### Cron Functionality
- ✅ Interval-based execution
- ✅ Natural language intervals
- ✅ Immediate execution option
- ✅ Multiple cron jobs

### Caching
- ✅ Value storage and retrieval
- ✅ Different data types
- ✅ Expiration handling
- ✅ Multiple cache entries

### Server Setup
- ✅ HTTP method registration (GET, POST, PUT, PATCH, DELETE)
- ✅ Route configuration
- ✅ Middleware support
- ✅ Server properties

### Integration Tests
- ✅ Complete file lifecycle operations
- ✅ Cross-functionality interactions
- ✅ Error handling
- ✅ Configuration management

## Test Features

- **Comprehensive Coverage**: Tests cover all major functions and edge cases
- **Error Handling**: Tests verify graceful handling of invalid inputs and errors
- **Integration Testing**: Tests verify that different functions work together correctly
- **Cleanup**: Automatic cleanup of test files and directories
- **Mocking**: Proper mocking of external dependencies where needed
- **Async Testing**: Proper handling of asynchronous operations

## Dependencies

- **Jest**: Testing framework
- **Supertest**: HTTP assertion library for server testing
- **fs**: File system operations for test file management

## Notes

- Tests use temporary directories to avoid conflicts with existing files
- All test files are automatically cleaned up after test completion
- Tests include both positive and negative test cases
- Integration tests verify that multiple functions work together correctly
