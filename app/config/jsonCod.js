const COD = () => {
   const PREFIX = ''
   const F = 'a'
   const M = 'o'
   let id = 0
   const CODES = Object.freeze({
      MISSING_INFO: { ...{ error: ++id }, name: 'MISSING_INFO' },
      DIFFERENT_INFO: { ...{ error: ++id }, name: 'DIFFERENT_INFO' },
      INVALID_INFO: { ...{ error: ++id }, name: 'INVALID_INFO' },
      UNREGISTERED: { ...{ error: ++id }, name: 'UNREGISTERED' },
      NOT_UPDATED: { ...{ error: ++id }, name: 'NOT_UPDATED' },
      ALREADY_REGISTERED: { ...{ error: ++id }, name: 'ALREADY_REGISTERED' },
      REGISTRY_NOT_EXIST: { ...{ error: ++id }, name: 'REGISTRY_NOT_EXIST' },
      INCORRECT_LOGIN: { ...{ error: ++id }, name: 'INCORRECT_LOGIN' },
      INVALID_TOKEN: { ...{ error: ++id }, name: 'INVALID_TOKEN' }
   })
   const printCodeList = () => {
      formatText = (prev, curr, i) => {
         return `${i > 0 ? prev : ''}\n${curr.error}: ${curr.name}`
      }
      const text = Object.values(CODES).reduce(formatText, CODES[0])
      console.log(text)
   }
   const MISSING_INFO = (name, gender) => {
      let { name: n, gender: g } = filter(name, gender)
      return {
         ...CODES.MISSING_INFO,
         msg: `${PREFIX}${n} não informad${g}`
      }
   }
   const DIFFERENT_INFO = name => {
      let { name: n, gender: g } = filter(name)
      return {
         ...CODES.DIFFERENT_INFO,
         msg: `${PREFIX}${n} não conferem`
      }
   }
   const INVALID_INFO = (name, gender) => {
      let { name: n, gender: g } = filter(name, gender)
      return {
         ...CODES.INVALID_INFO,
         msg: `${PREFIX}${n} inválid${g}`
      }
   }
   const UNREGISTERED = (name, gender) => {
      let { name: n, gender: g } = filter(name, gender)
      return {
         ...CODES.UNREGISTERED,
         msg: `${PREFIX}${n} não foi cadastrad${g}`
      }
   }
   const NOT_UPDATED = (name, gender) => {
      let { name: n, gender: g } = filter(name, gender)
      return {
         ...CODES.NOT_UPDATED,
         msg: `${PREFIX}${n} não foi atualizad${g}`
      }
   }
   const ALREADY_REGISTERED = name => {
      let { name: n, gender: g } = filter(name)
      return {
         ...CODES.ALREADY_REGISTERED,
         msg: `${PREFIX}${n} já está cadastrado`
      }
   }
   const REGISTRY_NOT_EXIST = name => {
      let { name: n, gender: g } = filter(name)
      return {
         ...CODES.REGISTRY_NOT_EXIST,
         msg: `${PREFIX}Cadastro de ${n} não existe`
      }
   }
   const INCORRECT_LOGIN = () => {
      return {
         ...CODES.INCORRECT_LOGIN,
         msg: `${PREFIX}Email e/ou Senha incorreta`
      }
   }
   const INVALID_TOKEN = () => {
      return {
         ...CODES.INVALID_TOKEN,
         msg: `${PREFIX}Token Inválido`
      }
   }

   const filter = (name, gender) => {
      name = !!name && typeof name === 'string' ? name : 'Registro'
      gender = !!gender && (gender === M || gender === F) ? gender : 'o'
      return { name, gender }
   }

   return {
      F,
      M,
      printCodeList,
      MISSING_INFO,
      DIFFERENT_INFO,
      INVALID_INFO,
      UNREGISTERED,
      NOT_UPDATED,
      ALREADY_REGISTERED,
      REGISTRY_NOT_EXIST,
      INCORRECT_LOGIN,
      INVALID_TOKEN
   }
}

module.exports = COD()
