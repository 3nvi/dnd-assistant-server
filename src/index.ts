import { ApolloServer, gql, UserInputError, ApolloError, AuthenticationError } from 'apollo-server';
import mongoose from 'mongoose';
import dateScalar from './scalars/Date';
import { authClient } from './auth';
import { MutationResponse } from './helpers';
import models, { User, Campaign, campaignModelName } from './models';
import rootTypeDefs from './schema/root';
import userTypeDefs from './schema/user';
import campaignTypeDefs from './schema/campaign';
import {
  MutationCreateCampaignArgs,
  MutationDeleteCampaignArgs,
  MutationUpdateCampaignArgs,
  QueryCampaignArgs,
} from './schema';

const typeDefs = [rootTypeDefs, userTypeDefs, campaignTypeDefs];

const resolvers = {
  Date: dateScalar,
  Query: {
    campaign: async (parent: null, { id }: QueryCampaignArgs): Promise<Campaign> => {
      let campaign;
      try {
        campaign = await models.campaign.findById(id).populate('dungeonMaster players');
      } catch (err) {
        throw new ApolloError(err.message);
      }

      if (!campaign) {
        throw new ApolloError('Invalid Campaign Id', 'NOT_FOUND', { id });
      }
      return campaign;
    },
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

        return new MutationResponse('CampaignCreationSuccess', 'Campaign created successfully', {
          campaign,
        });
      } catch (err) {
        return new ApolloError(err.message, 'DATABASE_ERROR');
      }
    },
    updateCampaign: async (
      parent: null,
      { id, name, players }: MutationUpdateCampaignArgs
    ): Promise<MutationResponse<{ campaign: Campaign }>> => {
      let campaign = await models.campaign.findById(id);
      if (!campaign) {
        return new UserInputError('Invalid Campaign Id');
      }

      if (name) {
        campaign.name = name;
      }
      if (players) {
        // @ts-ignore
        campaign.players = players;
      }

      try {
        campaign.save();
      } catch (err) {
        return new UserInputError(err.message);
      }

      campaign = await campaign.populate('dungeonMaster players').execPopulate();
      return new MutationResponse('CampaignUpdateSuccess', 'Campaign updates successfully', {
        campaign,
      });
    },
    deleteCampaign: async (
      parent: null,
      { id }: MutationDeleteCampaignArgs
    ): Promise<MutationResponse<{ campaign: Campaign }>> => {
      try {
        await models.campaign.findOneAndDelete({ _id: id });
        return new MutationResponse('CampaignDeletionSuccess', 'Campaign deleted successfully');
      } catch (err) {
        return new ApolloError(err.message, 'DATABASE_ERROR');
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
