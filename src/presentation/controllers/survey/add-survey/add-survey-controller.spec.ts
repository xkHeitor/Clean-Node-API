import { HttpRequest, Validation } from './add-survey-controller-protocols'
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

  const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error|undefined {
        return undefined
      }
    }
    return new ValidationStub()
  }

  interface sutType {
    sut: AddSurveyController,
    validationStub: Validation
  }

  const makeSut = (): sutType => {
    const validationStub: Validation = makeValidationStub()
    const sut: AddSurveyController = new AddSurveyController(validationStub)
    return { sut, validationStub }
  }

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() 
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

})