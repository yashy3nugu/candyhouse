import BaseLayout from "@/layouts/base-layout";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import // ... (import other Chakra UI components)
"@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Form, Formik } from "formik";
import { FaStar } from "react-icons/fa";
import VendorLayout from "@/layouts/vendor-layout";
import Head from "next/head";
import { useState } from "react"; // Import useState
import useImageUpload from "@/hooks/use-image-upload";

const Candy: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const { mutate, isLoading } = api.candy.create.useMutation({
    onSuccess() {
      alert("created");
    },
    onError() {
      alert("not created");
    },
  });

  const dispatch = useAppDispatch();

  const { isLoading: isCandyLoading, data: candy } = api.candy.oneById.useQuery(
    {
      id: id as string,
    }
  );

  // State to track edit mode
  const [editMode, setEditMode] = useState(false);

  // State to track candy data changes
  const [candyData, setCandyData] = useState({
    name: candy?.name || "",
    description: candy?.description || "",
    price: candy?.price || 0,
    quantity: candy?.quantity || 0,
    // Add other candy properties here
  });

  const imageRef = React.useRef<any>();
  const { imageDataURI, imageUrl, uploadFile } = useImageUpload();

  // ... (rest of the code)

  if (candy) {
    return (
      <>
        <Head>
          <title>Edit Candy</title>
          <meta name="description" content="Edit Candy" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Container
            maxW="lg"
            py={{ base: "12", md: "24" }}
            px={{ base: "0", sm: "8" }}
          >
            <Stack spacing="8">
              <Stack spacing="6">
                <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                  <Heading size={{ base: "xs", md: "sm", lg: "xl" }}>
                    {editMode ? "Edit Candy" : "Candy Details"}
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
                  initialValues={candyData}
                  // validationSchema={toFormikValidationSchema(candySchema)}
                  onSubmit={async (values) => {
                    if (imageDataURI) {
                      // Handle image upload and candy update
                      // ... (add your image upload and candy update logic here)
                    }
                  }}
                >
                  {({ isSubmitting, isValid, dirty, values, errors }) => (
                    <Form>
                      {editMode ? (
                        <>
                          {/* Editable input fields */}
                          <InputControl
                            name="name"
                            label="Name"
                            placeholder="Name"
                            isDisabled={!editMode}
                          />
                          <TextareaControl
                            name="description"
                            label="Description"
                            placeholder="Description"
                            isDisabled={!editMode}
                          />

                          {/* ... (other input fields) */}
                        </>
                      ) : (
                        <>
                          {/* Display candy details */}
                          <Text>Name: {candy.name}</Text>
                          <Text>Description: {candy.description}</Text>

                          {/* ... (other candy details) */}
                        </>
                      )}

                      {/* Upload image and edit button */}
                      {editMode ? (
                        <Flex
                          my={4}
                          w="full"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box position="relative" h={20} w={20}>
                            {imageUrl && (
                              <Image
                                src={imageUrl || ""}
                                alt="Candy Picture"
                                fill
                              />
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
                      ) : null}

                      {/* Edit and Save buttons */}
                      {editMode ? (
                        <Button
                          isLoading={isSubmitting}
                          isDisabled={
                            isSubmitting || !isValid || !dirty || !imageUrl
                          }
                          colorScheme="pink"
                          type="submit"
                          w="full"
                        >
                          Save
                        </Button>
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
        </main>
      </>
    );
  }

  return null;
};

Candy.getLayout = (page) => {
  return <VendorLayout>{page}</VendorLayout>;
};

export default Candy;
