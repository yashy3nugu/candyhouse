import mongoose from 'mongoose';
import { Ref, ReturnModelType, index } from '@typegoose/typegoose';
import { prop, modelOptions, getModelForClass, pre } from '@typegoose/typegoose';
import { User } from '@models/user.model';
import { Photo } from '@models/photo.model';

@index({ name: 1 }, { unique: true })
export class Candy {
  readonly _id!: string;

  @prop({
    required: true,
    trim: true,
    lowercase: true,
    type: String,
    unique: true,
  })
  name!: string;

  @prop({
    required: true,

    trim: true,
    type: String,
  })
  description!: string;

  @prop({
    required: true,
    min: [0, 'Price must be at least 0'],
    type: Number,
  })
  price!: number;

  @prop({
    type: String,
    required: [true, 'Candy must have a app specific id'],
  })
  appId!: string;

  @prop({
    required: true,
    min: [0, 'Quantity must be at least 0'],
    type: Number,
  })
  quantity!: number;

  @prop({
    type: mongoose.SchemaTypes.ObjectId,
    //required: [true, "Candy must have a vendor ID"],
    required: true,
    ref: () => User,
  })
  vendor!: Ref<User>;

  @prop({
    type: Photo,
    required: true,
  })
  photo!: Photo;

  readonly createdAt?: Date;

  readonly updatedAt?: Date;
}

const CandyModel = (mongoose.models.Candy ||
  // eslint-disable-next-line @typescript-eslint/ban-types
  getModelForClass(Candy)) as ReturnModelType<typeof Candy, {}>;

// const CandyModel = getModelForClass(Candy);

export default CandyModel;
