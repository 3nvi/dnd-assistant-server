import { ApolloError } from 'apollo-server';
import { Campaign, QueryCampaignArgs } from 'src/typings';
import { Resolver } from 'src/helpers';
import { getCampaignById, getAllCampaigns } from './data';

const getCampaignDetails: Resolver<Campaign, QueryCampaignArgs> = async (parent: null, { id }) => {
  const campaign = await getCampaignById(id);
  if (!campaign) {
    throw new ApolloError('Invalid Campaign Id', 'NOT_FOUND', { id });
  }
  return campaign;
};

const listCampaignSummaries: Resolver<Campaign[]> = async () => {
  return await getAllCampaigns();
};

export default {
  campaign: getCampaignDetails,
  campaigns: listCampaignSummaries,
};
