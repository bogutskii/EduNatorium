import { Schema, model } from 'mongoose';

const roomSchema = new Schema({
    name: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Room = model('Room', roomSchema);
export default Room;
