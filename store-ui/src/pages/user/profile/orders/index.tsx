import { NextPageWithLayout } from "@/pages/_app";

import React from "react";
import UserLayout from "@/layouts/user-layout";
import {
  Container,
  Heading,
} from "@chakra-ui/react";
import usePagination from "@/hooks/use-pagination/usePagination";
import OrderDataTable from "@/components/order-data-table";
import { usePaginatedOrderQuery } from "@/api/order";
import Seo from "@/components/shared/seo";

const Orders: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const { data: orders, isLoading } = usePaginatedOrderQuery(page);

  return (
    <>
      <Seo title="User Profile" />
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
