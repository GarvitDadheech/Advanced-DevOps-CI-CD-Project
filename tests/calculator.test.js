const { add, multiply, subtract, divide } = require('../src/utils/calculator');

describe('Calculator Functions', () => {
  
  describe('add()', () => {
    test('should correctly add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(10, 20)).toBe(30);
    });
    
    test('should correctly add negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
      expect(add(-5, -3)).toBe(-8);
    });
    
    test('should correctly add decimal numbers', () => {
      expect(add(1.5, 2.5)).toBe(4);
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });
  
  describe('multiply()', () => {
    test('should correctly multiply two positive numbers', () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(5, 4)).toBe(20);
    });
    
    test('should correctly multiply negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });
    
    test('should return zero when multiplying by zero', () => {
      expect(multiply(5, 0)).toBe(0);
      expect(multiply(0, 10)).toBe(0);
    });
  });
  
  describe('subtract()', () => {
    test('should correctly subtract two numbers', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(10, 4)).toBe(6);
    });
    
    test('should correctly subtract negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
      expect(subtract(5, -3)).toBe(8);
    });
    
    test('should return negative when second number is larger', () => {
      expect(subtract(3, 5)).toBe(-2);
    });
  });
  
  describe('divide()', () => {
    test('should correctly divide two numbers', () => {
      expect(divide(6, 3)).toBe(2);
      expect(divide(10, 2)).toBe(5);
    });
    
    test('should correctly divide negative numbers', () => {
      expect(divide(-6, 3)).toBe(-2);
      expect(divide(-6, -3)).toBe(2);
    });
    
    test('should return decimal for non-exact division', () => {
      expect(divide(5, 2)).toBe(2.5);
      expect(divide(7, 4)).toBe(1.75);
    });
    
    test('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Cannot divide by zero');
      expect(() => divide(0, 0)).toThrow('Cannot divide by zero');
    });
  });
});
