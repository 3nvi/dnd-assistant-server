/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { userModel } from './models';

export const getAllUsers = async () =>
  userModel.find().populate({
    path: 'campaigns',
    model: 'campaign',
  });
