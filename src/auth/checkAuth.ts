import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET;

export const checkAuth = (req: any) => {
    const token = req.headers.authorization || '';
    if (!token) throw new AuthenticationError('You must be logged in');

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        return decoded;
    } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
    }
};
