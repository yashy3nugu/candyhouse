import mongoose from "mongoose";
import type { ReturnModelType } from "@typegoose/typegoose";
import {
  prop,
  modelOptions,
  getModelForClass,
  pre,
} from "@typegoose/typegoose";
import { Bank } from "./bank.model";
import { User } from "./user.model";

export class Coupon {
  readonly _id!: string;

  @prop({
    required: true,
    trim: true,
    type: String,
  })
  name!: string;

  @prop({
    required: true,
    trim: true,
    uppercase: true,
    minlength: 6,
    maxlength: 6,
    type: String,
  })
  code!: string;

  @prop({
    required: true,
    min: [10, "Price must be at least 0"],
    max: [100, "Discount must be atmost 100"],
    trim: true,
    type: Number,
  })
  discount!: number;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    //required: [true, "Candy must have a vendor ID"],
    required: true,
    ref: () => Bank,
  })
  bank!: mongoose.Types.ObjectId;

  @prop({
    type: [mongoose.SchemaTypes.ObjectId], // Array of User IDs who redeemed the coupon
    ref: () => User, // Assuming you have a User model
    default: [],
  })
  redeemed!: mongoose.Types.ObjectId[];

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

const CouponModel = (mongoose.models.Coupon ||
  // eslint-disable-next-line @typescript-eslint/ban-types
  getModelForClass(Coupon)) as ReturnModelType<typeof Coupon, {}>;

// const CandyModel = getModelForClass(Candy);

export default CouponModel;
