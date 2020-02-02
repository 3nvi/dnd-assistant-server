/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { campaignModel } from './models';
import { MutationCreateCampaignArgs, MutationUpdateCampaignArgs } from '../../schema';

// Creates a basic campaign
export const createCampaign = async ({
  name,
  dungeonMaster,
  players,
}: MutationCreateCampaignArgs) => {
  const campaign = await campaignModel.create({ name, dungeonMaster, players });
  return campaign.populate('dungeonMaster players').execPopulate();
};

// deletes a single campaign from the DB
export const deleteCampaignById = (id: string) => campaignModel.findOneAndDelete({ _id: id });

// fetches a single campaign from the DB
export const getCampaignById = (id: string) =>
  campaignModel.findById(id).populate('dungeonMaster players');

// fetches all the campaigns of the user from the DB
export const getAllCampaigns = () => campaignModel.find().populate('dungeonMaster players');

// updates the core/basic details of a campaign
export const updateCampaignDetailsById = async (
  id: string,
  { name, players }: Partial<MutationUpdateCampaignArgs>
) => {
  const campaign = await getCampaignById(id);
  if (!campaign) {
    throw new Error('Invalid Campaign Id');
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
    throw new Error(err.message);
  }

  return campaign.populate('dungeonMaster players').execPopulate();
};
