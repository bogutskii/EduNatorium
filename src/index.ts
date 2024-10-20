import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const startServer = async () => {
    try {
        // MongoDB
        await mongoose.connect('mongodb://localhost:27017/EduNatorium');
        console.log('MongoDB connected');

        // Apollo Server
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({ req }), // Для аутентификации
        });

        // run
        server.listen({ port: 4000 }).then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
