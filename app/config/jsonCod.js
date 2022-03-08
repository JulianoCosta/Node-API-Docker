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
      return {
         ...CODES.MISSING_INFO,
         msg: `${PREFIX}${name} não informad${gender}`
      }
   }
   const DIFFERENT_INFO = name => {
      return {
         ...CODES.DIFFERENT_INFO,
         msg: `${PREFIX}${name} não conferem`
      }
   }
   const INVALID_INFO = (name, gender) => {
      return {
         ...CODES.INVALID_INFO,
         msg: `${PREFIX}${name} inválid${gender}`
      }
   }
   const UNREGISTERED = (name, gender) => {
      return {
         ...CODES.UNREGISTERED,
         msg: `${PREFIX}${name} não foi cadastrad${gender}`
      }
   }
   const NOT_UPDATED = (name, gender) => {
      return {
         ...CODES.NOT_UPDATED,
         msg: `${PREFIX}${name} não foi atualizad${gender}`
      }
   }
   const ALREADY_REGISTERED = name => {
      return {
         ...CODES.ALREADY_REGISTERED,
         msg: `${PREFIX}${name} já está cadastrado`
      }
   }
   const REGISTRY_NOT_EXIST = name => {
      return {
         ...CODES.REGISTRY_NOT_EXIST,
         msg: `${PREFIX}Cadastro de ${name} não existe`
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
