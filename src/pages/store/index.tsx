import { type NextPage } from "next";
import Head from "next/head";

import { api } from "@/utils/api";
import {
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  Box,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import Image from "@/components/shared/image";
import { useAppDispatch } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import CandyCard from "@/components/candy-card";

const Store: NextPageWithLayout = () => {
  const { data, isLoading } = api.candy.all.useQuery({});

  const dispatch = useAppDispatch();

  

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="main">
        <Box maxWidth="3xl" margin="0 auto" px={5}>
          <SimpleGrid columns={{sm:2, md:3}} spacing={{base: 3,md: 4,lg:4}}>
            {data?.candies.map((candy) => (
              <GridItem key={candy._id}>
                
                <CandyCard candy={candy} />
              </GridItem>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

Store.getLayout = (page) => {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Store;
