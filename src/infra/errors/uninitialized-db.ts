export class UninitializedDbError extends Error {
  constructor() {
    super('UninitializedDb');
    this.name = 'UninitializedDbError';
  }
}