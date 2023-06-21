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
} from "@chakra-ui/react";
import { useAppDispatch } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";

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
      <main>
        {JSON.stringify(data, null, 4)}
        {data?.candies.map((candy) => (
          <Card key={candy._id} border={"1px"} borderColor={"black"}>
            <CardHeader>
              <Heading>{candy.name}</Heading>
            </CardHeader>

            <CardBody>
              <Text>{candy.description}</Text>
              <Text>{candy.price}</Text>
              <Button
                onClick={() => {
                  dispatch(addCandyToCart({ candy }));
                }}
              >
                Add to cart
              </Button>
              <Button
                onClick={() => {
                  dispatch(removeCandyFromCart({ candy }));
                }}
              >
                Remove from cart
              </Button>
            </CardBody>
          </Card>
        ))}
      </main>
    </>
  );
};

Store.getLayout = (page) => {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Store;
