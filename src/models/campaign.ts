import mongoose from 'mongoose';
import { User, modelName as userModalName } from './user';

export interface Campaign extends mongoose.Document {
  name: string;
  dungeonMaster: User;
  players: User[];
}

export const modelName = 'campaign';

const campaignSchema = new mongoose.Schema<Campaign>({
  name: {
    type: String,
    required: true,
  },
  dungeonMaster: {
    type: String,
    required: true,
  },
  players: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: userModalName,
    required: true,
  },
});

const campaign = mongoose.model<Campaign>(modelName, campaignSchema);


export default campaign;
