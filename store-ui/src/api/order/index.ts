import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { ORDER_RQ, PRODUCT_RQ, USER_RQ } from "@/utils/types/react-query";
import { useRouter } from "next/router";
import { Role } from "@/utils/types/user";
import { BankQueryResponse, OrderData } from "./types";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/modules/cart";
// import {
//   Candy,
//   CandyCreateBody as CandyData,
//   PaginatedCandyResponse,
//   signedUrlQueryResponse,
// } from "./types";

const orderServiceBaseUrl =
  process.env.ORDER_SERVICE_BASE_URL || "http://localhost:5000";

const axios = Axios.create({
  baseURL: orderServiceBaseUrl,
  //   withCredentials: true,
});

export const useCreateOrderMutation = () => {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const router = useRouter();

  const { data, mutate, isPending } = useMutation<any,any,OrderData,any>({
    mutationFn: async (data) => {
      const authToken = localStorage.getItem("auth.token");
      const response = await axios.post(`/order`, data, {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
      });

      return response.data;
    },

    //   onMutate: () => {

    //   },
    onSuccess() {
      toast({
        title: "Order Placed",
        description: "You have successfully placed an order of candies",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => {
        dispatch(clearCart());
        router.replace("/orders");
      }, 4000);
    },
    onError() {
      toast({
        title: "Order Not Placed",
        description: "Unable to Place Order as Bank Server is Down",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

export const useGetBanksQuery = () => {
  const { data, isLoading } = useQuery<BankQueryResponse>({
    queryKey: [ORDER_RQ.BANKS],
    queryFn: async () => {
      const response = await axios.get(`/bank`, {});

      return response.data;
    },
  });
  return { data, isLoading };
};
