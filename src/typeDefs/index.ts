// typeDefs/index.ts
import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        password: String!
        createdAt: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
        createdAt: String!
    }

    type Query {
        users: [User!]
        user(id: ID!): User
        posts: [Post!]
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!, role: String): User!
        createPost(title: String!, content: String!, authorId: ID!): Post!
    }
`;
