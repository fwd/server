const fs = require('fs');
const path = require('path');
const server = require('../index');

describe('Integration Tests', () => {
  const testDir = path.join(__dirname, 'integration-test-files');
  const testFile = path.join(testDir, 'integration-test.txt');

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Ensure test directory exists before each test
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    // Clean up test file before each test
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  afterAll(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  describe('File Operations Integration', () => {
    test('should perform complete file lifecycle', async () => {
      const content = 'Integration test content';
      const appendContent = ' - appended';
      const prependContent = 'prepended - ';

      // Write file
      await server.write(testFile, content);
      expect(fs.existsSync(testFile)).toBe(true);

      // Read file
      const readContent = await server.read(testFile);
      expect(readContent).toBe(content);

      // Append content
      await server.append(testFile, appendContent);
      const appendedContent = await server.read(testFile);
      expect(appendedContent).toBe(content + appendContent);

      // Prepend content
      await server.prepend(testFile, prependContent);
      const prependedContent = await server.read(testFile);
      expect(prependedContent).toContain(prependContent);
      expect(prependedContent).toContain(content);
      expect(prependedContent).toContain(appendContent);

      // Copy file
      const copyFile = path.join(testDir, 'copy.txt');
      await server.copy(testFile, copyFile);
      expect(fs.existsSync(copyFile)).toBe(true);

      // List directory
      const files = await server.list(testDir);
      expect(files).toContain('integration-test.txt');
      expect(files).toContain('copy.txt');

      // Delete files
      await server.unlink(testFile);
      await server.unlink(copyFile);
      expect(fs.existsSync(testFile)).toBe(false);
      expect(fs.existsSync(copyFile)).toBe(false);
    });
  });

  describe('Utility Functions Integration', () => {
    test('should work with UUID and timestamp', () => {
      const uuid = server.uuid();
      const timestamp = server.timestamp();
      
      expect(typeof uuid).toBe('string');
      expect(typeof timestamp).toBe('number');
      expect(uuid).toMatch(/^[0-9a-f-]+$/i);
      expect(timestamp).toBeGreaterThan(0);
    });

    test('should work with time and date functions', () => {
      const timeInMs = server.time(1, 'minute');
      const dateString = server.date('tomorrow');
      const formattedTimestamp = server.timestamp('LLLL');
      
      expect(timeInMs).toBe(60000);
      expect(typeof dateString).toBe('string');
      expect(typeof formattedTimestamp).toBe('string');
    });

    test('should handle validation functions', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'invalid-email';
      const validPhone = { value: '123-456-7890' };
      const invalidPhone = { value: '123' };

      expect(server.isEmail(validEmail)).toBe(true);
      expect(server.isEmail(invalidEmail)).toBe(false);
      expect(server.isPhone(validPhone)).toBe(true);
      expect(server.isPhone(invalidPhone)).toBe(false);
    });
  });

  describe('Server Configuration Integration', () => {
    test('should maintain state across operations', () => {
      // Set configuration
      server.config.timezone = 'America/New_York';
      server.config.customSetting = 'test';

      // Use configuration in operations
      const timestamp = server.timestamp('LLLL');
      const date = server.date('now');

      expect(typeof timestamp).toBe('string');
      expect(typeof date).toBe('string');
      expect(server.config.timezone).toBe('America/New_York');
      expect(server.config.customSetting).toBe('test');
    });

    test('should handle route registration', () => {
      const initialRouteCount = server.routes.length;
      
      server.get('/test', (req, res) => res.send('test'));
      server.post('/test', (req, res) => res.send('test'));
      
      expect(server.routes.length).toBe(initialRouteCount + 2);
      expect(server.routes[initialRouteCount].method).toBe('get');
      expect(server.routes[initialRouteCount + 1].method).toBe('post');
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle file operations gracefully', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      
      const readResult = await server.read(nonExistentFile);
      const appendResult = await server.append(nonExistentFile, 'test');
      const unlinkResult = await server.unlink(nonExistentFile);
      
      expect(readResult).toBe(false);
      expect(appendResult).toBe(false);
      expect(unlinkResult).toBe(false);
    });

    test('should handle invalid inputs gracefully', () => {
      expect(server.isEmail(null)).toBe(false);
      expect(server.isEmail(undefined)).toBe(false);
      expect(() => server.isPhone({ value: null })).toThrow();
      expect(() => server.isPhone({ value: undefined })).toThrow();
    });
  });
});
