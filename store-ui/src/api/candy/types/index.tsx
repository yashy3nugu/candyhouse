export type Candy = {
  _id: string;
  name: string;
  description: string;

  photo: {
    url: string;
  };
  vendor: string;
  price: number;
  quantity: number;
};

export type PaginatedCandyResponse = {
  hasMore: boolean;
  candies: Candy[];
};
