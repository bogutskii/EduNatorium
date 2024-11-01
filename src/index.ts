import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import jwt from 'jsonwebtoken';
import User from './models/User'; // Make sure to import the User model

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

const startServer = async () => {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            console.log('Server side token:', token);
            if (token) {
                try {
                    const decodedToken: any = jwt.verify(token, JWT_SECRET);
                    const user = await User.findById(decodedToken.id); // Now User is defined
                    return { user };
                } catch (err) {
                    console.error('Invalid token:', err);
                }
            }
            return {};
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }

    const port = process.env.PORT || 4000;
    app.listen({ port }, () =>
        console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
};

startServer().catch((err) => {
    console.error('Error starting the server:', err);
});
