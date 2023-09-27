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
import { Photo } from "./photo.model";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete ret.password;

        return ret;
      },
      versionKey: false,
    },
  },
})
@pre<User>("save", function (next) {
  if (!this.isNew && !this.isModified("password")) {
    return next();
  }

  this.password = this.hashPassword(this.password);
  next();
})
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
    type: String,
  })
  role!: string;

  @prop({
    type: Photo,
  })
  photo?: Photo;

  @prop({
    default: 0,
    type: Number,
  })
  balance!: number;

  @prop({
    default: 0,
    type: Number,
  })
  totalRedeemedCoins!: number;

  @prop({
    default: 0,
    type: Number,
  })
  totalEarnedCoins!: number;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;

  public checkPassword(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  public hashPassword(plain: string): string {
    return bcrypt.hashSync(plain, 12);
  }
}

export const UserModel = getModelForClass(User);

// const UserModel = getModelForClass(User);
