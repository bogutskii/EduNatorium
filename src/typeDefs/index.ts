// typeDefs/index.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        createdAt: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
    }
`;
