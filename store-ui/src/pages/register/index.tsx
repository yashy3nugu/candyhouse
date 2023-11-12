import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  
} from "@chakra-ui/react";

import InputControl from "@/components/ui/input-control";
import Link from "next/link";
import { NextPageWithLayout } from "@/pages/_app";
import BaseLayout from "@/layouts/base-layout";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { registerFormSchema } from "@/utils/schemas/auth";
import { useRegisterMutation } from "@/api/user";
import { Role } from "@/utils/types/user";
import Seo from "@/components/shared/seo";

const Register: NextPageWithLayout = () => {
  
  // const { mutate, isLoading } = api.auth.register.useMutation({
  //   onSuccess() {
  //     //
  //   },
  //   onError() {
  //     toast({
  //       title: "Unable to register",
  //       description: "User with same email exists",
  //       status: "error",
  //       duration: 9000,
  //       isClosable: true,
  //       position: "top",
  //     });
  //   },
  // });
  const { mutate } = useRegisterMutation();

  return (
    <>
      <Seo title="Register" />
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "sm", lg: "xl" }}>
                Sign up for an account
              </Heading>
              <HStack justify="center">
                <Text color="fg.muted">Sign up as Vendor?</Text>
                <Link href="/vendor/register">
                  <Button variant="text" size="sm">
                    Click Here
                  </Button>
                </Link>
              </HStack>
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
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={toFormikValidationSchema(registerFormSchema)}
              onSubmit={(values, actions) => {
                mutate({
                  ...values,
                  role: Role.User,
                });
                actions.resetForm();
              }}
            >
              {({ isValid, dirty, isSubmitting }) => (
                <Form>
                  <InputControl name="name" label="Name" placeholder="Name" />
                  <InputControl
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Password"
                  />
                  <InputControl
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Password"
                  />
                  <InputControl
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Password"
                  />
                  <Button
                    isDisabled={isSubmitting || !isValid || !dirty}
                    isLoading={isSubmitting}
                    type="submit"
                    w="full"
                    mt={4}
                  >
                    Sign up
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

Register.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Register;
