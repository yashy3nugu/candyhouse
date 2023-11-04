import { Photo } from "@/api/candy/types";

export type Bank = {
  name: string;
  status: string;
  _id: string;
};

export type BankQueryResponse = {
  banks: Bank[];
};

export type OrderDataItem = {
  candy: string;
  itemsInCart: number;
  description: string;
  name: string;
  photo: Photo;
  price: number;
  quantity: number;
};
export type OrderData = {
  items: OrderDataItem[];
  address: string;
  bank: string;
  code: string | undefined;
  coinsToRedeem: number;
};
