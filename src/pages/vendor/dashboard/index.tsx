import VendorProvider from "@/components/provider/VendorProvider";
import usePagination from "@/hooks/use-pagination/usePagination";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import {
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

const VendorDashboard: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({});

  const { data, isLoading } = api.order.all.useQuery({
    limit: 10,
    page,
  });

  if (isLoading) {
    return <></>;
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Current Orders</TableCaption>
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Order Date</Th>
            <Th isNumeric>Order Total (Rs)</Th>
            <Th isNumeric>Order Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.orders?.map((order) => (
            <Tr key={order._id}>
              <Td>{order._id}</Td>
              <Td>{order.createdAt.toDateString()}</Td>
              <Td>{order.price}</Td>
              <Td>{order.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

VendorDashboard.getLayout = (page) => {
  return <VendorProvider>{page}</VendorProvider>;
};

export default VendorDashboard;
