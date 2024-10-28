import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const checkAuth = (req: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AuthenticationError('Authorization header must be provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AuthenticationError('Authorization token must be provided');
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        return user;
    } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
    }
};
