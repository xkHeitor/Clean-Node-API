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
  }
}