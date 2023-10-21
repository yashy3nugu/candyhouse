import { prop } from "@typegoose/typegoose";

export class Photo {
  @prop({
    type: String,
  })
  url!: string;

  @prop({
    type: String,
    select: false,
  })
  publicId!: string;
}
