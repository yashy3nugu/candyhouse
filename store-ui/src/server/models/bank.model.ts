// import mongoose from "mongoose";
// import type { ReturnModelType } from "@typegoose/typegoose";
// import { prop, getModelForClass } from "@typegoose/typegoose";
// import { Status } from "@/utils/types/bank";

// export class Bank {
//   readonly _id!: string;

//   @prop({
//     required: true,
//     trim: true,
//     type: String,
//   })
//   name!: string;

//   @prop({
//     enum: Status,
//     default: Status.Running,
//     type: String,
//   })
//   status!: string;

//   readonly createdAt?: Date;

//   readonly updatedAt?: Date;
// }

// const BankModel = (mongoose.models.Bank ||
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   getModelForClass(Bank)) as ReturnModelType<typeof Bank, {}>;



// export default BankModel;
