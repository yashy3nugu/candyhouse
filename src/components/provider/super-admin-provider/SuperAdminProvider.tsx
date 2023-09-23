import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import { Role } from "@/utils/types/user";
import { Spinner } from "@chakra-ui/react";

const SuperAdminProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { isLoading, data } = api.auth.user.useQuery();

  React.useEffect(() => {
    (async () => {
      if (!isLoading && (!data || data.role !== Role.Admin)) {
        await router.replace("/");
      }
    })();
  }, [router, data, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default SuperAdminProvider;
