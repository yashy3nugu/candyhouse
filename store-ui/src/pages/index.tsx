// import { api } from "@/utils/api";
import {
  Flex,
  Heading,
  SimpleGrid,
  Button,
  Box,
  Image,
  Text,
  Container,
} from "@chakra-ui/react";

import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "./_app";
import BaseLayout from "@/layouts/base-layout";
import Seo from "@/components/shared/seo";

const Home: NextPageWithLayout = () => {
  
  return (
    <>
      <Seo />
      <Container
        maxW="2xl"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
      >
        <Flex direction="column" align="center" p={4}>
          <Heading as="h1" fontSize="3xl" my={4}>
            Welcome to the Candy Store
          </Heading>

          <Text fontSize="xl" textAlign="center" my={4}>
            Indulge in a world of sweetness at the Candy Store. We offer a
            delightful selection of candies that will satisfy your cravings.
            Explore a variety of flavors and treat yourself to the sweetest
            delights. Whether you have a sweet tooth or are looking for the
            perfect gift, our candy collection has something for everyone.
          </Text>

          {/* Shop Now Button */}
          <Link href="/store">
            <Button my={6} colorScheme="pink" size="lg">
              Shop Now
            </Button>
          </Link>
        </Flex>
      </Container>
    </>
  );
};

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Home;
