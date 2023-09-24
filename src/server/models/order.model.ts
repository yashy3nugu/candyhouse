import { User } from "./user.model";
import {
  getModelForClass,
  prop,
  modelOptions,
  pre,
  ReturnModelType,
} from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Status } from "../../utils/types/orders";
import { Candy } from "./candy.model";
import { Bank } from "./bank.model";

export class OrderItem {
  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "Order item must have a candy ID"],
    ref: () => Candy,
  })
  candy!: mongoose.Types.ObjectId;


  @prop({
    type: Number,
  })
  itemsInCart!: number;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@pre<Order>(/^find/, function (next) {
  this.sort("-createdAt");
  next();
})
export class Order {
  readonly _id!: string;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: () => User,
  })
  user!: Ref<User>;

  @prop({
    enum: Status,
    default: Status.Pending,
    type: String,
  })
  status!: string;

  @prop({
    type: [OrderItem],
  })
  items!: OrderItem[];

  @prop({
    type: String,
    required: [true, "Order item must have a address"],
    trim: true,
  })
  address!: mongoose.Types.ObjectId;

  @prop({
    type: Number,
  })
  price!: number;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: () => Bank,
  })
  bank!: Ref<Bank>;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;
}

const OrderModel = (mongoose.models.Order ||
  getModelForClass(Order)) as ReturnModelType<typeof Order, object>;

// const OrderModel = getModelForClass(Order);

export default OrderModel;
