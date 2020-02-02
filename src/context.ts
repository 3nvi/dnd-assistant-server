import { AuthenticationError } from 'apollo-server';
import express from 'express';
import models, { User } from './models';
import { authClient } from './auth';

type Context = (context: { req: express.Request }) => Promise<{ user: User }>;

const getContext: Context = async ({ req }) => {
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

  const user = await models.user.findOne({ sub: authUser.sub }).select('_id');
  if (!user) {
    throw new AuthenticationError(
      'Authorization token is valid, but no user association was found'
    );
  }

  return { user };
};

export default getContext;
