import {
  badRequest, 
  unauthorized, 
  serverError, 
  notFound,
  forbidden
} from './components/'

export const components = {
  securitySchemes: {
    apiKeyAuth: { $ref: '#/schemas/apiAuth' }
  },
  badRequest, 
  unauthorized,
  notFound,
  serverError,
  forbidden
} 