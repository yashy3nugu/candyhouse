import mongoose from "mongoose";
import type { ReturnModelType } from "@typegoose/typegoose";
import {
  prop,
  modelOptions,
  getModelForClass,
  pre,
} from "@typegoose/typegoose";
import { Role } from "@/utils/types/user";
import bcrypt from "bcryptjs";

export class User {
  readonly _id!: string;

  @prop({
    required: [true, "User must provide their name"],
    trim: true,
    lowercase: true,
    type: String,
  })
  name!: string;

  @prop({
    required: [true, "User must have a password"],
    minlength: [6, "Password must contain atleast 6 characters"],
    select: false,
    type: String,
  })
  password!: string;

  @prop({
    required: [true, "User must provide their email address"],
    unique: true,
    lowercase: true,
    type: String,
  })
  email!: string;

  @prop({
    enum: Role,
    default: Role.User,
  })
  role!: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  public async checkPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  public async hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 12);
  }
}

export const UserModel = getModelForClass(User);


// const UserModel = getModelForClass(User);


