import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';
import User from '../models/User';
import Post from '../models/Post'; // Добавляем модель Post
import { UserArgs, LoginArgs, UpdateUserArgs, Context } from '../typeDefs/types';
import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET resolver:'+ JWT_SECRET);
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export const resolvers = {
    Query: {
        me: (_: unknown, __: unknown, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return User.findById(user.id);
        },
        users: (_: unknown, __: unknown, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return User.find();
        },
        user: (_: unknown, { id }: { id: string }, { user }: Context) => {
            if (!user) throw new AuthenticationError('You must be logged in');
            return User.findById(id);
        },
        posts: async () => {
            return Post.find().populate('author');
        },
    },
    Mutation: {
        createUser: async (_: unknown, { name, email, password, role = 'student' }: UserArgs) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new AuthenticationError('User with this email already exists');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                createdAt: new Date().toISOString(),
            });
            await user.save();

            const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            return { token, user };
        },

        login: async (_: unknown, { email, password }: LoginArgs) => {
            const user = await User.findOne({ email });
            if (!user) throw new AuthenticationError('User not found');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new AuthenticationError('Invalid credentials');

            const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            console.log(token, JWT_SECRET);
            return { token, user };
        },

        updateUser: (_: unknown, { id, bio, location, phoneNumber }: UpdateUserArgs, { user }: Context) => {
            if (!user || user.id !== id) throw new AuthenticationError('Unauthorized');

            return User.findByIdAndUpdate(
                id,
                { bio, location, phoneNumber },
                { new: true }
            );
        },

        createPost: async (_: unknown, { title, content, authorId }: { title: string, content: string, authorId: string }) => {
            const post = new Post({
                title,
                content,
                author: authorId,
                createdAt: new Date().toISOString(),
            });
            return await post.save();
        }
    },
    Post: {
        author: async (post: any) => await User.findById(post.author),
    }
};
