import {
  Campaign,
  MutationCreateCampaignArgs,
  MutationDeleteCampaignArgs,
  MutationUpdateCampaignArgs,
} from 'src/typings';
import { UserInputError, ApolloError, ForbiddenError } from 'apollo-server';
import { MutationResponse, MutationResolver } from '../../helpers';
import {
  createCampaign,
  deleteCampaignById,
  getCampaignById,
  updateCampaignDetailsById,
} from './data';

const createCampaignResolver: MutationResolver<
  { campaign: Campaign },
  MutationCreateCampaignArgs
> = async (parent, { name, dungeonMaster, players }, { user }) => {
  if (players.includes(dungeonMaster)) {
    throw new UserInputError("The DM can't be a player");
  }

  try {
    const campaign = await createCampaign({ name, dungeonMaster, players, createdBy: user._id });
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
> = async (parent, { id, name, players }, { user }) => {
  let campaign = await getCampaignById(id);
  if (!campaign) {
    throw new UserInputError('Invalid Campaign Id');
  }

  if (!campaign.createdBy.equals(user._id)) {
    throw new ForbiddenError('Only the owner of a campaign can modify it');
  }

  try {
    campaign = await updateCampaignDetailsById(id, { name, players });
    return new MutationResponse('CampaignUpdateSuccess', 'Campaign updates successfully', {
      campaign,
    });
  } catch (err) {
    throw new UserInputError(err.message);
  }
};

const deleteCampaignResolver: MutationResolver<{}, MutationDeleteCampaignArgs> = async (
  parent,
  { id },
  { user }
) => {
  const campaign = await getCampaignById(id);
  if (!campaign) {
    throw new UserInputError('Invalid Campaign Id');
  }

  if (!campaign.createdBy.equals(user._id)) {
    throw new ForbiddenError('Only the owner of a campaign can delete it');
  }

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
