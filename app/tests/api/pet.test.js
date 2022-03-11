const app = require('../../index')
const request = require('supertest')
const COD = require('../../config/jsonCod')
const { encryptPass } = require('../../config/utils')

let admToken
let idToDelete
const emailPrefix = 'test_pet_000'
const user = n => {
   return {
      name: 'Teste',
      email: `${emailPrefix}${n}@email.com`,
      password: '123456',
      confirmPassword: '123456'
   }
}
const admUser = encrypt => {
   let adm = user('_admin')
   adm.password = encrypt ? encryptPass(adm.password) : adm.password
   delete adm.confirmPassword
   adm.admin = true
   return adm
}

beforeAll(async () => {
   try {
      await app.db('users').whereLike('email', `${emailPrefix}%`).del()
      await app.db('users').insert(admUser(true))
      let res = await request(app).post('/login').send(admUser())
      admToken = res.body.token
   } catch (err) {
      console.log(err)
   }
})

afterAll(async () => {
   try {
      await app.db('users').whereLike('email', `${emailPrefix}%`).del()
      await app.db.destroy()
   } catch (err) {
      console.log(err)
   }
})

describe('GET /pet', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).get('/pet')
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .get('/pet')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('pets')
   })
})

describe('POST /pet', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).post('/pet')
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .post('/pet')
         .set('Authorization', `Bearer ${admToken}`)
         .send({ name: 'July', userId: null })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id')
      idToDelete = res.body.id
   })
})

describe('GET /pet/:id', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).get(`/pet/${idToDelete}`)
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .get(`/pet/${idToDelete}`)
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id')
   })
})

describe('DELETE /pet', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).delete('/pet')
      expect(res.statusCode).toBe(401)
   })
   test('MISSING_INFO', async () => {
      const res = await request(app)
         .delete('/pet')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })
   test('REGISTRY_NOT_EXIST', async () => {
      const res = await request(app)
         .delete('/pet/9999999')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.REGISTRY_NOT_EXIST().error)
   })
   test('Success', async () => {
      const res = await request(app)
         .delete(`/pet/${idToDelete}`)
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id', idToDelete)
   })
})
