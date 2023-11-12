import { NextPageWithLayout } from "@/pages/_app";

import React, { useState } from "react";
import UserLayout from "@/layouts/user-layout";
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import usePagination from "@/hooks/use-pagination/usePagination";
import OrderDataTable from "@/components/order-data-table";
import { useRouter } from "next/router";
import Image from "next/image";
import { useLoggedInUserQuery } from "@/api/user";
import { useCancelOrderMutation, useOrderByIdQuery } from "@/api/order";
import { useQueryClient } from "@tanstack/react-query";
import { ORDER_RQ } from "@/utils/types/react-query";
import Seo from "@/components/shared/seo";

const Order: NextPageWithLayout = () => {
  const router = useRouter();
  const { isLoading: isUserLoading, data: user } = useLoggedInUserQuery();

  const { mutate } = useCancelOrderMutation();
  const queryClient = useQueryClient();

  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const {
    data: order,
    isLoading,
    refetch,
  } = useOrderByIdQuery(router.query.id as string);

  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);

  const openCancellationModal = () => {
    setIsCancellationModalOpen(true);
  };

  // Function to close the cancellation modal
  const closeCancellationModal = () => {
    setIsCancellationModalOpen(false);
  };

  const confirmOrderCancellation = async () => {
    mutate({ id: order!._id });
    closeCancellationModal();
    // Close the modal after confirmation
    queryClient.invalidateQueries({ queryKey: [ORDER_RQ.ORDER, order!._id] });
    await refetch();
  };

  return (
    <>
      <Seo title="View Order" />
      {order && (
        <>
          <Container
            maxW="3xl"
            py={{ base: "12", md: "24" }}
            px={{ base: "0", sm: "8" }}
          >
            <Stack spacing={4}>
              <Box>
                <Heading as="h2" size="lg">
                  Order Details
                </Heading>
                <Text>Status: {order.status}</Text>
                <Text>Address: {order.address}</Text>
                <Text>Price: ${order.price}</Text>
                <Text>Coins Redeemed: {order.coinsRedeemed}</Text>
              </Box>
              <Divider />
              <Box>
                <Heading as="h2" size="lg">
                  Items
                </Heading>
                {order.items.map((item) => (
                  <Flex key={item._id} align="center" justify="space-between">
                    <Text>{item.name}</Text>
                    <Text>Quantity: {item.itemsInCart}</Text>
                    <Box
                      position="relative"
                      h={{ base: "50px", sm: "100px" }}
                      w={{ base: "50px", sm: "100px" }}
                    >
                      <Image src={item.photo.url} alt={item.name} fill />
                    </Box>
                  </Flex>
                ))}
              </Box>
              <Box>
                <Button colorScheme="pink" onClick={openCancellationModal}>
                  Cancel Order
                </Button>
              </Box>
            </Stack>
          </Container>

          <Modal
            isOpen={isCancellationModalOpen}
            onClose={closeCancellationModal}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Order Cancellation</ModalHeader>
              <ModalCloseButton />
              <ModalBody>Are you sure you want to cancel this order?</ModalBody>
              <ModalFooter>
                <Button colorScheme="pink" mr={2} onClick={confirmOrderCancellation}>
                  Confirm
                </Button>
                <Button variant="ghost" onClick={closeCancellationModal}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

Order.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Order;
