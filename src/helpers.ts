export class MutationResponse<T extends {} = {}> {
  constructor(code: string, message: string, data?: T) {
    return {
      ...(data || {}),
      code,
      message,
      success: true,
    };
  }
}
