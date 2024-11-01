// typeDefs/index.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        bio: String
        location: String
        phoneNumber: String
        createdAt: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!     
        createdAt: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        users: [User!]
        user(id: ID!): User
        posts: [Post!]     
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!, role: String): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        updateUser(id: ID!, bio: String, location: String, phoneNumber: String): User!
        createPost(title: String!, content: String!, authorId: ID!): Post!   # Mutation to create a new post
    }
`;
