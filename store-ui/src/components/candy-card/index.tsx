import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  HStack,
  Flex,
  Box,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
// import Image from "@/components/shared/image";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import Image from "next/image";
import NextLink from "next/link";
import { Candy } from "@/api/candy/types";

interface CandyCardProps {
  candy: Candy;
}

const CandyCard: React.FC<CandyCardProps> = ({ candy }) => {
  const dispatch = useAppDispatch();

  const cartCandy = useAppSelector((state) => state.cart.items).find(
    (item) => item._id === candy._id
  );

  return (
    <LinkBox>
      <Card height="full">
        <Box
          position="relative"
          w={{ base: "150px", lg: "200px" }}
          h={{ base: "150px", lg: "200px" }}
          minH={{ base: "150px", lg: "200px" }}
          mx="auto"
        >
          <Image src={candy.photo.url} alt={candy.name} fill />
        </Box>

        {/* <Image width={360} height={360} src={candy.photo.url} alt={candy.name} /> */}
        <CardHeader pb={0} px={2}>
          <Text textColor="gray.400" fontSize={"sm"}>
            {(candy.vendor as any).name}
          </Text>
          <LinkOverlay as={NextLink} href={`/candy/${candy._id}`}>
            <Text mt={0} as="h3" fontWeight="medium" fontSize="xl">
              {candy.name}
            </Text>
          </LinkOverlay>
        </CardHeader>
        <CardBody pt={0} px={2}>
          <Flex direction="column" justifyContent="space-between" h="full">
            <Box>
              <Text fontSize="sm" fontWeight="normal">
                {candy.description}
              </Text>
              <Flex></Flex>
            </Box>
            <Box>
              <Text mb={2} mt={4} fontWeight={"medium"}>
                ₹ {candy.price}
              </Text>
              <HStack w="full" spacing={4} justifyContent="center">
                {cartCandy ? (
                  <>
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
                  </>
                ) : (
                  <Button
                    w="full"
                    onClick={() => {
                      dispatch(addCandyToCart({ candy }));
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </HStack>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </LinkBox>
  );
};

export default CandyCard;
