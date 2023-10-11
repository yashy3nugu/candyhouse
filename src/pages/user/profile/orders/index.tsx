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

const Orders: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const { data: orders, isLoading } = api.order.user.useQuery({
    limit: 10,
    page,
  });

  return (
    <>
      <Container
        maxW="3xl"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Heading as="h1">Orders placed</Heading>
        {orders && (
          <OrderDataTable
            {...{ page }}
            data={orders}
            linkUrl="/user/profile/orders"
            nextPage={handleNextPage}
            previousPage={handlePrevPage}
          />
        )}
      </Container>
    </>
  );
};

Orders.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Orders;
