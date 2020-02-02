import { ApolloError } from 'apollo-server';
import { QueryCampaignArgs } from 'src/schema';
import models, { Campaign } from '../..//models';

const getCampaignDetails = async (parent: null, { id }: QueryCampaignArgs): Promise<Campaign> => {
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
};

const listCampaignSummaries = async (): Promise<Campaign[]> => {
  return await models.campaign.find().populate('dungeonMaster players');
};

export default {
  campaign: getCampaignDetails,
  campaigns: listCampaignSummaries,
};
