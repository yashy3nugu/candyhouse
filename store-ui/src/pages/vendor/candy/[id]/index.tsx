import { NextPageWithLayout } from "@/pages/_app";
// import { api } from "@/utils/api";
import {
  Text,
  Box,
  Container,
  Flex,
  Button,
  Heading,
  Stack,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";

import { Form, Formik } from "formik";

import InputControl from "@/components/ui/input-control";
import TextareaControl from "@/components/ui/textarea-control";

import VendorLayout from "@/layouts/vendor-layout";

import NumberInputControl from "@/components/ui/number-input-control";

import React, { useState } from "react";
import useImageUpload from "@/hooks/use-image-upload";
import {
  useCandyByIdQuery,
  useSignedUrlQuery,
  useUpdateCandyMutation,
} from "@/api/candy";
import Seo from "@/components/shared/seo";

const Candy: NextPageWithLayout = () => {
  const router = useRouter();

  const { mutate } = useUpdateCandyMutation(router.query.id as string);

  const { data: candy } = useCandyByIdQuery(router.query.id as string);

  const imageRef = React.useRef<any>();
  const { imageDataURI, imageUrl, uploadFile } = useImageUpload();

  const [editMode, setEditMode] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const { refetch } = useSignedUrlQuery();

  if (candy)
    return (
      <>
        <Seo title="View Candy" />

        <Container
          maxW="lg"
          py={{ base: "12", md: "24" }}
          px={{ base: "0", sm: "8" }}
        >
          <Stack spacing="8">
            <Stack spacing="6">
              <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                <Heading size={{ base: "xs", md: "sm", lg: "xl" }}>
                  View/Edit your candy
                </Heading>
              </Stack>
            </Stack>
            <Box
              py={{ base: "0", sm: "8" }}
              px={{ base: "4", sm: "10" }}
              bg={{ base: "transparent", sm: "bg.surface" }}
              boxShadow={{ base: "none", sm: "md" }}
              borderRadius={{ base: "none", sm: "xl" }}
            >
              <Formik
                initialValues={candy}
                //validationSchema={toFormikValidationSchema(candySchema)}
                onSubmit={async (values) => {
                  if (imageDataURI) {
                    const formData = new FormData();

                    const { data: rData } = await refetch();

                    if (!rData) {
                      return;
                    }

                    formData.append("file", imageDataURI);
                    formData.append("signature", rData.signature);
                    formData.append("api_key", rData.api_key);
                    formData.append("timestamp", `${rData.timestamp}`);
                    formData.append("folder", `candies`);
                    console.log("appended fd");

                    const imgRes = await fetch(`${rData.url}`, {
                      method: "POST",
                      body: formData,
                    });

                    console.log("got imgres");

                    await imgRes.json().then((d) => {
                      const photo = {
                        publicId: d.public_id,
                        url: d.secure_url,
                      };
                      console.log("mutating with d as ", d);
                      mutate({
                        ...values,
                        photo,
                      });
                    });
                  } else {
                    mutate({
                      ...values,
                    });
                  }
                }}
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form>
                    {editMode ? (
                      <>
                        <InputControl
                          name="name"
                          label="Name"
                          placeholder="Name"
                        />
                        <TextareaControl
                          name="description"
                          label="Description"
                          placeholder="Name"
                        />

                        <NumberInputControl name="price" label="Price" />
                        <NumberInputControl name="quantity" label="Quantity" />
                        <Input
                          display="none"
                          type="file"
                          ref={imageRef}
                          onChange={uploadFile}
                        />
                      </>
                    ) : (
                      <>
                        <Text>Name: {candy.name}</Text>
                        <Text>Description: {candy.description}</Text>
                        <Text>Quantity: {candy.quantity}</Text>
                        <Text>Price: {candy.price}</Text>

                        {/* <Image
                            src={candy.photo.url || ""}
                            alt="Candy Picture"
                            fill
                          /> */}
                      </>
                    )}

                    <Flex
                      my={4}
                      w="full"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box position="relative" h={20} w={20}>
                        <Image
                          src={imageUrl ? imageUrl : candy.photo.url}
                          alt="Candy Picture"
                          fill
                        />
                      </Box>
                      {editMode && (
                        <Button
                          onClick={() => {
                            setImageChanged(true);
                            imageRef.current.click();
                          }}
                          type="button"
                        >
                          Change Image
                        </Button>
                      )}
                    </Flex>

                    {editMode ? (
                      <>
                        {/* dirty && valid || !dirty && isValid && imageDataUri */}

                        <Button
                          isLoading={isSubmitting}
                          // isDisabled={isSubmitting || !isValid || !dirty}
                          isDisabled={
                            !(
                              (imageChanged && isValid) ||
                              (isValid && dirty)
                            ) || isSubmitting
                          }
                          colorScheme="pink"
                          type="submit"
                          w="full"
                          mb={2}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditMode(false)}
                          colorScheme="pink"
                          w="full"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditMode(true)}
                        colorScheme="pink"
                        w="full"
                      >
                        Edit
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </Box>
          </Stack>
        </Container>
      </>
    );
};

Candy.getLayout = (page) => {
  return <VendorLayout>{page}</VendorLayout>;
};

export default Candy;
