export const errorComponent = (description: string): object => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  } 
})