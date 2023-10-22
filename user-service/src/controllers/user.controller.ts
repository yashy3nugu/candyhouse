import { UserModel } from "../models/user.model";
import { ExpressResponse } from "../utils/types/express";
import { Role } from "../utils/types/user";
import * as jwt from "../lib/jwt";

export const signup: ExpressResponse = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if a user with the same name already exists
    const existingUser = await UserModel.findOne({ name });

    if (existingUser) {
      return res.status(400).json({
        message: "User with name already exists",
      });
    }

    // createCookie(user._id, req, res);

    const user = await UserModel.create({
      name,
      email,
      password,
      role,
    });

    const token = jwt.signToken({ user });

    res.status(201).json({
      token,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};
