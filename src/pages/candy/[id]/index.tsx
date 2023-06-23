import BaseLayout from "@/layouts/base-layout";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import {
  Badge,
  Text,
  Box,
  Card,
  Container,
  Flex,
  SimpleGrid,
  GridItem,
  VStack,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";

const Candy: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isLoading, data: candy } = api.candy.oneById.useQuery({
    id: router.query.id as string,
  });

  const cartCandy = useAppSelector((state) => state.cart.items).find(
    (item) => item._id === candy?._id
  );

  if (isLoading) {
    return <></>;
  }

  if (candy)
    return (
      <Container
        as="main"
        maxW="4xl"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Card w="full" px={4} py={3}>
          <SimpleGrid spacingX={6} columns={12} py={2}>
            <GridItem colSpan={3}>
              <Box w="full">
                <Box position="relative" h="200px">
                  <Image src={candy.photo.url} alt={candy.name} fill />
                </Box>
              </Box>
            </GridItem>
            <GridItem colSpan={9}>
              <VStack
                h="full"
                alignItems="start"
                justifyContent="space-between"
                ml={0}
              >
                <Box>
                  <Text textColor="gray.400" fontSize={"sm"}>
                    {(candy.vendor as any).name}
                  </Text>
                  <Text mt={0} as="h3" fontWeight="medium" fontSize="xl">
                    {candy.name}
                    <Badge ml={2} colorScheme="purple">
                      New
                    </Badge>
                  </Text>
                  <Text fontSize="sm" fontWeight="normal">
                    {candy.description}
                  </Text>
                </Box>
                <Flex w="full" flexDirection="row-reverse">
                  {cartCandy ? (
                    <HStack>
                      <Button
                        onClick={() => {
                          dispatch(addCandyToCart({ candy }));
                        }}
                      >
                        +
                      </Button>
                      <Text>{cartCandy.itemsInCart}</Text>
                      <Button
                        onClick={() => {
                          dispatch(removeCandyFromCart({ candy }));
                        }}
                      >
                        -
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      
                      onClick={() => {
                        dispatch(addCandyToCart({ candy }));
                      }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </Flex>
              </VStack>
            </GridItem>
          </SimpleGrid>
        </Card>
      </Container>
    );
};

Candy.getLayout = (page) => {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Candy;
