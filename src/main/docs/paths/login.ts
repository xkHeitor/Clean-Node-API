export const loginPath = {
  post: { 
    tags: ['Login'],
    summary: 'API to user authentication',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login'
          }
        } 
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}