import { Photo } from "@/api/candy/types";

export type Bank = {
  name: string;
  status: string;
  _id: string;
};

export type Order = {
  _id: string;
  user: string;
  status: string;
  items: (OrderDataItem & { _id: string })[];
  address: string;
  price: number;
  coinsRedeemed: number;
  bank: string;
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
export type OrderCreateBody = {
  items: OrderDataItem[];
  address: string;
};

export type PaginatedOrderResponse = {
  hasMore: boolean;
  candies: Order[];
};

export type OrderIdBody = {
  id: string;
};
