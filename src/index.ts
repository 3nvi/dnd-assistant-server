import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import { merge } from 'lodash';
import Date from './scalars/Date';
import context from './context';
import { typeDefs as rootTypeDefs } from './schema/root';
import { typeDefs as userTypeDefs, queries as userQueries } from './schema/user';
import {
  typeDefs as campaignTypeDefs,
  queries as campaignQueries,
  mutations as campaignMutations,
} from './schema/campaign';

const typeDefs = [rootTypeDefs, userTypeDefs, campaignTypeDefs];
const resolvers = {
  Date,
  Query: merge(campaignQueries, userQueries),
  Mutation: merge(campaignMutations),
  MutationResponse: {
    __resolveType: (): null => null,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
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
