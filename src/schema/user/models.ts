import mongoose from 'mongoose';
import { CampaignDocument } from '../campaign';

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  sub: string;
  image?: string;
  campaigns: CampaignDocument[];
}

const userSchema = new mongoose.Schema<UserDocument>({
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
      ref: 'campaign',
      required: false,
    },
  ],
});

export const userModel = mongoose.model<UserDocument>('user', userSchema);
