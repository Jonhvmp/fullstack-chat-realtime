import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;    // Chat
  sender: mongoose.Types.ObjectId;  // User
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);
