import { NextPageWithLayout } from "@/pages/_app";

import React from "react";
import UserLayout from "@/layouts/user-layout";
import { api } from "@/utils/api";
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
import usePagination from "@/hooks/use-pagination/usePagination";

const Profile: NextPageWithLayout = () => {
  const { isLoading: isUserLoading, data: user } = api.auth.user.useQuery();

  return (
    <>
      {user && (
        <Container
          maxW="lg"
          py={{ base: "12", md: "24" }}
          px={{ base: "0", sm: "8" }}
        >
          <Heading as="h1">User Profile</Heading>
          {JSON.stringify(user)}
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Coin Balance: {user.balance}🪙</Text>
          <Text>
            Total earned coins:{" "}
            {user.totalEarnedCoins ? user.totalEarnedCoins : 0}🪙
          </Text>
          <Text>
            Total redeemed coins:{" "}
            {user.totalRedeemedCoins ? user.totalRedeemedCoins : 0}🪙
          </Text>
        </Container>
      )}
    </>
  );
};

Profile.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Profile;
