import { ApolloServer, gql } from 'apollo-server';
import { User } from 'auth0';
import mongoose from 'mongoose';
import dateScalar from './scalars/Date';
import { authClient } from './auth';
import models, { Campaign } from './models';

const typeDefs = gql`
  scalar Date

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    image: String
  }

  type Campaign {
    _id: ID!
    name: String!
    dungeonMaster: User!
    players: [User!]!
  }

  type Query {
    campaigns: [Campaign]!
    users: [User]!
  }
`;

const resolvers = {
  Date: dateScalar,
  Query: {
    campaigns: async (): Promise<Campaign[]> => {
      const campaigns = await models.campaign.find({});
      return campaigns;
    },
    users: async (): Promise<User[]> => {
      const users = await models.user.find({});
      return users;
    },
  },
  MutationResponse: {
    __resolveType: () => null,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }): Promise<{ user: User | null; models: typeof models }> => {
    // get the user token from the Authorization header (defined as "Bearer {TOKEN}")
    let user;
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      user = null;
    } else {
      // try to retrieve a user with the token
      user = await authClient.getProfile(token);
    }

    // add the user to the context
    return { user, models };
  },
});

// The `listen` method launches a web server.
server.listen().then(async ({ url }) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/graphql', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log(err.message);
  }
});
