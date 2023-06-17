import { User } from "./user.model";
import {
  getModelForClass,
  prop as Property,
  modelOptions,
  pre,
  ReturnModelType,
} from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Status } from "../../utils/types/orders";
import { Candy } from "./candy.model";


export class OrderItem {
  readonly _id!: string;

  @Property({
    trim: true,
    required: [true, "order item must have a valid name"],
    type: String
  })
  name!: string;

  @Property({
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "Order item must have a candy ID"],
    ref: () => Candy,
  })
  candy!: mongoose.Types.ObjectId;

  @Property({
    required: [true, "order item must have a valid price"],
    type: Number
  })
  price!: number;

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

  @Property({
    type: mongoose.SchemaTypes.ObjectId,
    ref: () => User,
  })
  user!: Ref<User>;

  @Property({
    enum: Status,
    default: Status.Pending,
    type: String
  })
  status!: string;

  @Property({
    type: [OrderItem],
  })
  items!: OrderItem[];

  @Property({
    type: Number
  })
  price!: number;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;
}

const OrderModel = (mongoose.models.Order ||
  getModelForClass(Order)) as ReturnModelType<typeof Order, object>;

// const OrderModel = getModelForClass(Order);

export default OrderModel;
