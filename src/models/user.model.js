import { model, Schema } from 'mongoose'
const COLLECTION_NAME = 'Users'

const userSchema = new Schema(
    {

    }
);

const userModel = model(COLLECTION_NAME, userSchema);

export default userModel