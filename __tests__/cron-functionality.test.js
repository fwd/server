const server = require('../index');

describe('Cron Functionality', () => {
  beforeEach(() => {
    // Clear any existing intervals
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('cron', () => {
    test('should execute function at specified interval', () => {
      const mockFn = jest.fn();
      const interval = server.cron(mockFn, 1000);
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(2);
      
      clearInterval(interval);
    });

    test('should execute function immediately when runImmediately is true', () => {
      const mockFn = jest.fn();
      const interval = server.cron(mockFn, 1000, true);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(2);
      
      clearInterval(interval);
    });

    test('should parse natural language intervals', () => {
      const mockFn = jest.fn();
      const interval = server.cron(mockFn, 'every 2 seconds');
      
      jest.advanceTimersByTime(2000);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(2000);
      expect(mockFn).toHaveBeenCalledTimes(2);
      
      clearInterval(interval);
    });

    test('should handle different time units', () => {
      const mockFn = jest.fn();
      const interval = server.cron(mockFn, 'every 1 minute');
      
      jest.advanceTimersByTime(60000);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      clearInterval(interval);
    });

    test('should return interval ID for clearing', () => {
      const mockFn = jest.fn();
      const interval = server.cron(mockFn, 1000);
      
      expect(interval).toBeDefined();
      expect(typeof interval).toBe('object');
      
      clearInterval(interval);
    });

    test('should handle multiple cron jobs', () => {
      const mockFn1 = jest.fn();
      const mockFn2 = jest.fn();
      
      const interval1 = server.cron(mockFn1, 1000);
      const interval2 = server.cron(mockFn2, 2000);
      
      jest.advanceTimersByTime(2000);
      expect(mockFn1).toHaveBeenCalledTimes(2);
      expect(mockFn2).toHaveBeenCalledTimes(1);
      
      clearInterval(interval1);
      clearInterval(interval2);
    });
  });
});
