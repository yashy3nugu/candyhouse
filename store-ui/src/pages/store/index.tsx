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
  Skeleton,
} from "@chakra-ui/react";
import Image from "@/components/shared/image";
import { useAppDispatch } from "@/store/hooks";
import { addCandyToCart, removeCandyFromCart } from "@/store/modules/cart";
import { NextPageWithLayout } from "../_app";
import BaseLayout from "@/layouts/base-layout";
import CandyCard from "@/components/candy-card";
import { fakeCandy } from "@/utils/fake";
import { usePaginatedCandyQuery } from "@/api/candy";
import { useRouter } from "next/router";
import usePagination from "@/hooks/use-pagination/usePagination";
import Seo from "@/components/shared/seo";
import Pagination from "@/components/shared/pagination";

const Store: NextPageWithLayout = () => {
  const router = useRouter();
  const { page, handleNextPage, handlePrevPage } = usePagination({});
  const { data, isLoading } = usePaginatedCandyQuery(page);

  const dispatch = useAppDispatch();

  return (
    <>
      <Seo title="store" />
      <Box>
        <Box maxWidth="3xl" margin="0 auto" px={5}>
          <SimpleGrid
            columns={{ sm: 2, md: 3 }}
            spacing={{ base: 3, md: 4, lg: 4 }}
          >
            {isLoading &&
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i}>
                    <CandyCard candy={fakeCandy} />
                  </Skeleton>
                ))}
            {!isLoading &&
              data?.candies.map((candy) => (
                <GridItem key={candy._id}>
                  <CandyCard candy={candy} />
                </GridItem>
              ))}
          </SimpleGrid>
          {data && (
            <Pagination
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              page={page}
              prevDisabled={page === 1}
              nextDisabled={!data.hasMore}
              hasMore={data.hasMore}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

Store.getLayout = (page) => {
  return <BaseLayout>{page}</BaseLayout>;
};

export default Store;
