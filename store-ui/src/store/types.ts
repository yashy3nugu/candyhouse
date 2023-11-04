import { Candy } from "@/api/candy/types";

export type CartCandy = Candy & {
  itemsInCart: number;
};
