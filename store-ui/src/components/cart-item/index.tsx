import { Candy } from "@/server/models/candy.model";
import { useAppDispatch } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import { CartCandy } from "@/store/types";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Button,
  SimpleGrid,
  GridItem,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";

interface CartItemProps {
  candy: CartCandy;
}

const CartItem: React.FC<CartItemProps> = ({ candy }) => {
  const dispatch = useAppDispatch();
  return (
    <SimpleGrid columns={12} spacingX={2} px={1}>
      <GridItem colSpan={2}>
        <Box position="relative" h={{base: "40px",sm:"100px"}} w={{base: "40px",sm:"100px"}}>
          <Image src={candy.photo.url} alt={candy.name} fill />
        </Box>
      </GridItem>
      <GridItem colSpan={2}>
        <VStack h="full" alignItems="start" justifyContent={"center"}>
          <Text fontSize={{base:"sm",sm:"md"}} fontWeight="">
            {candy.name}
          </Text>
          <Text fontWeight="semibold" fontSize="sm">
            ₹{candy.price}
          </Text>
        </VStack>
      </GridItem>

      <GridItem colSpan={2} colStart={11}>
        <HStack
          w="full"
          h="full"
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          <Button
            size="sm"
            onClick={() => {
              dispatch(addCandyToCart({ candy }));
            }}
          >
            +
          </Button>
          <Text>{candy.itemsInCart}</Text>
          <Button
            size="sm"
            onClick={() => {
              dispatch(removeCandyFromCart({ candy }));
            }}
          >
            -
          </Button>
        </HStack>
      </GridItem>
    </SimpleGrid>
  );
};

export default CartItem;
