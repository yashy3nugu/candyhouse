import { NextPageWithLayout } from "@/pages/_app";
import React from "react";
import UserLayout from "@/layouts/user-layout";
import { useLoggedInUserQuery } from "@/api/user";
import { Container, Heading, Text } from "@chakra-ui/react";
import Seo from "@/components/shared/seo";
import { usePaginatedOrderQuery } from "@/api/order";
import usePagination from "@/hooks/use-pagination/usePagination";
import OrderDataTable from "@/components/order-data-table";

const Profile: NextPageWithLayout = () => {
  const { isLoading: isUserLoading, data: loggedInUserData } =
    useLoggedInUserQuery();

  const { page, handleNextPage, handlePrevPage } = usePagination({
    initialPage: 1,
  });

  const { data: orders, isLoading } = usePaginatedOrderQuery(page);

  return (
    <>
      <Seo title="Profile" />
      <Container maxW="3xl" mt="4">
        {loggedInUserData && (
          <div>
            <Heading as="h1" mb="4">
              User Profile
            </Heading>
            <Text fontSize="md">
              <strong>Name:</strong> {loggedInUserData.user.name}
            </Text>
            <Text fontSize="md">
              <strong>Email:</strong> {loggedInUserData.user.email}
            </Text>
            {/* <Text fontSize="md">
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
            </Text> */}

            <Heading as="h2" fontSize="xl" mb={5} mt={5}>Orders placed</Heading>
            {orders && (
              <OrderDataTable
                {...{ page }}
                data={orders}
                linkUrl="/user/profile/orders"
                nextPage={handleNextPage}
                previousPage={handlePrevPage}
              />
            )}
          </div>
        )}
      </Container>
    </>
  );
};

Profile.getLayout = (page) => <UserLayout>{page}</UserLayout>;

export default Profile;
