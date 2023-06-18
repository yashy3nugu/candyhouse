import { Candy } from "@/server/models/candy.model";

export type CartCandy = Candy & {
  itemsInCart: number;
};
