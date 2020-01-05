import { ApolloServer, gql } from 'apollo-server';
import dateScalar from './scalars/Date';
import { authClient } from './auth';
import { User } from 'auth0';

const typeDefs = gql`
  scalar Date

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Campaign {
    name: String
    dungeonMaster: String
    players: [String]
  }

  type Query {
    campaigns: [Campaign]
  }
`;

const campaigns = [
  {
    name: 'Harry Potter and the Chamber of Secrets',
    dungeonMaster: 'J.K. Rowling',
    players: ['Kostas', 'Aggelos', 'Stefanos'],
  },
  {
    name: 'Jurassic Park',
    dungeonMaster: 'Michael Crichton',
    players: ['Kostas', 'Aggelos', 'Stefanos'],
  },
];

const resolvers = {
  Date: dateScalar,
  Query: {
    campaigns: () => campaigns,
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
  context: async ({ req }): Promise<{ user: User | null }> => {
    // get the user token from the Authorization header (defined as "Bearer {TOKEN}")
    const token = req.headers.authorization?.split(' ')[1] || '';
    if (!token) {
      return { user: null };
    }

    // try to retrieve a user with the token
    const user = await authClient.getProfile(token);

    // add the user to the context
    return { user };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
