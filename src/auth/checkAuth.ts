import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const checkAuth = (req: any) => {
    const operationName = req.body.operationName;
    if (operationName === 'register' || operationName === 'login') {
        return {};
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AuthenticationError('Authorization header must be provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AuthenticationError('Authorization token must be provided');
    }

    try {
        // Верификация токена с использованием JWT_SECRET
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
    }
};
