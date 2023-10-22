import { UserModel } from "../models/user.model";
import { ExpressResponse } from "../utils/types/express";
import { Role } from "../utils/types/user";
import * as jwt from "../lib/jwt";
import { loginInputSchema, registerInputSchema } from "../utils/schemas/user";
import { z } from "zod";

export const signup: ExpressResponse = async (req, res, next) => {
  try {
    const { name, email, password, role }: z.infer<typeof registerInputSchema> = req.body;

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

export const login: ExpressResponse = async (req, res, next) => {
  try {
    const {  email, password,  }: z.infer<typeof loginInputSchema> =
      req.body;

    // Check if a user with the same name already exists
    const user = await UserModel.findOne({
      email,
    }).select("+password");

    if (!user || !user.checkPassword(password, user.password)) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.signToken({ user });

    res.status(201).json({
      token,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};
