import { NextPageWithLayout } from "@/pages/_app";

import React from "react";
import UserLayout from "@/layouts/user-layout";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import usePagination from "@/hooks/use-pagination/usePagination";
import OrderDataTable from "@/components/order-data-table";
import { useRouter } from "next/router";

const Order: NextPageWithLayout = () => {
    const router = useRouter();
  const { isLoading: isUserLoading, data: user } = api.auth.user.useQuery();

  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const { data: order, isLoading } = api.order.oneById.useQuery({
    _id: router.query.id as string
  });

  return (
    <>
      {user && (
        <Container
          maxW="3xl"
          py={{ base: "12", md: "24" }}
          px={{ base: "0", sm: "8" }}
        >
          <Heading as="h1">Orders placed</Heading>
          {JSON.stringify(order)}
        </Container>
      )}
    </>
  );
};

Order.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Order;
