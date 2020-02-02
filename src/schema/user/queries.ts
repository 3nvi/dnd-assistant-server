import models, { campaignModelName, User } from '../../models';

const listUserSummaries = async (): Promise<User[]> => {
  return await models.user.find().populate({
    path: 'campaigns',
    model: campaignModelName,
  });
};

export default {
  users: listUserSummaries,
};
