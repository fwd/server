const server = require('../index');

describe('Validation Functions', () => {
  describe('isEmail', () => {
    test('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'user@subdomain.example.com'
      ];

      validEmails.forEach(email => {
        expect(server.isEmail(email)).toBe(true);
      });
    });

    test('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example..com',
        'user name@example.com',
        'user@example com',
        '',
        null,
        undefined,
        123
      ];

      invalidEmails.forEach(email => {
        expect(server.isEmail(email)).toBe(false);
      });
    });

    test('should handle case insensitive emails', () => {
      expect(server.isEmail('TEST@EXAMPLE.COM')).toBe(true);
      expect(server.isEmail('Test@Example.Com')).toBe(true);
    });
  });

  describe('isPhone', () => {
    test('should validate correct phone numbers', () => {
      const validPhones = [
        { value: '1234567890' },
        { value: '(123) 456-7890' },
        { value: '123-456-7890' },
        { value: '123.456.7890' },
        { value: '123 456 7890' },
        { value: '(123)456-7890' }
      ];

      validPhones.forEach(phone => {
        expect(server.isPhone(phone)).toBe(true);
      });
    });

    test('should reject invalid phone numbers', () => {
      const invalidPhones = [
        { value: '123456789' }, // Too short
        { value: '12345678901' }, // Too long
        { value: 'abc-def-ghij' }, // Letters
        { value: '123-456' }, // Too short
        { value: '' } // Empty
      ];

      invalidPhones.forEach(phone => {
        expect(server.isPhone(phone)).toBe(false);
      });
    });

    test('should handle null and undefined phone objects', () => {
      expect(() => server.isPhone({ value: null })).toThrow();
      expect(() => server.isPhone({ value: undefined })).toThrow();
    });

    test('should handle edge cases', () => {
      expect(server.isPhone({ value: '000-000-0000' })).toBe(true);
      expect(server.isPhone({ value: '999-999-9999' })).toBe(true);
    });
  });
});
