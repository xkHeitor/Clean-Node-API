export const surveyPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'Get all surveys',
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Survey'],
    summary: 'POST create a surveys',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams'
          }
        } 
      }
    },
    responses: {
      204: {
        description: 'OK'
      },
      400: {
        $ref: '#/components/badRequest'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}