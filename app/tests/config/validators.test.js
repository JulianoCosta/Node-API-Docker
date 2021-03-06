const { notExists, equalsOrError } = require('../../config/validators')

describe('notExists', () => {
   test.each([
      [undefined, true],
      ['', true],
      [' ', true],
      [[], true],
      [{}, true],
      [null, false],
      [true, false],
      [false, false],
      [0, false],
      [123, false],
      ['abc', false],
      [[1], false],
      [{ a: 'b' }, false]
   ])('notExists(%p) = %p', (v, r) => {
      expect(notExists(v)).toBe(r)
   })
})

describe('equalsOrError', () => {
   test.each([
      [undefined, undefined],
      [null, undefined],
      ['', ''],
      [0, 1],
      ['123', '1234'],
      [[], []],
      [[], {}],
      [{}, {}]
   ])('equalsOrError(%p, %p)', (v1, v2) => {
      expect(() => equalsOrError(v1, v2, '').toThrow())
   })
   test.each([
      [0, 0],
      ['123', '123'],
      [123, 123],
      [1.25, 1.25],
      [false, false],
      [true, true],
      [null, null]
   ])('equalsOrError(%p, %p)', (v1, v2) => {
      expect(() => equalsOrError(v1, v2, '').not.toThrow())
   })
})
