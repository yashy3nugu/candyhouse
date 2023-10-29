import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { PRODUCT_RQ, USER_RQ } from "@/utils/types/react-query";
import { useRouter } from "next/router";
import { Role } from "@/utils/types/user";
import { PaginatedCandyResponse } from "./types";

const productServiceBaseUrl =
  process.env.PRODUCT_SERVICE_BASE_URL || "http://localhost:4000";

const axios = Axios.create({
  baseURL: productServiceBaseUrl,
  //   withCredentials: true,
});

export const usePaginatedCandyQuery = (page?: number) => {
  const { data, isLoading } = useQuery<PaginatedCandyResponse>({
    queryKey: [PRODUCT_RQ.PAGINATED_CANDIES],
    queryFn: async () => {
      // Get the token from localStorage
      const authToken = localStorage.getItem("auth.token");

      // Make the GET request to /users/verify with the token
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
