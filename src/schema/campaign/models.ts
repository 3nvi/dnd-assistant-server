import mongoose from 'mongoose';
import { userModel, UserDocument } from '../user';

export interface CampaignDocument extends mongoose.Document {
  name: string;
  dungeonMaster: UserDocument;
  players: UserDocument[];
  createdAt: string;
  updatedAt: string;
}
const campaignSchema = new mongoose.Schema<CampaignDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    dungeonMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Makes sure to add the campaigns to the associated users when a campaign gets created
 */
campaignSchema.pre('save', async function(next) {
  if (this.isNew) {
    const campaignToBeSaved = this.toObject();
    const userIdsToAddCampaignTo = [...campaignToBeSaved.players, campaignToBeSaved.dungeonMaster];

    // TODO: use `bulkWrite` operations for better performance. Postponed for the sake of progress

    const users = await userModel.find({
      _id: {
        $in: userIdsToAddCampaignTo.map(mongoose.Types.ObjectId),
      },
    });

    const userUpdatePromises = users.map(user => {
      user.campaigns.push(campaignToBeSaved._id);
      return user.save();
    });

    await Promise.all(userUpdatePromises);
  }

  next();
});

export const campaignModel = mongoose.model<CampaignDocument>('campaign', campaignSchema);
