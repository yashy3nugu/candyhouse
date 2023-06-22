import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Button,
  HStack,
  useNumberInput,
  Badge,
  Flex,
} from "@chakra-ui/react";
import Image from "@/components/shared/image";
import { Candy } from "@/server/models/candy.model";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";

interface CandyCardProps {
  candy: Candy;
}

const CandyCard: React.FC<CandyCardProps> = ({ candy }) => {
  const dispatch = useAppDispatch();

  const cartCandy = useAppSelector((state) => state.cart.items).find(
    (item) => item._id === candy._id
  );

  return (
    <Card>
      <Image width={360} height={360} src={candy.photo.url} alt={candy.name} />
      <CardHeader pb={0} px={2}>
        <Text textColor="gray.400" fontSize={"sm"}>
          {(candy.vendor as any).name}
        </Text>

        <Text mt={0} as="h3" fontWeight="medium" fontSize="xl">
          {candy.name}
          <Badge ml={2} colorScheme="purple">
            New
          </Badge>
        </Text>
      </CardHeader>
      <CardBody pt={0} px={2}>
        <Text fontSize="sm" fontWeight="normal">
          {candy.description}
        </Text>
        <Flex></Flex>
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
      </CardBody>
    </Card>
  );
};

export default CandyCard;
