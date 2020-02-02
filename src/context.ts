import { AuthenticationError } from 'apollo-server';
import express from 'express';
import { UserDocument, userModel } from './schema/user';
import { authClient } from './auth';

export type Context = { user: UserDocument };

const getContext = async ({ req }: { req: express.Request }): Promise<Context | null> => {
  // When introspection queries are enabled (i.e. NODE_ENV !== "production"), allow schema queries
  // without providing a JWT token
  if (req.body.query.trim().startsWith('query Introspection')) {
    return null;
  }

  // get the user token from the Authorization header (defined as "Bearer {TOKEN}")
  const token = req.headers.authorization?.split(' ')[1] || '';
  if (!token) {
    throw new AuthenticationError('No authorization token provided');
  }
  // try to retrieve a user with the token
  const authUser = await authClient.getProfile(token);
  if (!authUser) {
    throw new AuthenticationError('Invalid authorization token provided');
  }

  const user = await userModel.findOne({ sub: authUser.sub }).select('_id');
  if (!user) {
    throw new AuthenticationError(
      'Authorization token is valid, but no user association was found'
    );
  }

  return { user };
};

export default getContext;
