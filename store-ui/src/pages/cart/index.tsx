
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
  Box,
  HStack,
} from "@chakra-ui/react";
import {useAppSelector, useAppDispatch } from "@/store/hooks";


import { Role } from "@/utils/types/user";
import { Form, Formik } from "formik";
import SelectControl from "@/components/ui/select-control";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import CartItem from "@/components/cart-item";
import InputControl from "@/components/ui/input-control";

import { useLoggedInUserQuery } from "@/api/user";
import { useCreateOrderMutation } from "@/api/order";
import { OrderCreateItem } from "@/api/order/types";
import Seo from "@/components/shared/seo";
// import PaymentModal from "@/components/payment-modal";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { clearCart } from "@/store/modules/cart";
import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// US States array for dropdown
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
];

const Cart: NextPageWithLayout = () => {
  
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartValue = useAppSelector((state) => state.cart.value);
  const cartPrice = useAppSelector((state) => state.cart.price);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // const [formAddress, setFormAddress] = useState('');

  const { mutate: createOrder } = useCreateOrderMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();


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
      
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) return;
      
      const result = await stripe.confirmCardPayment(clientSecret!, {
        payment_method: {
          card: cardNumberElement,
        },
      });
      
      if (result.error) {
        setLoading(false);
        setError(typeof result.error.message === 'string' ? result.error.message : 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Webhook-based finalization: show success and let backend finalize via webhook
        setOrderConfirmed(true);
        setPaymentSuccess(true);
        setLoading(false);
        dispatch(clearCart());
        setTimeout(() => {
          void router.push('/user/profile/orders');
        }, 2000);
      } else {
        setLoading(false);
        setError('Payment not successful');
      }
    };

    const cardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    };

    return (
      orderConfirmed ? (
        <Alert status="success"><AlertIcon />Order placed successfully!</Alert>
      ) : (
        <Card maxW="md" mx="auto" shadow="lg">
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                {/* Card Number */}
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                    Card number
                  </Text>
                  <Box
                    p={3}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    bg="white"
                    _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                  >
                    <CardNumberElement options={cardElementOptions} />
                  </Box>
                </Box>

                {/* Expiry, CVC, and ZIP */}
                <HStack spacing={4}>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                      Expiry
                    </Text>
                    <Box
                      p={3}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      bg="white"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    >
                      <CardExpiryElement options={cardElementOptions} />
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                      CVC
                    </Text>
                    <Box
                      p={3}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      bg="white"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    >
                      <CardCvcElement options={cardElementOptions} />
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">
                      ZIP
                    </Text>
                    <Box
                      p={3}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="md"
                      bg="white"
                      _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                    >
                      <input
                        type="text"
                        placeholder="12345"
                        maxLength={5}
                        style={{
                          border: 'none',
                          outline: 'none',
                          width: '100%',
                          fontSize: '16px',
                          color: '#424770',
                          backgroundColor: 'transparent'
                        }}
                      />
                    </Box>
                  </Box>
                </HStack>

                {/* Pay Button */}
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Processing..."
                  colorScheme="pink"
                  size="lg"
                  w="full"
                  mt={4}
                  isDisabled={!stripe || loading}
                >
                  Pay ${cartPrice}
                </Button>

                {/* Powered by Stripe */}
                <HStack justify="center" spacing={1} mt={3}>
                  <Text fontSize="xs" color="gray.500">
                    Powered by
                  </Text>
                  <Text fontSize="xs" color="gray.700" fontWeight="semibold" letterSpacing="wide">
                    stripe
                  </Text>
                </HStack>

                {error && (
                  <Alert status="error" mt={2}>
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </VStack>
            </form>
          </CardBody>
        </Card>
      )
    );
  }

  return (
    <>
      <Seo title="Cart" />
      <Container
        maxW="6xl"
        py={{ base: "8", md: "12" }}
        px={{ base: "4", sm: "8" }}
      >
        {paymentSuccess ? (
          <Alert status="success" maxW="md" mx="auto">
            <AlertIcon />
            Payment successful! Your order has been placed.
          </Alert>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <StripeCheckoutForm />
          </Elements>
        ) : cartValue > 0 ? (
          <VStack spacing={8} align="stretch">
            {/* Cart Items Section */}
            <Box>
              <Heading size="lg" mb={6}>Your cart ({cartValue})</Heading>
              <VStack divider={<StackDivider />} spacing={4}>
                {cartItems.map((candy, i) => (
                  <CartItem key={i} candy={candy} />
                ))}
              </VStack>
            </Box>

            {/* Order Summary and Checkout Section */}
            <Card maxW="md" mx="auto" w="full">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Order Summary</Heading>
                  
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="semibold">
                      Total
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="pink.500">
                      ${cartPrice}
                    </Text>
                  </Flex>

                  {!isUserLoading && !loginData && (
                    <Alert status="info">
                      <AlertIcon />
                      Login to place an order.
                    </Alert>
                  )}

                  {!isUserLoading &&
                    loginData &&
                    (loginData.user?.role === Role.Vendor ||
                      loginData.user?.role === Role.Admin) && (
                      <Alert status="info">
                        <AlertIcon />
                        Login as a customer to place an order.
                      </Alert>
                    )}

                  {!isUserLoading && loginData && (
                    <Formik
                      validate={(values) => {
                        const errors: { 
                          street?: string; 
                          city?: string; 
                          state?: string; 
                          zipCode?: string; 
                        } = {};
                        
                        if (!values.street || values.street.trim() === "") {
                          errors.street = "Street address is required";
                        }
                        if (!values.city || values.city.trim() === "") {
                          errors.city = "City is required";
                        }
                        if (!values.state || values.state.trim() === "") {
                          errors.state = "State is required";
                        }
                        if (!values.zipCode || values.zipCode.trim() === "") {
                          errors.zipCode = "ZIP code is required";
                        } else if (!/^\d{5}(-\d{4})?$/.test(values.zipCode.trim())) {
                          errors.zipCode = "Invalid ZIP code format";
                        }
                        
                        return errors;
                      }}
                      initialValues={{
                        street: "",
                        apartment: "",
                        city: "",
                        state: "",
                        zipCode: "",
                      }}
                      onSubmit={(values) => {
                        // Concatenate address fields into a single string
                        const addressParts = [
                          values.street.trim(),
                          values.apartment.trim() ? `Apt ${values.apartment.trim()}` : "",
                          values.city.trim(),
                          values.state.trim(),
                          values.zipCode.trim()
                        ].filter(part => part !== "");
                        
                        const fullAddress = addressParts.join(", ");
                        
                        const items = [] as OrderCreateItem[];

                        cartItems.forEach(({ itemsInCart, appId }) => {
                          items.push({
                            candy: appId,
                            itemsInCart,
                          });
                        });

                        createOrder(
                          { items, address: fullAddress },
                          {
                            onSuccess: (data: { clientSecret?: string } | any) => {
                              const cs = data?.clientSecret;
                              if (typeof cs === 'string') {
                                setClientSecret(cs);
                              }
                            },
                          }
                        );
                      }}
                    >
                      {({ isSubmitting, isValid, dirty }) => (
                        <Form>
                          <VStack spacing={4} align="stretch">
                            <Heading size="sm" color="gray.700">Delivery Address</Heading>
                            
                            <InputControl 
                              name="street" 
                              label="Street Address" 
                              placeholder="123 Main St"
                            />
                            
                            <InputControl 
                              name="apartment" 
                              label="Apartment, Suite, etc. (Optional)" 
                              placeholder="Apt 4B"
                            />
                            
                            <HStack spacing={4}>
                              <Box flex={2}>
                                <InputControl 
                                  name="city" 
                                  label="City" 
                                  placeholder="New York"
                                />
                              </Box>
                              <Box flex={1}>
                                <SelectControl 
                                  name="state" 
                                  label="State" 
                                  selectProps={{ placeholder: "Select state" }}
                                >
                                  <option value="">Select state</option>
                                  {US_STATES.map((state) => (
                                    <option key={state.value} value={state.value}>
                                      {state.label}
                                    </option>
                                  ))}
                                </SelectControl>
                              </Box>
                              <Box flex={1}>
                                <InputControl 
                                  name="zipCode" 
                                  label="ZIP Code" 
                                  placeholder="10001"
                                />
                              </Box>
                            </HStack>
                            
                            <Button
                              isLoading={isSubmitting}
                              isDisabled={isSubmitting || !isValid || !dirty}
                              type="submit"
                              colorScheme="pink"
                              size="lg"
                              w="full"
                              mt={2}
                            >
                              Proceed to Payment
                            </Button>
                          </VStack>
                        </Form>
                      )}
                    </Formik>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        ) : (
          <Alert status="warning" maxW="md" mx="auto">
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
