import AdminLayout from "@/layouts/admin-layout/navbar";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import {
  Text,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { Status } from "@/utils/types/orders";

const Order: NextPageWithLayout = () => {
  const router = useRouter();

  const {
    isLoading: isCandyLoading,
    data: order,
    refetch,
  } = api.order.oneById.useQuery({
    _id: router.query.id as string,
  });

  const { mutate, isLoading } = api.order.markDelivered.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

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
                {order.status === Status.Pending && (
                  <Button
                    mt={3}
                    onClick={() => {
                      mutate({ _id: order._id });
                    }}
                  >
                    Mark delivered
                  </Button>
                )}
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
            </Stack>
          </Container>
        </>
      )}
    </>
  );
};

Order.getLayout = (page) => {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Order;
