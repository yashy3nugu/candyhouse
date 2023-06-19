import mongoose from "mongoose";
import type { ReturnModelType } from "@typegoose/typegoose";
import { prop, getModelForClass } from "@typegoose/typegoose";

export class Bank {
  readonly _id!: string;

  @prop({
    required: true,
    trim: true,
    type: String,
  })
  name!: string;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

const BankModel = (mongoose.models.Bank ||
  // eslint-disable-next-line @typescript-eslint/ban-types
  getModelForClass(Bank)) as ReturnModelType<typeof Bank, {}>;



export default BankModel;
