test('Jest is running in TypeScript mode', () => {
  expect(typeof jest).toBe('object');
  expect(typeof require).toBe('function');
  require('../src/entity/Character');
});