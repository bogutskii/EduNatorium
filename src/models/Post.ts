// models/Post.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
    title: string;
    content: string;
    author: Schema.Types.ObjectId;
    createdAt: string;
}

const PostSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: String, default: new Date().toISOString() },
});

export default mongoose.model<IPost>('Post', PostSchema);
