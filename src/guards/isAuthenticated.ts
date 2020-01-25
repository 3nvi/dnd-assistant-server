import { AuthenticationError } from 'apollo-server';
import { ApolloGuard } from '../typings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAuthenticated: ApolloGuard<{ key: any }, any> = next => (
  root,
  args,
  context,
  info
): typeof next => {
  if (!context.currentUser) {
    throw new AuthenticationError('Not authenticated');
  }

  return next(root, args, context, info);
};

export default isAuthenticated;
