import BaseLayout from "@/layouts/base-layout";
import { NextPageWithLayout } from "@/pages/_app";
// import { api } from "@/utils/api";
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
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import { Form, Formik } from "formik";
import SelectControl from "@/components/ui/select-control";
import InputControl from "@/components/ui/input-control";
import TextareaControl from "@/components/ui/textarea-control";

import { useCandyByIdQuery } from "@/api/candy";
import Seo from "@/components/shared/seo";

const Candy: NextPageWithLayout = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { isLoading: isCandyLoading, data: candy } = useCandyByIdQuery(
    router.query.id as string
  );

  // const { mutate, isLoading } = api.review.create.useMutation({
  //   onSuccess() {
  //     //
  //   },
  //   onError() {
  //     //
  //   },
  // });

  // const { isLoading: isReviewsLoading, data: reviews } =
  //   api.review.allByCandyId.useQuery({ id: router.query.id as string });

  const cartCandy = useAppSelector((state) => state.cart.items).find(
    (item) => item._id === candy?._id
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (isCandyLoading) {
    return <></>;
  }

  if (candy)
    return (
      <>
        <Seo title="View Candy" />
        <Modal isOpen={isOpen} onClose={onClose}>
          <Formik
            onSubmit={(values) => {
              // mutate({
              //   ...values,
              //   candy: candy._id,
              //   rating: parseInt(values.rating),
              // });
            }}
            initialValues={{
              description: "",
              rating: "5",
              title: "",
            }}
          >
            {({ isSubmitting, isValid, dirty, values }) => (
              <>
                <Form>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Write a review</ModalHeader>

                    <ModalCloseButton isDisabled={isSubmitting || !isValid} />
                    <ModalBody>
                      <SelectControl
                        label="Rating"
                        name="rating"
                        helperText="Rate the candy out of 5"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </SelectControl>
                      <InputControl
                        name="title"
                        label="Title"
                        helperText="Summarize your review in a sentence"
                      />
                      <TextareaControl
                        name="description"
                        label="Description"
                        helperText="Describe in detail how you liked the candy"
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        isDisabled={isSubmitting || !isValid}
                        type="button"
                        mr={3}
                        onClick={onClose}
                      >
                        Close
                      </Button>
                      <Button
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting || !isValid || !dirty}
                        type="submit"
                        colorScheme="pink"
                      >
                        Post
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Form>
              </>
            )}
          </Formik>
        </Modal>
        <Container
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
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    w="full"
                    flexDirection="row-reverse"
                  >
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
                    <Text fontWeight="bold">₹{candy.price}</Text>
                  </Flex>
                </VStack>
              </GridItem>
            </SimpleGrid>
          </Card>
          <Heading fontSize="3xl" fontWeight="semibold" as="h2" mt={5}>
            Customer Reviews
          </Heading>
          {/* <Flex alignItems="center">
            <Text fontSize="6xl">{reviews?.averageRating}</Text>
            <Box ml={2}>
              <HStack>
                <Icon
                  color={reviews!.averageRating >= 1 ? "pink.500" : "gray.200"}
                  as={FaStar}
                />
                <Icon
                  color={reviews!.averageRating >= 2 ? "pink.500" : "gray.200"}
                  as={FaStar}
                />
                <Icon
                  color={reviews!.averageRating >= 3 ? "pink.500" : "gray.200"}
                  as={FaStar}
                />
                <Icon
                  color={reviews!.averageRating >= 4 ? "pink.500" : "gray.200"}
                  as={FaStar}
                />
                <Icon
                  color={reviews!.averageRating >= 5 ? "pink.500" : "gray.200"}
                  as={FaStar}
                />
              </HStack>
              <Text>
                Based on {reviews?.reviews.length} review
                {reviews!.reviews.length > 1 && "s"}
              </Text>
            </Box>
          </Flex> */}

          <Button colorScheme="pink" onClick={onOpen}>
            Write a review
          </Button>
          {/* <Accordion mt={5} allowToggle>
            {reviews &&
              reviews.reviews.map((review, i) => (
                <AccordionItem key={i}>
                  <h2>
                    <AccordionButton>
                      <Flex
                        as="span"
                        justifyContent="space-between"
                        w="full"
                        textAlign="left"
                        pr={4}
                      >
                        <Text fontWeight="semibold">{review.title}</Text>

                        <Box>
                          {Array(review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Icon color="pink.500" key={i} as={FaStar} />
                            ))}
                          {Array(5 - review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Icon color="gray.200" key={i} as={FaStar} />
                            ))}
                        </Box>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text fontSize="md">{review.description}</Text>

                    <Text mt={4} color="gray.400" fontSize="sm">
                      by {(review.reviewer as any).name}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion> */}
        </Container>
      </>
    );
};

Candy.getLayout = (page) => {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Candy;
