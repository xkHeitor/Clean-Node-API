import { badRequest, noContent, serverError } from './../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Validation, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  })

  const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error|undefined {
        return undefined
      }
    }
    return new ValidationStub()
  }

  const makeAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (data: AddSurveyModel): Promise<void> {
        return new Promise(resolve => resolve())
      } 
    }
    return new AddSurveyStub()
  }

  interface sutTypes {
    sut: AddSurveyController,
    validationStub: Validation
    addSurveyStub: AddSurvey
  }

  const makeSut = (): sutTypes => {
    const validationStub: Validation = makeValidation()
    const addSurveyStub: AddSurvey = makeAddSurvey()
    const sut: AddSurveyController = new AddSurveyController(validationStub, addSurveyStub)
    return { sut, validationStub, addSurveyStub }
  }

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() 
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const error: Error = new Error()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut() 
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    const error: Error = new Error()
    const errorPromise: Promise<void> = new Promise((resolve, reject) => reject(error))
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(errorPromise)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

})