const app = require('../../index')
const request = require('supertest')
const COD = require('../../config/jsonCod')

const user = {
   name: 'Juliano',
   email: 'juliano10@email.com',
   password: '123456',
   confirmPassword: '123456'
}

beforeAll(async () => {
   await app.db('users').where({ email: user.email }).del()
})

afterAll(async () => {
   await app.db.destroy()
})

describe('POST /register', () => {
   test.each([
      undefined,
      null,
      [],
      {},
      { name: user.name },
      { name: user.name, email: user.email },
      { name: user.name, email: user.email, password: user.password }
   ])('MISSING_INFO %p', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })

   test.each([
      {
         ...user,
         confirmPassword: '1234567'
      }
   ])('DIFFERENT_INFO %p', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('error', COD.DIFFERENT_INFO().error)
   })

   test.each([user])('SUCCESS', async body => {
      const res = await request(app).post('/register').send(body)
      expect(res.statusCode).toEqual(200)
   })
})

describe('POST /login', () => {
   test.each([
      undefined,
      null,
      [],
      {},
      { email: user.email },
      { password: user.password }
   ])('MISSING_INFO %p', async body => {
      const res = await request(app).post('/login').send(body)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('error', COD.MISSING_INFO().error)
   })

   test.each([
      { email: 'emailErrado@email.com', password: 'senhaErrada' },
      { email: 'emailErrado@email.com', password: user.password },
      { email: user.email, password: 'senhaErrada' }
   ])('INCORRECT_LOGIN %p', async body => {
      const res = await request(app).post('/login').send(body)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('error', COD.INCORRECT_LOGIN().error)
   })

   test.each([{ email: user.email, password: user.password }])(
      'SUCCESS %p',
      async body => {
         const res = await request(app).post('/login').send(body)
         expect(res.statusCode).toEqual(200)
         expect(res.body).toHaveProperty('token')
         token = res.body.token
      }
   )
})

describe('POST /token/validate', () => {
   test.each([undefined, null, NaN, [], {}, 'tokenInvalido'])(
      'INVALID_TOKEN %p',
      async body => {
         const res = await request(app).post('/token/validate').send(body)
         expect(res.statusCode).toEqual(400)
         expect(res.body).toHaveProperty('error', COD.INVALID_TOKEN().error)
      }
   )

   test('SUCCESS', async () => {
      let res = await request(app).post('/login').send(user)
      let token = res.body.token
      res = await request(app).post('/token/validate').send({ token })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('email')
   })
})
