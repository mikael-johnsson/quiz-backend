import { UserDTO } from "../../models/User";

// this adds the user property to all express requests in the app
declare global {
  namespace Express {
    interface Request {
      user?: UserDTO;
    }
  }
}

export {};
