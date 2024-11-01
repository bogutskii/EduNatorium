// src/resolvers/index.ts
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';
import Post from '../models/Post';
import { Context } from '../typeDefs/types';

export const resolvers = {
    Query: {
        me: (_: unknown, __: unknown, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return user;
        },
        users: async (_: unknown, __: unknown, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return User.find();
        },
        user: async (_: unknown, { id }: { id: string }, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return User.findById(id);
        },
        posts: async () => {
            return Post.find().populate('author');
        },
    },
};
