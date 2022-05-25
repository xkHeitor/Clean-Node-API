import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpResponse, HttpRequest } from './../../protocols'
import { Controller } from './../../protocols/controller'
import { LoginController } from './login'

describe('Login Controller', () => {

  test('Should return 400 if no email is provided', async () => {
    const sut: Controller = new LoginController()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

})