
import {
  Heading,
  Text,
  Button,
  Container,
  VStack,
  StackDivider,
  Card,
  CardBody,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  
} from "@chakra-ui/react";
import {useAppSelector } from "@/store/hooks";


import { Role } from "@/utils/types/user";
import { Form, Formik } from "formik";
import SelectControl from "@/components/ui/select-control";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import CartItem from "@/components/cart-item";
import InputControl from "@/components/ui/input-control";

import { useLoggedInUserQuery } from "@/api/user";
import { useCreateOrderMutation, useGetBanksQuery } from "@/api/order";
import { OrderDataItem } from "@/api/order/types";
import Seo from "@/components/shared/seo";
// import PaymentModal from "@/components/payment-modal";

const Cart: NextPageWithLayout = () => {
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartValue = useAppSelector((state) => state.cart.value);
  const cartPrice = useAppSelector((state) => state.cart.price);

  
  const { mutate: createOrder } =
    useCreateOrderMutation();

  const { data, isLoading: isBanksLoading } = useGetBanksQuery();

  const { isLoading: isUserLoading, data: loginData } = useLoggedInUserQuery();

  // const { mutateAsync: validateCoupon, isLoading: isCouponValidationLoading } =
  //   api.coupon.validate.useMutation({});

  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const [appliedCoupon] = useState<Coupon | null>(null);



  // if (!isUserLoading && user) {
  //   options = Array.from(
  //     { length: (Math.min(1000,user.balance) - 100) / step + 1 },
  //     (_, index) => 100 + index * step
  //   );
  // }

  return (
    <>
      <Seo title="Cart" />
      <Container
        maxW="3xl"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        {cartValue > 0 ? (
          <>
            <Card w="full" mb={5}>
              <CardBody>
                <Flex mt={4} w="full" justifyContent="space-between">
                  <Text fontSize="md" fontWeight="base">
                    Subtotal
                  </Text>
                  <Text fontSize="md" fontWeight="base">
                    ₹{cartPrice}
                  </Text>
                </Flex>

                {/* {appliedCoupon && (
                  <Flex mt={4} w="full" justifyContent="space-between">
                    <Text fontSize="md" fontWeight="base">
                      Discount (
                      {appliedCoupon ? `${appliedCoupon.discount}%` : "0%"})
                    </Text>
                    <Text color="pink.300" fontSize="md" fontWeight="base">
                      -₹
                      {appliedCoupon
                        ? Math.round(cartPrice * (appliedCoupon.discount / 100))
                        : 0}
                    </Text>
                  </Flex>
                )} */}

                <Divider />

                <Flex mt={4} w="full" justifyContent="space-between">
                  <Text fontSize="lg" fontWeight="semibold">
                    Order Total
                  </Text>
                  {/* <Text fontSize="lg" fontWeight="semibold">
                    ₹
                    {appliedCoupon
                      ? Math.round(
                          cartPrice * (1 - appliedCoupon.discount / 100)
                        )
                      : cartPrice}
                  </Text> */}
                </Flex>

                {!isUserLoading && loginData && (
                  <Formik
                    validate={({ address }) => {
                      const errors: { address?: string } = {};
                      if (address === "") {
                        errors.address = "Address Required";
                      }
                      return errors;
                    }}
                    initialValues={{
                      address: "",
                    }}
                    onSubmit={({ address }) => {
                      const items = [] as OrderDataItem[];

                      cartItems.forEach(
                        ({
                          itemsInCart,
                          appId,
                          description,
                          name,
                          photo,
                          price,
                          quantity,
                        }) => {
                          items.push({
                            candy: appId,
                            itemsInCart,
                            description,
                            name,
                            photo,
                            price,
                            quantity,
                          });
                        }
                      );

                      createOrder({
                        items,
                        address,
                      });
                    }}
                  >
                    {({  isSubmitting, isValid, dirty }) => (
                      <Form>
                        <VStack alignItems="start" mt={4}>
                          <InputControl name="address" label="Address" />
                        </VStack>

                        {!isUserLoading && !loginData && (
                          <Alert mt={4} status="info">
                            <AlertIcon />
                            Login to place an order.
                          </Alert>
                        )}
                        {!isUserLoading &&
                          loginData &&
                          (loginData.user?.role === Role.Vendor ||
                            loginData.user?.role === Role.Admin) && (
                            <Alert mt={4} status="info">
                              <AlertIcon />
                              Login as a customer to place an order.
                            </Alert>
                          )}

                        {!isUserLoading && loginData && (
                          <Button
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting || !isValid || !dirty}
                            mt={4}
                            type="submit"
                            py={6}
                            w="full"
                            colorScheme="pink"
                            size={{base: "sm", sm: "md"}}
                          >
                            Place Order
                          </Button>
                        )}
                      </Form>
                    )}
                  </Formik>
                )}
              </CardBody>
            </Card>

            <Heading>Your cart ({cartValue})</Heading>
            <VStack divider={<StackDivider />} px={6} mt={4}>
              {cartValue > 0 &&
                cartItems.map((candy, i) => {
                  return <CartItem key={i} candy={candy} />;
                })}
            </VStack>
          </>
        ) : (
          <Alert status="warning">
            <AlertIcon />
            Empty Cart.
          </Alert>
        )}
      </Container>
    </>
  );
};

Cart.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Cart;
