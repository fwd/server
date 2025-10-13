const fs = require('fs');
const path = require('path');
const server = require('../index');

describe('File Operations', () => {
  const testDir = path.join(__dirname, 'test-files');
  const testFile = path.join(testDir, 'test.txt');
  const testContent = 'Hello, World!';
  const testContent2 = 'Additional content';

  beforeAll(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  beforeEach(() => {
    // Ensure test directory exists before each test
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Clean up test files
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  beforeEach(() => {
    // Clean up test file before each test
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  describe('write', () => {
    test('should write content to a new file', async () => {
      const result = await server.write(testFile, testContent);
      expect(result).toBe(testContent);
      expect(fs.existsSync(testFile)).toBe(true);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(testContent);
    });

    test('should overwrite existing file content', async () => {
      // Write initial content
      await server.write(testFile, testContent);
      
      // Overwrite with new content
      const newContent = 'New content';
      const result = await server.write(testFile, newContent);
      
      expect(result).toBe(newContent);
      expect(fs.readFileSync(testFile, 'utf8')).toBe(newContent);
    });

    test('should handle empty content', async () => {
      const result = await server.write(testFile, '');
      expect(result).toBe('');
      expect(fs.existsSync(testFile)).toBe(true);
    });
  });

  describe('read', () => {
    test('should read existing file content', async () => {
      // Create test file
      fs.writeFileSync(testFile, testContent);
      
      const result = await server.read(testFile);
      expect(result).toBe(testContent);
    });

    test('should return false for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const result = await server.read(nonExistentFile);
      expect(result).toBe(false);
    });

    test('should read empty file', async () => {
      fs.writeFileSync(testFile, '');
      const result = await server.read(testFile);
      expect(result).toBe('');
    });
  });

  describe('append', () => {
    test('should append content to existing file', async () => {
      // Create initial file
      fs.writeFileSync(testFile, testContent);
      
      const result = await server.append(testFile, testContent2);
      expect(result).toBe(testContent2);
      
      const fileContent = fs.readFileSync(testFile, 'utf8');
      expect(fileContent).toBe(testContent + testContent2);
    });

    test('should return false for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const result = await server.append(nonExistentFile, testContent);
      expect(result).toBe(false);
    });

    test('should append multiple times', async () => {
      fs.writeFileSync(testFile, testContent);
      
      await server.append(testFile, '1');
      await server.append(testFile, '2');
      
      const fileContent = fs.readFileSync(testFile, 'utf8');
      expect(fileContent).toBe(testContent + '12');
    });
  });

  describe('prepend', () => {
    test('should prepend content to existing file', async () => {
      // Create initial file
      fs.writeFileSync(testFile, testContent);
      
      const result = await server.prepend(testFile, testContent2);
      expect(result).toBe(testContent2);
      
      const fileContent = fs.readFileSync(testFile, 'utf8');
      expect(fileContent).toBe(testContent2 + ' \n' + testContent);
    });

    test('should return false for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const result = await server.prepend(nonExistentFile, testContent);
      expect(result).toBe(false);
    });

    test('should prepend multiple times', async () => {
      fs.writeFileSync(testFile, testContent);
      
      await server.prepend(testFile, '1');
      await server.prepend(testFile, '2');
      
      const fileContent = fs.readFileSync(testFile, 'utf8');
      expect(fileContent).toContain('2');
      expect(fileContent).toContain('1');
      expect(fileContent).toContain(testContent);
    });
  });

  describe('unlink', () => {
    test('should delete existing file', async () => {
      // Create test file
      fs.writeFileSync(testFile, testContent);
      expect(fs.existsSync(testFile)).toBe(true);
      
      const result = await server.unlink(testFile);
      expect(result).toBeUndefined();
      expect(fs.existsSync(testFile)).toBe(false);
    });

    test('should return false for non-existent file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const result = await server.unlink(nonExistentFile);
      expect(result).toBe(false);
    });
  });

  describe('copy', () => {
    test('should copy existing file to new location', async () => {
      const sourceFile = testFile;
      const destFile = path.join(testDir, 'copy.txt');
      
      // Create source file
      fs.writeFileSync(sourceFile, testContent);
      
      const result = await server.copy(sourceFile, destFile);
      expect(result).toBeNull(); // No error
      expect(fs.existsSync(destFile)).toBe(true);
      expect(fs.readFileSync(destFile, 'utf8')).toBe(testContent);
      
      // Clean up
      fs.unlinkSync(destFile);
    });

    test('should return false for non-existent source file', async () => {
      const nonExistentFile = path.join(testDir, 'non-existent.txt');
      const destFile = path.join(testDir, 'dest.txt');
      
      const result = await server.copy(nonExistentFile, destFile);
      expect(result).toBe(false);
    });

    test('should overwrite existing destination file', async () => {
      const sourceFile = testFile;
      const destFile = path.join(testDir, 'dest.txt');
      
      // Create source and destination files
      fs.writeFileSync(sourceFile, testContent);
      fs.writeFileSync(destFile, 'Old content');
      
      const result = await server.copy(sourceFile, destFile);
      expect(result).toBeNull();
      expect(fs.readFileSync(destFile, 'utf8')).toBe(testContent);
      
      // Clean up
      fs.unlinkSync(destFile);
    });
  });

  describe('list', () => {
    test('should list files in existing directory', async () => {
      // Create test files
      const file1 = path.join(testDir, 'file1.txt');
      const file2 = path.join(testDir, 'file2.txt');
      fs.writeFileSync(file1, 'content1');
      fs.writeFileSync(file2, 'content2');
      
      const result = await server.list(testDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toContain('file1.txt');
      expect(result).toContain('file2.txt');
      
      // Clean up
      fs.unlinkSync(file1);
      fs.unlinkSync(file2);
    });

    test('should return false for non-existent directory', async () => {
      const nonExistentDir = path.join(testDir, 'non-existent');
      const result = await server.list(nonExistentDir);
      expect(result).toBe(false);
    });

    test('should return empty array for empty directory', async () => {
      const emptyDir = path.join(testDir, 'empty');
      fs.mkdirSync(emptyDir);
      
      const result = await server.list(emptyDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
      
      // Clean up
      fs.rmdirSync(emptyDir);
    });
  });
});
