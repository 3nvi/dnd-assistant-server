import { ApolloGuard } from '../typings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAuthenticated: ApolloGuard<{ key: any }, any> = next => (root, args, context, info) => {
  if (!context.currentUser) {
    throw new Error(`Unauthenticated!`);
  }

  return next(root, args, context, info);
};

export default isAuthenticated;
