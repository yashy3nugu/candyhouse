import OrderDataTable from "@/components/order-data-table";
import usePagination from "@/hooks/use-pagination/usePagination";
import AdminLayout from "@/layouts/admin-layout/navbar";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import {
  Container,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const AdminDashboard: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({});

  const { data: orders, isLoading } = api.order.all.useQuery({
    limit: 10,
    page,
  });

  if (isLoading) {
    return <></>;
  }

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

AdminDashboard.getLayout = (page) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDashboard;