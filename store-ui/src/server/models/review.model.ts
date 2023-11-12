import mongoose from "mongoose";
import type { Ref, ReturnModelType } from "@typegoose/typegoose";
import { prop, getModelForClass } from "@typegoose/typegoose";
import { User } from "./user.model";
import { Candy } from "./candy.model";

export class Review {
  readonly _id!: string;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "Order item must have a candy ID"],
    ref: () => Candy,
  })
  candy!: mongoose.Types.ObjectId;

  @prop({
    required: true,

    trim: true,
    type: String,
  })
  description!: string;

  @prop({
    required: true,

    trim: true,
    type: String,
  })
  title!: string;

  @prop({
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must less than or equal to 5"],
    type: Number,
  })
  rating!: number;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    //required: [true, "Candy must have a vendor ID"],
    required: true,
    ref: () => User,
  })
  reviewer!: Ref<User>;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

const ReviewModel = (mongoose.models.Review ||
  // eslint-disable-next-line @typescript-eslint/ban-types
  getModelForClass(Review)) as ReturnModelType<typeof Review, {}>;

// const CandyModel = getModelForClass(Candy);

export default ReviewModel;
