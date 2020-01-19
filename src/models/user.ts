import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  name: string;
  email: string;
  sub: string;
  image?: string;
}

export const modelName = 'user';

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
});

const user = mongoose.model<User>(modelName, userSchema);

export default user;
