import { type NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import Image from "next/image";

import { api } from "@/utils/api";
import NumberInputControl from "@/components/ui/number-input-control";
import InputControl from "@/components/ui/input-control";
import { NextPageWithLayout } from "@/pages/_app";
import VendorProvider from "@/components/provider/VendorProvider";
import { toFormikValidationSchema } from "zod-formik-adapter";
import candySchema from "@/utils/schemas/candy";
import React from "react";
import useImageUpload from "@/hooks/use-image-upload";
import TextareaControl from "@/components/ui/textarea-control";
import VendorLayout from "@/layouts/vendor-layout";
import { useCreateCandyMutation, useSignedUrlQuery } from "@/api/candy";
import Seo from "@/components/shared/seo";

const CreateCandy: NextPageWithLayout = () => {
  const { mutate, isPending: isLoading } = useCreateCandyMutation();

  const imageRef = React.useRef<any>();
  const { imageDataURI, imageUrl, uploadFile } = useImageUpload();

  const { refetch } = useSignedUrlQuery();

  return (
    <>
      <Seo title="Create Candy" />

      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "sm", lg: "xl" }}>
                Create a candy
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
              initialValues={{
                name: "",
                description: "",
                price: 0,
                quantity: 0,
              }}
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
                }
              }}
            >
              {({ isSubmitting, isValid, dirty, values, errors }) => (
                <Form>
                  <InputControl name="name" label="Name" placeholder="Name" />
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
                  <Flex
                    my={4}
                    w="full"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box position="relative" h={20} w={20}>
                      {imageUrl && (
                        <Image src={imageUrl || ""} alt="Candy Picture" fill />
                      )}
                    </Box>
                    <Button
                      onClick={() => {
                        imageRef.current.click();
                      }}
                      type="button"
                    >
                      Upload Image
                    </Button>
                  </Flex>

                  <Button
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting || !isValid || !dirty || !imageUrl}
                    colorScheme="pink"
                    type="submit"
                    w="full"
                  >
                    Create
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

CreateCandy.getLayout = (page) => <VendorLayout>{page}</VendorLayout>;

export default CreateCandy;
