import User from '../models/User';
import Post from '../models/Post';

export const resolvers = {
    Query: {
        users: async () => await User.find(),
        user: async (_: any, { id }: { id: string }) => await User.findById(id),
        posts: async () => await Post.find().populate('author'),
    },

    Mutation: {
        createUser: async (_: any, { name, email, password, role = 'student' }: { name: string; email: string; password: string; role?: string }) => {
            const user = new User({
                name,
                email,
                password,
                role,
                createdAt: new Date().toISOString(),
            });
            return await user.save();
        },
        createPost: async (_: any, { title, content, authorId }: { title: string; content: string; authorId: string }) => {
            const post = new Post({ title, content, author: authorId });
            return await post.save();
        },
    },

    Post: {
        author: async (post: any) => await User.findById(post.author),
    },
};
