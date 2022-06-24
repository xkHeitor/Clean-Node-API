import { resolve } from 'path'
import { DbAddSurvey } from './add-survey'
import { AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'

describe('DbAddSurvey UseCase', () => {

  const makeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  })

  const makeAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        return new Promise(resolve => resolve())
      }
    }
    return new AddSurveyRepositoryStub()
  }

  interface sutTypes {
    sut: DbAddSurvey,
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeSut = (): sutTypes => {
    const addSurveyRepositoryStub: AddSurveyRepository = makeAddSurveyRepository()
    const sut: DbAddSurvey = new DbAddSurvey(addSurveyRepositoryStub)
    return { sut, addSurveyRepositoryStub }
  }

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData: AddSurveyModel = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

})