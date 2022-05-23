import { Controller } from '../../presentation/protocols'
import { HttpRequest, HttpResponse } from './../../presentation/protocols/http'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'HeyThor'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

const makeSut = (): SutTypes => {
 
  const controllerStub: Controller = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return { controllerStub, sut }
}

describe('Log Controller Decorator', () => {

  test('Should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        nome: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller  ', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        nome: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'HeyThor'
      }
    })
  })

})