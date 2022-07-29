import { 
  Controller, 
  LoadSurveyById, 
  HttpRequest, 
  HttpResponse, 
  SurveyModel, 
  forbidden, 
  noContent,
  serverError,
  InvalidParamError 
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  
  constructor(private readonly loadSurveyById: LoadSurveyById){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const { answer } = httpRequest.body

    try {
      const survey: SurveyModel = await this.loadSurveyById.loadById(surveyId)
      if (!survey || !survey?.answers) return forbidden(new InvalidParamError('surveyId'))
      const answers = survey.answers.map(reply => reply.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
    } catch (error: any) {
      return serverError(error)
    }
    return noContent()
  }
  
}