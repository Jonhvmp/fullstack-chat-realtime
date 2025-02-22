import { IUser } from '../models/user.model';

declare global {
  namespace Express {
    // estender pois o passaport já tem uma interface User
    interface User extends IUser {}

    interface Request {
      user?: IUser; // qlqr cs update para mongoose com typeof User
    }
  }
}
