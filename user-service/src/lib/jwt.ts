import { User } from "../models/user.model";
import * as jwt from "jsonwebtoken";


export const signToken = (
  payload: { user: User },
) => {
  const token = jwt.sign({ _id: payload.user._id }, process.env.JWT_SECRET!, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN!) * 60 * 60,
  });
  return token
};

export const decodeToken = (token: string) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  return payload;
};
