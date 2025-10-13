const request = require('supertest');
const server = require('../index');

describe('Server Setup and Routing', () => {
  let app;

  beforeEach(() => {
    // Reset server state
    server.routes = [];
    server.config = {};
    
    // Create a test app instance
    app = require('express')();
    app.use(require('express').json());
    
    // Mock the express app methods
    jest.spyOn(server, 'start').mockImplementation((port, path, config) => {
      // Apply routes to test app
      server.routes.forEach(route => {
        app[route.method](route.path, route.action);
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('HTTP Methods', () => {
    test('should register GET route', () => {
      const mockHandler = jest.fn((req, res) => res.send('GET test'));
      server.get('/test', mockHandler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0]).toEqual({
        method: 'get',
        path: '/test',
        action: mockHandler
      });
    });

    test('should register POST route', () => {
      const mockHandler = jest.fn((req, res) => res.send('POST test'));
      server.post('/test', mockHandler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0]).toEqual({
        method: 'post',
        path: '/test',
        action: mockHandler
      });
    });

    test('should register PUT route', () => {
      const mockHandler = jest.fn((req, res) => res.send('PUT test'));
      server.put('/test', mockHandler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0]).toEqual({
        method: 'put',
        path: '/test',
        action: mockHandler
      });
    });

    test('should register PATCH route', () => {
      const mockHandler = jest.fn((req, res) => res.send('PATCH test'));
      server.patch('/test', mockHandler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0]).toEqual({
        method: 'patch',
        path: '/test',
        action: mockHandler
      });
    });

    test('should register DELETE route', () => {
      const mockHandler = jest.fn((req, res) => res.send('DELETE test'));
      server.delete('/test', mockHandler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0]).toEqual({
        method: 'delete',
        path: '/test',
        action: mockHandler
      });
    });

    test('should register multiple routes', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      server.get('/route1', handler1);
      server.post('/route2', handler2);
      
      expect(server.routes).toHaveLength(2);
      expect(server.routes[0].method).toBe('get');
      expect(server.routes[1].method).toBe('post');
    });
  });

  describe('Server Configuration', () => {
    test('should set default path', () => {
      expect(server.path).toBe('./');
    });

    test('should initialize with empty routes array', () => {
      expect(Array.isArray(server.routes)).toBe(true);
      expect(server.routes).toHaveLength(0);
    });

    test('should initialize with empty config object', () => {
      expect(typeof server.config).toBe('object');
      expect(Object.keys(server.config)).toHaveLength(0);
    });

    test('should have required dependencies', () => {
      expect(server.http).toBeDefined();
      expect(server.database).toBeDefined();
      expect(server.moment).toBeDefined();
    });
  });

  describe('Route Execution', () => {
    test('should execute route handler with correct method', async () => {
      const mockHandler = jest.fn((req, res) => res.json({ success: true }));
      server.get('/api/test', mockHandler);
      
      // Start server to register routes
      server.start(3000);
      
      const response = await request(app)
        .get('/api/test')
        .expect(200);
      
      expect(mockHandler).toHaveBeenCalled();
    });

    test('should handle route registration', () => {
      const handler = jest.fn((req, res) => res.send('OK'));
      
      server.get('/test-route', handler);
      
      expect(server.routes).toHaveLength(1);
      expect(server.routes[0].method).toBe('get');
      expect(server.routes[0].path).toBe('/test-route');
      expect(server.routes[0].action).toBe(handler);
    });
  });

  describe('Server Properties', () => {
    test('should have correct initial properties', () => {
      expect(server.path).toBe('./');
      expect(Array.isArray(server.routes)).toBe(true);
      expect(typeof server.config).toBe('object');
      expect(server.http).toBeDefined();
      expect(server.database).toBeDefined();
      expect(server.moment).toBeDefined();
    });

    test('should allow path modification', () => {
      const newPath = '/custom/path';
      server.path = newPath;
      expect(server.path).toBe(newPath);
    });

    test('should allow config modification', () => {
      server.config.timezone = 'America/New_York';
      expect(server.config.timezone).toBe('America/New_York');
    });
  });
});
