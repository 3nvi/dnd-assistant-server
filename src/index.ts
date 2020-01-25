import { ApolloServer, gql, ValidationError, UserInputError } from 'apollo-server/dist';
import mongoose from 'mongoose';
import dateScalar from './scalars/Date';
import { authClient } from './auth';
import { MutationResponse } from './helpers';
import models, { User, Campaign, campaignModelName } from './models';
import { MutationCreateCampaignArgs } from './schema';

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
    campaigns: [Campaign]!
  }

  type Campaign {
    _id: ID!
    name: String!
    dungeonMaster: User!
    players: [User!]!
  }

  type CampaignCreationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    campaign: Campaign
  }

  type Query {
    campaigns: [Campaign]!
    users: [User]!
  }

  type Mutation {
    createCampaign(
      name: String!
      dungeonMaster: String!
      players: [String]!
    ): CampaignCreationResponse!
  }
`;

const resolvers = {
  Date: dateScalar,
  Query: {
    campaigns: async (): Promise<Campaign[]> => {
      return await models.campaign.find().populate('dungeonMaster players');
    },
    users: async (): Promise<User[]> => {
      return await models.user.find().populate({
        path: 'campaigns',
        model: campaignModelName,
      });
    },
  },
  Mutation: {
    createCampaign: async (
      parent: null,
      { name, dungeonMaster, players }: MutationCreateCampaignArgs
    ): Promise<MutationResponse<{ campaign: Campaign }>> => {
      if (players.includes(dungeonMaster)) {
        throw new UserInputError("The DM can't be a player");
      }

      try {
        let campaign = await models.campaign.create({ name, dungeonMaster, players });
        campaign = await campaign.populate('dungeonMaster players').execPopulate();

        return new MutationResponse(
          { campaign },
          'CampaignCreationSuccess',
          'Campaign created successfully'
        );
      } catch (err) {
        console.log(err);
        return new ValidationError(err.message);
      }
    },
  },
  MutationResponse: {
    __resolveType: (): null => null,
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
