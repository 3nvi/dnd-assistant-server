import { gql } from 'apollo-server';

const typeDefs = gql`
  type Campaign {
    _id: ID!
    name: String!
    dungeonMaster: User!
    players: [User!]!
    createdAt: Date!
    updatedAt: Date!
  }

  type CampaignCreationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    campaign: Campaign
  }

  type CampaignUpdateResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    campaign: Campaign
  }

  type CampaignDeletionResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  extend type Query {
    campaign(id: ID!): Campaign
    campaigns: [Campaign!]!
  }

  extend type Mutation {
    createCampaign(
      name: String!
      dungeonMaster: String!
      players: [String!]!
    ): CampaignCreationResponse!

    updateCampaign(id: ID!, name: String, players: [String!]): CampaignCreationResponse!
    deleteCampaign(id: ID!): CampaignDeletionResponse!
  }
`;

export default typeDefs;
