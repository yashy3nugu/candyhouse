import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Seo from "@/components/shared/seo";
import { useQueryClient } from "@tanstack/react-query";
import { USER_RQ } from "@/utils/types/react-query";


const LogoutPage: NextPage = ({}) => {
    const router = useRouter();
    const queryClient = useQueryClient()
  

    React.useEffect(() => {
        localStorage.removeItem("auth.token");
        queryClient.invalidateQueries({ queryKey: [USER_RQ.LOGGED_IN_USER_QUERY] })
        queryClient.removeQueries({ queryKey: [USER_RQ.LOGGED_IN_USER_QUERY] });
        router.replace("/")

  }, [queryClient, router]);

  return (
    <>
      <Seo />
      
    </>
  );
};

export default LogoutPage;
