import { 
  loginPath, 
  signUpPath, 
  surveyIdPath, 
  surveyPath 
} from './paths/'

export const paths = {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyIdPath
}