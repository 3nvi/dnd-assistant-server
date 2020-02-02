import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Query {
    # Placeholder since Query can never be an empty type
    _placeholder: String
  }

  type Mutation {
    # Placeholder since Mutation can never be an empty type
    _placeholder: String
  }
`;

export default typeDefs;
