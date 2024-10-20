import User from '../models/User';
import Room from '../models/Room';

interface CreateUserArgs {
    username: string;
    email: string;
    password: string;
}

interface CreateRoomArgs {
    name: string;
}

const resolvers = {
    Query: {
        users: async () => await User.find(),
        rooms: async () => await Room.find().populate('users'),
    },
    Mutation: {
        createUser: async (_: any, { username, email, password }: CreateUserArgs) => {
            const user = new User({ username, email, password });
            await user.save();
            return user;
        },
        createRoom: async (_: any, { name }: CreateRoomArgs) => {
            const room = new Room({ name });
            await room.save();
            return room;
        },
    },
};

export default resolvers;
