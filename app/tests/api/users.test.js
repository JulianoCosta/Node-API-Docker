const app = require('../../index')
const request = require('supertest')
const COD = require('../../config/jsonCod')
const { encryptPass } = require('../../config/utils')

const emailPrefix = 'test_000'
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
let admToken
let idToDelete

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

describe('POST /register', () => {
   test.each([
      undefined,
      null,
      [],
      {},
      { name: user(1).name },
      { name: user(1).name, email: user(1).email },
      { name: user(1).name, email: user(1).email, password: user(1).password }
   ])('MISSING_INFO %p', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })

   test.each([
      {
         ...user(1),
         confirmPassword: '1234567'
      }
   ])('DIFFERENT_INFO %p', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.DIFFERENT_INFO().error)
   })

   test.each([user(1)])('Success', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toBe(200)
   })
})

describe('POST /login', () => {
   test.each([
      undefined,
      null,
      [],
      {},
      { email: user(1).email },
      { password: user(1).password }
   ])('MISSING_INFO %p', async body => {
      const res = await request(app).post('/login').send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })

   test.each([
      { email: 'emailErrado@email.com', password: 'senhaErrada' },
      { email: 'emailErrado@email.com', password: user(1).password },
      { email: user(1).email, password: 'senhaErrada' }
   ])('INCORRECT_LOGIN %p', async body => {
      const res = await request(app).post('/login').send(body)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.INCORRECT_LOGIN().error)
   })

   test.each([{ email: user(1).email, password: user(1).password }])(
      'Success %p',
      async body => {
         const res = await request(app).post('/login').send(body)
         expect(res.statusCode).toBe(200)
         expect(res.body).toHaveProperty('token')
      }
   )
})

describe('POST /token/validate', () => {
   test.each([undefined, null, NaN, [], {}, 'tokenInvalido'])(
      'INVALID_TOKEN %p',
      async body => {
         const res = await request(app).post('/token/validate').send(body)
         expect(res.statusCode).toBe(400)
         expect(res.body).toHaveProperty('error', COD.INVALID_TOKEN().error)
      }
   )

   test('Success', async () => {
      let res = await request(app).post('/token/validate').send({ token: admToken })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('email')
   })
})

describe('GET /user', () => {
   test('Unauthorized', async () => {
      const res = await request(app).get('/user')
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .get('/user')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('users')
   })
})

describe('POST /user', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).post('/user')
      expect(res.statusCode).toBe(401)
   })
   test('Unauthorized - not admin', async () => {
      let res = await request(app).post('/login').send(user(1))
      let token = res.body.token
      res = await request(app).post('/user').set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .post('/user')
         .set('Authorization', `Bearer ${admToken}`)
         .send({ ...user(2) })
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id')
      idToDelete = res.body.id
   })
})

describe('GET /user/:id', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).get(`/user/${idToDelete}`)
      expect(res.statusCode).toBe(401)
   })
   test('Success', async () => {
      const res = await request(app)
         .get(`/user/${idToDelete}`)
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('email')
   })
})

describe('DELETE /user', () => {
   test('Unauthorized - not logged in', async () => {
      const res = await request(app).delete('/user')
      expect(res.statusCode).toBe(401)
   })
   test('MISSING_INFO', async () => {
      const res = await request(app)
         .delete('/user')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })
   test('REGISTRY_NOT_EXIST', async () => {
      const res = await request(app)
         .delete('/user/9999999')
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error', COD.REGISTRY_NOT_EXIST().error)
   })
   test('Success', async () => {
      const res = await request(app)
         .delete(`/user/${idToDelete}`)
         .set('Authorization', `Bearer ${admToken}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('id', idToDelete)
   })
})
