import format from "date-fns/format";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from "@chakra-ui/react";
import Pagination from "../shared/pagination";
import Link from "next/link";

interface OrderDataTableProps {
  data: any;
  linkUrl: string;
  glass?: boolean;
  nextPage: () => void;
  previousPage: () => void;
  page: number;
}

const OrderDataTable: React.FC<OrderDataTableProps> = ({
  data,
  linkUrl,
  glass,
  page,
  nextPage,
  previousPage,
}) => {
  return (
    <>
      <TableContainer>
        <Table variant="simple" size="xs">
          <TableCaption>Current Orders</TableCaption>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Order Date</Th>
              <Th>Order Total (Rs)</Th>
              <Th>Order Status</Th>
              <Th>View</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.orders?.map((order: any) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>
                  {format(new Date(order.createdAt as Date), "MM/dd/yyyy")}
                </Td>
                <Td>{order.price}</Td>
                <Td>{order.status}</Td>
                <Td>
                  <Link href={`${linkUrl}/${order._id as string}`}>
                    <Button colorScheme="pink">View</Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        handleNextPage={nextPage}
        handlePrevPage={previousPage}
        page={page}
        prevDisabled={page === 1}
        nextDisabled={!data.hasMore}
        hasMore={data.hasMore}
      />
    </>
  );
};

export default OrderDataTable;
