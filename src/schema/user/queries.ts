import { Resolver } from 'src/helpers';
import { User } from 'src/schema';
import { getAllUsers } from './data';

const listUserSummaries: Resolver<User[]> = async () => {
  return await getAllUsers();
};

export default {
  users: listUserSummaries,
};
