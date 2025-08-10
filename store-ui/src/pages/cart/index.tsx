
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
import { useCreateOrderMutation, useConfirmOrderMutation } from "@/api/order";
import { OrderDataItem } from "@/api/order/types";
import Seo from "@/components/shared/seo";
// import PaymentModal from "@/components/payment-modal";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Cart: NextPageWithLayout = () => {
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartValue = useAppSelector((state) => state.cart.value);
  const cartPrice = useAppSelector((state) => state.cart.price);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formAddress, setFormAddress] = useState('');

  const { mutate: createOrder } = useCreateOrderMutation();
  const { mutate: confirmOrder } = useConfirmOrderMutation();


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

  // Stripe payment form component
  function StripeCheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderConfirmed, setOrderConfirmed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setLoading(true);
      setError(null);
      const result = await stripe.confirmCardPayment(clientSecret!, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      if (result.error) {
        setLoading(false);
        setError(typeof result.error.message === 'string' ? result.error.message : 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Call backend to confirm and create order using the mutation
        confirmOrder(
          {
            paymentIntentId: result.paymentIntent.id,
            items: cartItems,
            address: formAddress,
          },
          {
            onSuccess: () => {
              setOrderConfirmed(true);
              setPaymentSuccess(true);
              setLoading(false);
            },
            onError: (error: any) => {
              setError(error?.response?.data?.message || 'Order confirmation failed');
              setLoading(false);
            },
          }
        );
      } else {
        setLoading(false);
        setError('Payment not successful');
      }
    };

    return (
      orderConfirmed ? (
        <Alert status="success"><AlertIcon />Order placed successfully!</Alert>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <CardElement options={{ hidePostalCode: true }} />
          <Button mt={4} colorScheme="pink" type="submit" isLoading={loading} w="full">
            Pay
          </Button>
          {error && <Alert status="error" mt={2}><AlertIcon />{error}</Alert>}
        </form>
      )
    );
  }

  return (
    <>
      <Seo title="Cart" />
      <Container
        maxW="3xl"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        {paymentSuccess ? (
          <Alert status="success"><AlertIcon />Payment successful! Your order has been placed.</Alert>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm />
          </Elements>
        ) : cartValue > 0 ? (
          <>
            <Card w="full" mb={5}>
              <CardBody>
                <Flex mt={4} w="full" justifyContent="space-between">
                  <Text fontSize="md" fontWeight="base">
                    Subtotal
                  </Text>
                  <Text fontSize="md" fontWeight="base">
                    ${cartPrice}
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
                      setFormAddress(address);
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

                      createOrder(
                        { items, address },
                        {
                          onSuccess: (data) => {
                            if (typeof data?.clientSecret === 'string') {
                              setClientSecret(data.clientSecret);
                            }
                          },
                        }
                      );
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
