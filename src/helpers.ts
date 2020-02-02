import { Context } from './context';

export type Resolver<ReturnType, Args extends object = {}> = (
  parent: null,
  args: Args,
  context: Context,
  info: any
) => Promise<ReturnType>;

export type MutationResolver<ReturnType, Args extends object> = Resolver<
  MutationResponse<ReturnType>,
  Args
>;

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
