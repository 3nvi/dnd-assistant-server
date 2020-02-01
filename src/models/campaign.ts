import mongoose from 'mongoose';
import userModel, { User, userModelName } from './user';

export interface Campaign extends mongoose.Document {
  name: string;
  dungeonMaster: User;
  players: User[];
  createdAt: string;
  updatedAt: string;
}

export const campaignModelName = 'campaign';

const campaignSchema = new mongoose.Schema<Campaign>(
  {
    name: {
      type: String,
      required: true,
    },
    dungeonMaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModelName,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModelName,
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

const campaign = mongoose.model<Campaign>(campaignModelName, campaignSchema);

export default campaign;
