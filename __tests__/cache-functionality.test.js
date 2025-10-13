const server = require('../index');

describe('Caching Functionality', () => {
  beforeEach(() => {
    // Clear any existing cache
    // Note: This assumes the cache implementation can be cleared
    // You may need to adjust based on the actual @fwd/cache implementation
  });

  describe('cache', () => {
    test('should store and retrieve cached value', () => {
      const key = 'test-key';
      const value = { id: 1, name: 'test' };
      
      // Store value
      server.cache(key, value);
      
      // Retrieve value
      const retrieved = server.cache(key);
      expect(retrieved).toEqual(value);
    });

    test('should return null for non-existent key', () => {
      const retrieved = server.cache('non-existent-key');
      expect(retrieved).toBeNull();
    });

    test('should store different types of values', () => {
      const testCases = [
        { key: 'string', value: 'hello world' },
        { key: 'number', value: 42 },
        { key: 'boolean', value: true },
        { key: 'array', value: [1, 2, 3] },
        { key: 'object', value: { a: 1, b: 2 } },
        { key: 'null', value: null }
      ];

      testCases.forEach(({ key, value }) => {
        server.cache(key, value);
        const retrieved = server.cache(key);
        expect(retrieved).toEqual(value);
      });
    });

    test('should overwrite existing values', () => {
      const key = 'overwrite-test';
      const originalValue = 'original';
      const newValue = 'new';
      
      server.cache(key, originalValue);
      expect(server.cache(key)).toBe(originalValue);
      
      server.cache(key, newValue);
      expect(server.cache(key)).toBe(newValue);
    });

    test('should handle cache with expiration', () => {
      const key = 'expiring-key';
      const value = 'expiring value';
      const expiration = 1000; // 1 second
      
      server.cache(key, value, expiration);
      expect(server.cache(key)).toBe(value);
      
      // Note: Testing expiration would require waiting or mocking time
      // This test verifies the function accepts expiration parameter
    });

    test('should handle multiple cache entries', () => {
      const entries = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' }
      ];

      entries.forEach(({ key, value }) => {
        server.cache(key, value);
      });

      entries.forEach(({ key, value }) => {
        expect(server.cache(key)).toBe(value);
      });
    });
  });
});
