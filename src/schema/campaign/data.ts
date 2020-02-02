/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { campaignModel } from './models';
import { MutationCreateCampaignArgs, MutationUpdateCampaignArgs } from 'src/typings';
import { UserDocument } from '../user';

// Creates a basic campaign
export const createCampaign = async ({
  name,
  dungeonMaster,
  players,
  createdBy,
}: MutationCreateCampaignArgs & { createdBy: UserDocument['_id'] }) => {
  const campaign = await campaignModel.create({ name, dungeonMaster, players, createdBy });
  return campaign.populate('dungeonMaster players').execPopulate();
};

// Gets the ID of the owner of the campaign
export const getCampaignOwnerId = async (id: string) => {
  const campaign = await campaignModel.findById(id).select('createdBy');
  return campaign?.createdBy;
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
  const campaign = await campaignModel.findOneAndUpdate(
    { _id: id },
    { name, players },
    { new: true }
  );

  if (!campaign) {
    throw new Error('NOT_FOUND');
  }

  return await campaign.populate('dungeonMaster players').execPopulate();
};
