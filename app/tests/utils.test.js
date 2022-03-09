const {
   encryptPass,
   first,
   getDate,
   isLogged,
   isAdmin,
   noPass
} = require('../config/utils')

test.each(['123456', 123456, 0, '', undefined, null])('encryptPass(%p)', v => {
   expect(encryptPass(v)).toHaveLength(60)
})

test.each([
   [undefined, undefined],
   [null, null],
   [1, 1],
   ['', ''],
   ['abc', 'abc'],
   [[], undefined],
   [[1], 1],
   [[1, 2], 1]
])('first(%p) = %p', (v, r) => {
   expect(first(v)).toBe(r)
})
test('first', () => {
   expect(first([{ a: 'a' }, { b: 'b' }])).toEqual({ a: 'a' })
})

test.each([undefined, null, '', '12102021', 12102021, '0/1/21', '//21', [], {}])(
   'getDate(%p)',
   v => {
      expect(getDate(v)).toBeFalsy()
   }
)
test.each(['12/10/2021', '1/1/2021', '1/1/21'])('getDate(%p)', v => {
   expect(getDate(v)).toBeTruthy()
})

test.each([
   [{ user: undefined }, false],
   [{ user: null }, false],
   [{ user: {} }, true]
])('isLogged(%p) = %p', (v, r) => {
   expect(isLogged(v)).toBe(r)
})

test.each([
   [{ user: undefined }, false],
   [{ user: null }, false],
   [{ user: {} }, false],
   [{ user: { admin: false } }, false],
   [{ user: { admin: true } }, true]
])('isAdmin(%p) = %p', (v, r) => {
   expect(isAdmin(v)).toBe(r)
})

test.each([undefined, null, false, NaN])('noPass(%p)', v => {
   expect(noPass(v)).toBeFalsy()
})
test.each([
   {},
   [],
   { password: '123' },
   [{ password: '123' }],
   { user: { password: '123' } },
   [[[{ password: '123' }]]]
])('noPass(%p)', v => {
   expect(noPass(v)).not.toHaveProperty('password')
})
