import { gql } from 'apollo-server';

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
    }

    type Room {
        id: ID!
        name: String!
        users: [User!]!
    }

    type Query {
        users: [User!]!
        rooms: [Room!]!
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!): User!
        createRoom(name: String!): Room!
    }
`;

export default typeDefs;
