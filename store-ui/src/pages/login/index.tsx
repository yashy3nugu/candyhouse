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

// import { api } from "@/utils/api";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { loginInputSchema } from "@/utils/schemas/auth";
import InputControl from "@/components/ui/input-control";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import Link from "next/link";
import { useLoginMutation } from "@/api/user";
import Seo from "@/components/shared/seo";

const Login: NextPageWithLayout = () => {
  const { mutate: loginMutate } = useLoginMutation();

  return (
    <>
      <Seo title="Login"/>

      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "sm", lg: "xl" }}>
                Log in to your account
              </Heading>
              <HStack justify="center">
                <Text color="fg.muted">Do not have an account?</Text>
                <Link href="/signup">
                  <Button variant="text" size="sm">
                    Sign up
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
                email: "",
                password: "",
              }}
              validationSchema={toFormikValidationSchema(loginInputSchema)}
              onSubmit={(values, actions) => {
                loginMutate({
                  ...values,
                });

                actions.resetForm();
              }}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form>
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

                  <Button
                    isDisabled={isSubmitting || !isValid || !dirty}
                    isLoading={isSubmitting}
                    w="full"
                    mt={4}
                    type="submit"
                  >
                    Login
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

Login.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Login;
