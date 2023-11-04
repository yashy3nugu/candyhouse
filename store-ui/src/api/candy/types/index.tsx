export type Candy = {
  _id: string;
  name: string;
  description: string;
  appId: string;
  photo: Photo;
  vendor: string;
  price: number;
  quantity: number;
};

export type PaginatedCandyResponse = {
  hasMore: boolean;
  candies: Candy[];
};

export type Photo = {
  url: string;
};

export type CandyCreateBody = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  photo: Photo;
};

export type signedUrlQueryResponse = {
  folder: string;
  api_key: string;
  url: string;
  signature: string;
  timestamp: string;
};
