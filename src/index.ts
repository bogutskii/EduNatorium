import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET:', JWT_SECRET);

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const startServer = async () => {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        context: ({ req }) => {
            const token = req.headers.authorization?.split(' ')[1];
            console.log('Server side token:', token);
            if (token) {
                try {
                    const user = jwt.verify(token, JWT_SECRET);
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

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('Mongo URI not defined in environment variables');
    }

    try {
        await mongoose.connect(mongoUri);
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
