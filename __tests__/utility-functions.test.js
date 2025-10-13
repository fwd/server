const server = require('../index');

describe('Utility Functions', () => {
  describe('exec', () => {
    test('should execute simple command and return output', async () => {
      const result = await server.exec('echo "Hello World"');
      expect(result.trim()).toBe('Hello World');
    });

    test('should execute pwd command', async () => {
      const result = await server.exec('pwd');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle command with no output', async () => {
      const result = await server.exec('true');
      expect(result).toBe('');
    });

    test('should handle invalid command gracefully', async () => {
      const result = await server.exec('nonexistentcommand12345');
      expect(typeof result).toBe('string');
    });
  });

  describe('sleep', () => {
    test('should sleep for specified duration', async () => {
      const start = Date.now();
      await server.sleep(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(90); // Allow some tolerance
    });

    test('should sleep for 0ms', async () => {
      const start = Date.now();
      await server.sleep(0);
      const end = Date.now();
      expect(end - start).toBeLessThan(10);
    });
  });

  describe('wait', () => {
    test('should be an alias for sleep', async () => {
      const start = Date.now();
      await server.wait(50);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(40);
    });
  });

  describe('uuid', () => {
    test('should generate valid UUID', () => {
      const uuid = server.uuid();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    test('should generate UUID with specified length', () => {
      const uuid = server.uuid(8);
      expect(uuid).toHaveLength(8);
      expect(uuid).toMatch(/^[0-9a-f]{8}$/i);
    });

    test('should generate UUID with prepend', () => {
      const uuid = server.uuid(8, 'PREFIX-');
      expect(uuid).toMatch(/^PREFIX-[0-9a-f]{8}$/i);
    });

    test('should generate UUID without dashes', () => {
      const uuid = server.uuid(undefined, undefined, true);
      expect(uuid).not.toContain('-');
      expect(uuid).toMatch(/^[0-9a-f]{32}$/i);
    });

    test('should generate UUID with all options', () => {
      const uuid = server.uuid(16, 'TEST-', true);
      expect(uuid).toMatch(/^TEST-[0-9a-f]+$/i);
      expect(uuid.length).toBeGreaterThan(5); // At least 'TEST-' + some chars
    });

    test('should generate unique UUIDs', () => {
      const uuid1 = server.uuid();
      const uuid2 = server.uuid();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('time', () => {
    test('should convert time with valid parameters', () => {
      const result = server.time(1, 'minute');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('should convert different time units', () => {
      const minute = server.time(1, 'minute');
      const hour = server.time(1, 'hour');
      
      expect(minute).toBe(60000); // 1 minute in milliseconds
      expect(hour).toBeGreaterThan(minute);
      
      // Test day conversion if it exists
      const day = server.time(1, 'day');
      if (day !== undefined) {
        expect(day).toBeGreaterThan(hour);
      }
    });

    test('should handle plural forms', () => {
      const minute = server.time(1, 'minute');
      const minutes = server.time(1, 'minutes');
      expect(minute).toBe(minutes);
    });
  });

  describe('date', () => {
    test('should parse natural language date', () => {
      const result = server.date('tomorrow');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should parse specific date string', () => {
      const result = server.date('January 1, 2024');
      expect(typeof result).toBe('string');
      expect(result).toContain('2024');
    });

    test('should use custom format', () => {
      const result = server.date('January 1, 2024', 'YYYY-MM-DD');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should use custom timezone', () => {
      const result = server.date('January 1, 2024', 'YYYY-MM-DD HH:mm:ss', 'America/Los_Angeles');
      expect(typeof result).toBe('string');
      // The result should be a valid date string (timezone conversion may shift the date)
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    test('should use default timezone from config', () => {
      server.config.timezone = 'America/New_York';
      const result = server.date('January 1, 2024');
      expect(typeof result).toBe('string');
    });
  });

  describe('timestamp', () => {
    test('should return unix timestamp by default', () => {
      const result = server.timestamp();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    });

    test('should return formatted timestamp', () => {
      const result = server.timestamp('L');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return different formats', () => {
      const formats = ['L', 'LL', 'LLL', 'LLLL'];
      formats.forEach(format => {
        const result = server.timestamp(format);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });

    test('should handle timezone', () => {
      const result = server.timestamp('LLLL', 'America/New_York');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    test('should handle timezone aliases', () => {
      const usEast = server.timestamp('LLLL', 'us-east');
      const usWest = server.timestamp('LLLL', 'us-west');
      
      expect(typeof usEast).toBe('string');
      expect(typeof usWest).toBe('string');
    });

    test('should use config timezone', () => {
      server.config.timezone = 'America/Los_Angeles';
      const result = server.timestamp('LLLL');
      expect(typeof result).toBe('string');
    });
  });
});
