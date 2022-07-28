import { LoadSurveyByIdRepository, SurveyModel } from './load-survey-by-id-protocols'
import { DbLoadSurveyById } from './load-survey-by-id'

import MockDate from 'mockdate'

describe('DbLoadSurveyById', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  const anyId: string = 'any_id'

  const makeFakeSurveys = (): SurveyModel => {
    return {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  }

  const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
    class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
      async loadById(id: string): Promise<SurveyModel> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    return new LoadSurveyByIdRepositoryStub()
  }

  type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepositoryStub()
    const sut: DbLoadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return { sut, loadSurveyByIdRepositoryStub }
  }

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub }: SutTypes = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(anyId)
    expect(loadByIdSpy).toHaveBeenCalledWith(anyId)
  })

  test('Should return Surveys on success', async () => {
    const { sut }: SutTypes = makeSut()
    const survey: SurveyModel = await sut.loadById(anyId)
    expect(survey).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub }: SutTypes = makeSut()
    const error: Error = new Error()
    const errorPromise: Promise<SurveyModel> = new Promise((resolve, reject) => reject(error))
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(errorPromise)
    const promise: Promise<SurveyModel> = sut.loadById(anyId)
    await expect(promise).rejects.toThrow()
  })

})