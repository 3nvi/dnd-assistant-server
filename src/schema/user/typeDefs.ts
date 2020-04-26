import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    image: String
    campaigns: [Campaign]!
  }

  extend type Query {
    listUserSummaries: [User!]!
  }
`;

export default typeDefs;
