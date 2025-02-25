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

ChatSchema.pre('deleteOne', { document: true, query: false }, async function() {
  await mongoose.model('Message').deleteMany({ chat: this._id });
});

ChatSchema.pre('deleteMany', async function(next) {
  const chats = await this.model.find(this.getFilter());
  const chatIds = chats.map(chat => chat._id);

  await mongoose.model('Message').deleteMany({ chat: { $in: chatIds } });
  next();
});

export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);
