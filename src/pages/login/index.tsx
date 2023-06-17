import { type NextPage } from "next";
import Head from "next/head";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { api } from "@/utils/api";


const Login: NextPage = () => {

  const { mutate, isLoading } = api.auth.login.useMutation({
    onSuccess() {
      alert("logged in");
    },
    onError() {
      alert("not logged in");
    },
  });
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
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
                <Heading size={{ base: "xs", md: "sm" }}>
                  Log in to your account
                </Heading>
                <HStack spacing="1" justify="center">
                  <Text color="fg.muted">Do not have an account?</Text>
                  <Button variant="text" size="lg">
                    Sign up
                  </Button>
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
                onSubmit={(values) => {
                  mutate({
                    ...values
                  })
                }}
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form>
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="Email"
                    />
                    <Field
                      as={Input}
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                    <Button type="submit">Login</Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Stack>
        </Container>
      </main>
    </>
  );
};

export default Login;
