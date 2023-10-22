import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import {
  List,
  Heading,
  ListItem,
  Text,
  Button,
  useDisclosure,
  Input,
  Container,
  HStack,
  VStack,
  UnorderedList,
  StackDivider,
  Card,
  CardBody,
  Box,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addCandyToCart,
  clearCart,
  removeCandyFromCart,
} from "@/store/modules/cart";
import { Role } from "@/utils/types/user";
import { Field, Form, Formik } from "formik";
import SelectControl from "@/components/ui/select-control";
import { useState } from "react";
import { Coupon } from "@/server/models/coupon.model";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import CartItem from "@/components/cart-item";
import InputControl from "@/components/ui/input-control";
import { useRouter } from "next/router";
// import PaymentModal from "@/components/payment-modal";

const Cart: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartValue = useAppSelector((state) => state.cart.value);
  const cartPrice = useAppSelector((state) => state.cart.price);

  const router = useRouter();
  const { mutate: createOrder, isLoading } = api.order.create.useMutation({
    onSuccess() {
      toast({
        title: "Order Placed",
        description: "You have successfully placed an order of candies",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => {
        dispatch(clearCart());
        router.replace("/orders");
      }, 4000);
    },
    onError() {
      toast({
        title: "Order Not Placed",
        description: "Unable to Place Order as Bank Server is Down",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const { data, isLoading: isBanksLoading } = api.bank.getAll.useQuery({});

  const { isLoading: isUserLoading, data: user } = api.auth.user.useQuery();

  const { mutateAsync: validateCoupon, isLoading: isCouponValidationLoading } =
    api.coupon.validate.useMutation({});

  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const step = 100;
  let options: number[] = []

  if (!isUserLoading && user) {
    options = Array.from(
      { length: (Math.min(1000,user.balance) - 100) / step + 1 },
      (_, index) => 100 + index * step
    );
  }

  

  const toast = useToast();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        as="main"
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

                {appliedCoupon && (
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
                )}

                <Divider />

                <Flex mt={4} w="full" justifyContent="space-between">
                  <Text fontSize="lg" fontWeight="semibold">
                    Order Total
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold">
                    ₹
                    {appliedCoupon
                      ? Math.round(
                          cartPrice * (1 - appliedCoupon.discount / 100)
                        )
                      : cartPrice}
                  </Text>
                </Flex>

                {!isUserLoading && user && (
                  <Formik
                    
                    validate={({ address, bank }) => {
                      const errors: { address?: string; bank?: string } = {};
                      if (bank === "") {
                        errors.bank = "Payment Bank required";
                      }
                      if (address === "") {
                        errors.address = "Address Required";
                      }
                      return errors;
                    }}
                    initialValues={{
                      code: "",
                      bank: "",
                      address: "",
                      coins: 0,
                    }}
                    
                    onSubmit={({ address, bank, coins }) => {
                      const items = [] as {
                        candy: string;
                        itemsInCart: number;
                      }[];

                      cartItems.forEach(({ _id, itemsInCart }) => {
                        items.push({
                          candy: _id,
                          itemsInCart,
                        });
                      });

                      createOrder({
                        items,
                        address,
                        bank,
                        code: appliedCoupon?.code,
                        coinsToRedeem: Number(coins),
                      });
                    }}
                  >
                    {({ values, isSubmitting, isValid, dirty }) => (
                      <Form>
                        {JSON.stringify(values, null, 4)}
                        <VStack alignItems="start" mt={4}>
                          {true && (
                            <SelectControl
                              label="Select Bank"
                              name="bank"
                              selectProps={{ placeholder: "Select Bank" }}
                            >
                              {!isBanksLoading &&
                                data?.banks.map((bank, i) => (
                                  <option key={i} value={bank._id}>
                                    {bank.name}
                                  </option>
                                ))}
                            </SelectControl>
                          )}

                          <InputControl name="address" label="Address" />

                          <Flex
                            mt={4}
                            w="full"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Field
                              mr={4}
                              as={Input}
                              name="code"
                              placeholder="Coupon"
                            />
                            <Button
                              isDisabled={isCouponValidationLoading || appliedCoupon !== null}
                              isLoading={isCouponValidationLoading}
                              onClick={async () => {
                                try {
                                  const { coupon } = await validateCoupon(
                                    values
                                  );
                                  setAppliedCoupon(coupon);
                                  toast({
                                    title: "Applied Coupon",

                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                  });
                                } catch (err) {
                                  const error = err as any;

                                  toast({
                                    title: "Cannot Apply Coupon",
                                    description: error.shape.message,
                                    status: "error",
                                    duration: 9000,
                                    isClosable: true,
                                  });
                                }
                              }}
                              type="button"
                            >
                              Apply
                            </Button>
                          </Flex>
                          <Flex mt={4} w="full" justifyContent="space-between">
                            <Text>Available coins</Text>
                            <Text>{user?.balance}🪙</Text>
                          </Flex>
                          {user.balance < 100 && (
                            <Alert mt={2} status="info">
                              <AlertIcon />
                              Minimum 100 reward coins required to be claimed
                            </Alert>
                          )}

                          {user.balance > 100 && (
                            <SelectControl
                              label="Redeem coins"
                              name="coins"
                              selectProps={{ placeholder: "Select Coins" }}
                            >
                              {options.map((value, i) => (
                                <option key={i} value={value}>
                                  {value}
                                </option>
                              ))}
                            </SelectControl>
                          )}
                        </VStack>

                        {!isUserLoading && !user && (
                          <Alert mt={4} status="info">
                            <AlertIcon />
                            Login to place an order.
                          </Alert>
                        )}
                        {!isUserLoading &&
                          user &&
                          (user.role === Role.Vendor ||
                            user.role === Role.Admin) && (
                            <Alert mt={4} status="info">
                              <AlertIcon />
                              Login as a customer to place an order.
                            </Alert>
                          )}

                        {!isUserLoading && user && (
                          <Button
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting || !isValid || !dirty}
                            mt={4}
                            type="submit"
                            py={6}
                            w="full"
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
            <VStack divider={<StackDivider />} px={6}>
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