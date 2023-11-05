import { NextPageWithLayout } from "@/pages/_app";
import React from "react";
import UserLayout from "@/layouts/user-layout";
import { useLoggedInUserQuery } from "@/api/user";
import { Container, Heading, Text } from "@chakra-ui/react";
import Seo from "@/components/shared/seo";

const Profile: NextPageWithLayout = () => {
  const { isLoading: isUserLoading, data: loggedInUserData } =
    useLoggedInUserQuery();

  return (
    <>
      <Seo title="Profile" />
      <Container maxW="sm" mt="4">
        {loggedInUserData && (
          <div>
            <Heading as="h1" size="lg" mb="4">
              User Profile
            </Heading>
            <Text fontSize="md">
              <strong>Name:</strong> {loggedInUserData.user.name}
            </Text>
            <Text fontSize="md">
              <strong>Email:</strong> {loggedInUserData.user.email}
            </Text>
            <Text fontSize="md">
              <strong>Coin Balance:</strong> {loggedInUserData.user.balance}🪙
            </Text>
            <Text fontSize="md">
              <strong>Total earned coins:</strong>{" "}
              {loggedInUserData.user.totalEarnedCoins
                ? loggedInUserData.user.totalEarnedCoins
                : 0}
              🪙
            </Text>
            <Text fontSize="md">
              <strong>Total redeemed coins:</strong>{" "}
              {loggedInUserData.user.totalRedeemedCoins
                ? loggedInUserData.user.totalRedeemedCoins
                : 0}
              🪙
            </Text>
          </div>
        )}
      </Container>
    </>
  );
};

Profile.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Profile;
