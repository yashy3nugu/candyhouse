import { useMutation, useQuery } from "@tanstack/react-query";
import Axios from "axios";
import { PRODUCT_RQ } from "@/utils/types/react-query";
import {
  Candy,
  CandyCreateBody as CandyData,
  PaginatedCandyResponse,
  signedUrlQueryResponse,
} from "./types";

const productServiceBaseUrl =
  process.env.PRODUCT_SERVICE_BASE_URL || "http://localhost:4000";

const axios = Axios.create({
  baseURL: productServiceBaseUrl,
  //   withCredentials: true,
});

export const usePaginatedCandyQuery = (page?: number) => {
  const { data, isLoading } = useQuery<PaginatedCandyResponse>({
    queryKey: [PRODUCT_RQ.PAGINATED_CANDIES, page],
    queryFn: async () => {
      // Get the token from localStorage
      const authToken = localStorage.getItem("auth.token");

      const response = await axios.get("/candy", {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
        params: {
          limit: 10,
          page,
        },
      });

      return response.data;
    },
  });

  return { data, isLoading };
};

export const usePaginatedCandyQueryVendor = (page?: number) => {
  const { data, isLoading } = useQuery<PaginatedCandyResponse>({
    queryKey: [PRODUCT_RQ.VENDOR, PRODUCT_RQ.PAGINATED_CANDIES, page],
    queryFn: async () => {
      // Get the token from localStorage
      const authToken = localStorage.getItem("auth.token");

      const response = await axios.get("/candy/vendor", {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
        params: {
          limit: 10,
          page,
        },
      });

      return response.data;
    },
  });

  return { data, isLoading };
};

export const useCandyByIdQuery = (id: string) => {
  const { data, isLoading } = useQuery<Candy>({
    queryKey: [PRODUCT_RQ.CANDY, id],
    queryFn: async () => {
      const response = await axios.get(`/candy/${id}`, {});

      return response.data;
    },
  });

  return { data, isLoading };
};

export const useCreateCandyMutation = () => {
  const { data, mutate, isPending } = useMutation<Candy, any, CandyData, any>({
    mutationFn: async (data) => {
      const authToken = localStorage.getItem("auth.token");
      const response = await axios.post(`/candy`, data, {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
      });

      return response.data;
    },

    //   onMutate: () => {

    //   },
    onSuccess: () => {
      // let redirect;
      // if (data.user.role === Role.User) {
      //   redirect = "/store";
      // } else if (data.user.role === Role.Admin) {
      //   redirect = "/admin/dashboard";
      // } else {
      //   redirect = "/vendor/dashboard";
      // }
      // router.replace(redirect);
    },
    //   onError: (error) => {

    //   },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

export const useUpdateCandyMutation = (id: string) => {
  const { data, mutate, isPending } = useMutation<Candy, any, CandyData, any>({
    mutationFn: async (data) => {
      const authToken = localStorage.getItem("auth.token");
      const response = await axios.patch(`/candy/${id}`, data, {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
      });

      return response.data;
    },

    //   onMutate: () => {

    //   },
    onSuccess: () => {
      // let redirect;
    },
    //   onError: (error) => {

    //   },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

export const useSignedUrlQuery = () => {
  const { refetch } = useQuery<signedUrlQueryResponse>({
    queryKey: ["SignedUrl"],
    queryFn: async () => {
      return (await axios.get("/image")).data;
    },
    enabled: false,
  });

  return {
    refetch,
  };
};
