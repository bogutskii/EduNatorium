import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';
import Post from '../models/Post';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const resolvers = {
    Query: {
        users: async (_: any, __: any, { user }: any) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return await User.find();
        },
        user: async (_: any, { id }: { id: string }, { user }: any) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return await User.findById(id);
        },
        posts: async () => await Post.find().populate('author'),
    },

    Mutation: {
        createUser: async (_: any, { name, email, password, role = 'student' }: { name: string; email: string; password: string; role?: string }) => {
            const user = new User({
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString(),
            });
            return await user.save();
        },

        login: async (_: any, { email, password }: { email: string; password: string }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('User not found');
            }

            if (user.password !== password) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

            return { token, user };
        },

        createPost: async (_: any, { title, content, authorId }: { title: string; content: string; authorId: string }) => {
            const post = new Post({ title, content, author: authorId });
            return await post.save();
        },
    },

    Post: {
        author: async (post: any) => await User.findById(post.author),
    },
};
