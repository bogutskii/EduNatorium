import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

dotenv.config();

const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI as string;
        console.log('Mongo URI:', mongoUri);
        const port = process.env.PORT || 4000;

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected to Atlas');

        const app = express();

        app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }));

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({ req }),
        });

        await server.start();
        server.applyMiddleware({ app, path: '/graphql' });

        app.listen(port, () => {
            console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

startServer().catch(err => {
    console.error('Error starting server:', err);
});
