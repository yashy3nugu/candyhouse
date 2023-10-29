import { UserModel } from "../models/user.model";
import { ExpressResponse } from "../utils/types/express";
import { Role } from "../utils/types/user";
import * as jwt from "../lib/jwt";
import { loginInputSchema, registerInputSchema } from "../utils/schemas/user";
import { z } from "zod";
import { producer } from "../lib/kafka";
import { v4 as uuidv4 } from "uuid";


export const signup: ExpressResponse = async (req, res, next) => {
  try {
    const { name, email, password, role }: z.infer<typeof registerInputSchema> =
      req.body;

    // Check if a user with the same name already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with email already exists",
      });
    }

    // createCookie(user._id, req, res);

    const user = await UserModel.create({
      name,
      email,
      password,
      role,
      appId: uuidv4()
    });

    const token = jwt.signToken({ user });
    const message = JSON.stringify(user);
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [{ value: message, key: user.appId }],
    });

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
    const { email, password }: z.infer<typeof loginInputSchema> = req.body;

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

export const getUser: ExpressResponse = async (req, res, next) => {
  try {
    const token = req.headers.authorization!.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // Verify the token
    const decodedToken = jwt.decodeToken(token) as any;

    if (!decodedToken) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // Assuming that `decodedToken` contains the user data or user ID
    const userId = decodedToken.user._id;

    // Retrieve user data from the database using the user ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Return user data in the response
    res.status(200).json({
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const kafka: ExpressResponse = async (req, res, next) => {
  try {
    await producer.connect();
    await producer.send({
      topic: "test-topic",
      messages: [{ value: "test" }],
    });
    res.send("/kafka");
  } catch (err: any) {
    next(err);
  }
};
