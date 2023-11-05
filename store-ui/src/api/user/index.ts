import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { USER_RQ } from "@/utils/types/react-query";
import { useRouter } from "next/router";
import { Role } from "@/utils/types/user";
import {
  LoginRegisterResponse,
  LoginData,
  VerifyResponse,
  RegisterData,
} from "./types";

const userServiceBaseUrl =
  process.env.USER_SERVICE_BASE_URL || "http://localhost:7000";

const axios = Axios.create({
  baseURL: userServiceBaseUrl,
  //   withCredentials: true,
});

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const { data, mutate, isPending } = useMutation<
    LoginRegisterResponse,
    any,
    LoginData,
    any
  >({
    mutationFn: async (data) => {
      const response = await axios.post(`/users/login`, data);

      return response.data;
    },

    onMutate: () => {
      toast.closeAll();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([USER_RQ.LOGGED_IN_USER_QUERY], data);
      localStorage.setItem("auth.token", data.token);
      let redirect;
      if (data.user.role === Role.User) {
        redirect = "/store";
      } else if (data.user.role === Role.Admin) {
        redirect = "/admin/dashboard";
      } else {
        redirect = "/vendor/dashboard";
      }
      router.replace(redirect);
    },
    onError: (error) => {
      toast({
        title: "Unable to log you in",
        description: "Please check your credentials",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const { data, mutate, isPending } = useMutation<
    LoginRegisterResponse,
    any,
    RegisterData,
    any
  >({
    mutationFn: async (data) => {
      const response = await axios.post(`/users/register`, data);

      return response.data;
    },

    onMutate: () => {
      toast.closeAll();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([USER_RQ.LOGGED_IN_USER_QUERY], data);
      localStorage.setItem("auth.token", data.token);
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
    onError: (error) => {
      toast({
        title: "Unable to register",
        description: "User with same email exists",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: async () => {
      //   const res = await axios({
      //     url: "/auth/logout",
      //     method: "post",
      //   });
      //   return res.data;
    },
    onSuccess() {
      queryClient.setQueryData([USER_RQ.LOGGED_IN_USER_QUERY], null);
    },
  });

  return {
    data,
    mutate,
    isPending,
  };
};

export const useLoggedInUserQuery = () => {
  const { data, isLoading, isPending } = useQuery<VerifyResponse>({
    queryKey: [USER_RQ.LOGGED_IN_USER_QUERY],
    queryFn: async () => {
      // Get the token from localStorage
      const authToken = localStorage.getItem("auth.token");

      // Make the GET request to /users/verify with the token
      const response = await axios.get("/users/verify", {
        headers: {
          Authorization: `Bearer ${authToken || ""}`,
        },
      });

      return response.data;
    },
  });

  return { data, isLoading: isPending };
};
