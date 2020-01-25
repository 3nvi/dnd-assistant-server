import mongoose from 'mongoose';
import { Campaign, campaignModelName } from './campaign';

export interface User extends mongoose.Document {
  name: string;
  email: string;
  sub: string;
  image?: string;
  campaigns: Campaign[];
}

export const userModelName = 'user';

const userSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  campaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: campaignModelName,
      required: false,
    },
  ],
});

const user = mongoose.model<User>(userModelName, userSchema);

export default user;
