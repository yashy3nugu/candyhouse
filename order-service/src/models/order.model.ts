import { User } from './user.model';
import { getModelForClass, prop, modelOptions, pre, ReturnModelType } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Status } from '@/utils/types/order';
import { Bank } from './bank.model';
import { Coupon } from './coupon.model';
import { Photo } from './photo.model';

export class OrderItem {
  @prop({
    type: String,
    required: [true, 'Order item must have a candy ID'],
  })
  candy!: string;

  @prop({
    required: true,
    trim: true,
    lowercase: true,
    type: String,
  })
  name!: string;

  @prop({
    required: true,
    min: [0, 'Price must be at least 0'],
    trim: true,
    type: Number,
  })
  price!: number;

  @prop({
    required: true,
    min: [0, 'Quantity must be at least 0'],
    trim: true,
    type: Number,
  })
  quantity!: number;

  @prop({
    required: true,

    trim: true,
    type: String,
  })
  description!: string;

  @prop({
    type: Number,
  })
  itemsInCart!: number;

  @prop({
    type: Photo,
    required: true,
  })
  photo!: Photo;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@pre<Order>(/^find/, function (next) {
  this.sort('-createdAt');
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
    required: [true, 'Order item must have a address'],
    trim: true,
  })
  address!: string;

  @prop({
    type: Number,
  })
  price!: number;

  @prop({
    type: Number,
  })
  coinsRedeemed!: number;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: () => Bank,
  })
  bank!: Ref<Bank>;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: () => Coupon,
  })
  appliedCoupon?: Ref<Bank>;

  readonly createdAt!: Date;

  readonly updatedAt!: Date;
}

const OrderModel = (mongoose.models.Order || getModelForClass(Order)) as ReturnModelType<typeof Order, object>;

// const OrderModel = getModelForClass(Order);

export default OrderModel;
