import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {

  test('Should return default content type as json', async () => {
    const route: string = '/test_content_type'
    app.get(route, (req, res) => res.send(''))
    await request(app).get(route)
      .expect('content-type', /json/)
  })

  test('Should return xml content type whe forced', async () => {
    const route: string = '/test_content_type_xml'
    app.get(route, (req, res) => {
      res.type('.xml')
      res.send('')
    })
    await request(app).get(route)
      .expect('content-type', /xml/)
  })

})