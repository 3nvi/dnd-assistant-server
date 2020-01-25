export class MutationResponse<T extends {}> {
  constructor(data: T, code: string, message: string) {
    return {
      ...(data || {}),
      code,
      message,
      success: true,
    };
  }
}
