import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import { Role } from "../../utils/types/user";
import {Spinner} from '@chakra-ui/react'
import { useLoggedInUserQuery } from "@/api/user";

const VendorProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { isLoading, data } = useLoggedInUserQuery()

  React.useEffect(() => {
    (async () => {
      if (!isLoading && (!data || data.user.role !== Role.Vendor)) {
        await router.replace("/");
      }
    })()
    
  }, [router, data, isLoading]);

  if (isLoading) {
    return (
      <>
        {JSON.stringify(data)}
        <Spinner />
      </>
    );
  }

  return <>{children}</>;
};

export default VendorProvider;
