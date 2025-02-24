import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChat extends Document {
  members: mongoose.Types.ObjectId[];
}

const ChatSchema = new Schema<IChat>(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
);


export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);
