import { User } from 'src/typings';
import { Resolver } from 'src/helpers';
import { getAllUsers } from './data';

const listUserSummaries: Resolver<User[]> = async () => {
  return await getAllUsers();
};

export default {
  users: listUserSummaries,
};
