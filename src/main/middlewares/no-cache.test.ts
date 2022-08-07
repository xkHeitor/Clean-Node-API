import app from '../config/app'
import { noCache } from './no-cache'

import request from 'supertest'

describe('NoCache Middleware', () => {

  const route: string = '/test_no_cache'

  test('Should disable cache', async () => {
    app.get(route, noCache, (req, res) => res.send())
    await request(app).get(route)
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })

})