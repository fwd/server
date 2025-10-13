// Jest setup file for server tests
const fs = require('fs');
const path = require('path');

// Global test setup
beforeAll(() => {
  // Ensure test directories exist
  const testDirs = [
    path.join(__dirname, 'test-files'),
    path.join(__dirname, 'integration-test-files')
  ];
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
});

// Global test cleanup
afterAll(() => {
  // Clean up test directories
  const testDirs = [
    path.join(__dirname, 'test-files'),
    path.join(__dirname, 'integration-test-files')
  ];
  
  testDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

// Increase timeout for integration tests
jest.setTimeout(10000);

// Mock console.log for cleaner test output
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
});
