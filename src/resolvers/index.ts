import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers = {
    Query: {
        me: async (_: any, args: any, { user }: { user: any }) => {
            if (!user) throw new AuthenticationError('You are not authenticated');
            return await User.findById(user.id);
        },
    },
    Mutation: {
        register: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error('User already exists');

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, email, password: hashedPassword });
            await user.save();

            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
            return { token, user };
        },
        login: async (_: any, { email, password }: { email: string, password: string }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid password');

            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
            return { token, user };
        },
    },
};
