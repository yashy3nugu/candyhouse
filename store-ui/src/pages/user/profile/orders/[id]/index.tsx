import { NextPageWithLayout } from "@/pages/_app";

import React, { useState } from "react";
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

const Order: NextPageWithLayout = () => {
    const router = useRouter();
  const { isLoading: isUserLoading, data: user } = api.auth.user.useQuery();

  const { mutate } = api.order.cancel.useMutation()

  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const { data: order, isLoading, refetch } = api.order.oneById.useQuery({
    _id: router.query.id as string
  });

  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);

  const openCancellationModal = () => {
    setIsCancellationModalOpen(true);
  };

  // Function to close the cancellation modal
  const closeCancellationModal = () => {
    setIsCancellationModalOpen(false);
  };

   const confirmOrderCancellation = async () => {
    
    const { mutate } = api.order.cancel.useMutation();
    
    mutate({ _id: order!._id });
     closeCancellationModal(); // Close the modal after confirmation
     await refetch();
  };

  return (
    <>
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
                {order.items.map((item: any) => (
                  <Flex key={item._id} align="center" justify="space-between">
                    <Text>{item.candy.name}</Text>
                    <Text>Quantity: {item.itemsInCart}</Text>
                    <Box
                      position="relative"
                      h={{ base: "50px", sm: "100px" }}
                      w={{ base: "50px", sm: "100px" }}
                    >
                      <Image
                        src={item.candy.photo.url}
                        alt={item.candy.name}
                        fill
                      />
                    </Box>
                  </Flex>
                ))}
              </Box>
              <Box>
                <Button colorScheme="red" onClick={openCancellationModal}>
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
                <Button colorScheme="red" onClick={confirmOrderCancellation}>
                  Confirm Cancellation
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
