const isUndefined = v => typeof v === 'undefined'
const isEmptyString = v => typeof v === 'string' && v.trim().length === 0
const isEmptyArray = v => Array.isArray(v) && v.length === 0
const isEmptyObject = v =>
   typeof v === 'object' && v !== null && Object.entries(v).length === 0

const notExists = v => {
   return isUndefined(v) || isEmptyString(v) || isEmptyArray(v) || isEmptyObject(v)
}

const exists = v => {
   return !notExists(v)
}

const existsOrError = (v, msg) => {
   if (notExists(v)) {
      throw msg
   }
}

const notExistsOrError = (v, msg) => {
   if (exists(v)) {
      throw msg
   }
}

const equalsOrError = (v1, v2, msg) => {
   if (notExists(v1) || notExists(v2) || v1 != v2) {
      throw msg
   }
}

module.exports = { exists, notExists, existsOrError, notExistsOrError, equalsOrError }
