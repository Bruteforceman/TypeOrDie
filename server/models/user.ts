import { model, Schema } from 'mongoose'; 

// 1. Create an interface representing a document in MongoDB.
interface IUser {
    username: string,
    password: string,
    email: string,
    top_score: number
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    top_score: { type: Number }
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);

export default User;