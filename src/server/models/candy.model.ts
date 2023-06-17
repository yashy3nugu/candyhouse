import mongoose from "mongoose";
import type { ReturnModelType } from "@typegoose/typegoose";
import {
  prop as Property,
  modelOptions,
  getModelForClass,
  pre,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export class Candy {
  readonly _id!: string;

  @Property({
    required: [true, "Candy must have a name"],
    trim: true,
    lowercase: true,
    type: String,
  })
  name!: string;

  @Property({
    required: [true, "Candy must have a description"],
    trim: true,
    type: String,
  })
  description!: string;

  @Property({
    required: [true, "Candy must have a price"],
    min: [0, "Price must be at least 0"],
    trim: true,
    type: Number,
  })
  price!: number;

  @Property({
    required: [true, "Candy must have a quantity"],
    min: [0, "Quantity must be at least 0"],
    trim: true,
    type: Number,
  })
  quantity!: number;

  @Property({
    type: mongoose.SchemaTypes.ObjectId,
    //required: [true, "Candy must have a vendor ID"],
    ref: () => User,
  })
  vendor!: mongoose.Types.ObjectId;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

const CandyModel = (mongoose.models.Candy ||
  getModelForClass(Candy)) as ReturnModelType<typeof Candy, object>;

// const CandyModel = getModelForClass(Candy);

export default CandyModel;
