let COD = require('../../config/jsonCod')

describe('jsonCod', () => {
   test.each([
      [undefined, undefined],
      [null, null],
      [NaN, NaN],
      [123, 123],
      ['', ''],
      [[], []],
      [{}, {}],
      ['Registro', COD.M],
      ['Informação', COD.F]
   ])('jsonCod(%p, %p)', (v1, v2) => {
      expect(COD.MISSING_INFO(v1, v2)).toHaveProperty('error')
      expect(COD.DIFFERENT_INFO(v1)).toHaveProperty('error')
      expect(COD.INVALID_INFO(v1, v2)).toHaveProperty('error')
      expect(COD.UNREGISTERED(v1, v2)).toHaveProperty('error')
      expect(COD.NOT_UPDATED(v1, v2)).toHaveProperty('error')
      expect(COD.ALREADY_REGISTERED(v1)).toHaveProperty('error')
      expect(COD.REGISTRY_NOT_EXIST(v1)).toHaveProperty('error')
   })
})
