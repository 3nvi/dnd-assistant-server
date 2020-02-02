import {
  MutationCreateCampaignArgs,
  MutationDeleteCampaignArgs,
  MutationUpdateCampaignArgs,
} from 'src/schema';
import { UserInputError, ApolloError } from 'apollo-server';
import { MutationResponse } from '../../helpers';
import models, { Campaign } from '../../models';

const createCampaign = async (
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
};
const updateCampaign = async (
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
};

const deleteCampaign = async (
  parent: null,
  { id }: MutationDeleteCampaignArgs
): Promise<MutationResponse<{ campaign: Campaign }>> => {
  try {
    await models.campaign.findOneAndDelete({ _id: id });
    return new MutationResponse('CampaignDeletionSuccess', 'Campaign deleted successfully');
  } catch (err) {
    return new ApolloError(err.message, 'DATABASE_ERROR');
  }
};

export default {
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
