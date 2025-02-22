import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAuthProvider {
  provider: string;
  providerId: string;
  profile?: any;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  roles: string[];
  authProviders: IAuthProvider[];
  isActive: boolean;
  lastLogin?: Date;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    password: {
      type: String,
      select: false,
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    authProviders: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
        profile: { type: Schema.Types.Mixed },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>('save', async function (next) {
  try {
    // Só hasheia a senha se foi modificada ou é nova
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password!, salt);
    }
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    console.log('Comparando senha para usuário:', this.email);
    if (!this.password) {
      console.log('Usuário não tem senha definida');
      return false;
    }
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Resultado da comparação de senha:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar senhas:', error);
    return false;
  }
};

// Controla quais campos serão retornados quando o doc for convertido em JSON
UserSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  delete userObj.twoFactorSecret;
  return userObj;
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
