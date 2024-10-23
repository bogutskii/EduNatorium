import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

dotenv.config();

const startServer = async () => {
    try {
        // Использование переменной окружения для подключения к MongoDB
        const mongoUri = process.env.MONGO_URI as string;
        const port = process.env.PORT || 4000;

        //MongoDB
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected to Atlas');

        // Apollo Server
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => ({ req }), // Для аутентификации
        });

        // Запуск сервера
        server.listen({ port }).then(({ url }) => {
            console.log(`🚀 Server ready at ${url}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

startServer();
