import { loginPath, surveyPath } from './paths'
import { 
  accountSchema, 
  errorSchema, 
  loginSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  apiKeyAuthSchema
} from './schemas'
import {
  badRequest, 
  unauthorized, 
  serverError, 
  notFound,
  forbidden
} from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API Enquetes',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' },
    { name: 'Survey' }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema, 
    login: loginSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    apiAuth: apiKeyAuthSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: { $ref: '#/schemas/apiAuth' }
    },
    badRequest, 
    unauthorized,
    notFound,
    serverError,
    forbidden
  }
}