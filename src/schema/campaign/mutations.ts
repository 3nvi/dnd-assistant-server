import {
  Campaign,
  MutationCreateCampaignArgs,
  MutationDeleteCampaignArgs,
  MutationUpdateCampaignArgs,
} from 'src/schema';
import { UserInputError, ApolloError } from 'apollo-server';
import { MutationResponse } from '../../helpers';
import { MutationResolver } from 'src/helpers';
import { createCampaign, deleteCampaignById, updateCampaignDetailsById } from './data';

const createCampaignResolver: MutationResolver<
  { campaign: Campaign },
  MutationCreateCampaignArgs
> = async (parent, { name, dungeonMaster, players }) => {
  if (players.includes(dungeonMaster)) {
    throw new UserInputError("The DM can't be a player");
  }

  try {
    const campaign = await createCampaign({ name, dungeonMaster, players });
    return new MutationResponse('CampaignCreationSuccess', 'Campaign created successfully', {
      campaign,
    });
  } catch (err) {
    return new ApolloError(err.message, 'DATABASE_ERROR');
  }
};
const updateCampaignResolver: MutationResolver<
  { campaign: Campaign },
  MutationUpdateCampaignArgs
> = async (parent, { id, name, players }) => {
  try {
    const campaign = await updateCampaignDetailsById(id, { name, players });
    return new MutationResponse('CampaignUpdateSuccess', 'Campaign updates successfully', {
      campaign,
    });
  } catch (err) {
    throw new UserInputError(err.message);
  }
};

const deleteCampaignResolver: MutationResolver<{}, MutationDeleteCampaignArgs> = async (
  parent,
  { id }
) => {
  try {
    await deleteCampaignById(id);
    return new MutationResponse('CampaignDeletionSuccess', 'Campaign deleted successfully');
  } catch (err) {
    throw new ApolloError(err.message, 'DATABASE_ERROR');
  }
};

export default {
  createCampaign: createCampaignResolver,
  updateCampaign: updateCampaignResolver,
  deleteCampaign: deleteCampaignResolver,
};
