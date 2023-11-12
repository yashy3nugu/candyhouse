import { usePaginatedCandyQueryVendor } from "@/api/candy";
import Seo from "@/components/shared/seo";
import VendorCandyCard from "@/components/vendor-candy-card";
import usePagination from "@/hooks/use-pagination/usePagination";
import VendorLayout from "@/layouts/vendor-layout";
import { NextPageWithLayout } from "@/pages/_app";
import { fakeCandy } from "@/utils/fake";
import {
  Box,
  GridItem,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";

const VendorDashboard: NextPageWithLayout = () => {
  const { page, handleNextPage, handlePrevPage } = usePagination({});

  const { data, isLoading } = usePaginatedCandyQueryVendor(page);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <Seo title="Vendor Dashboard" />
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
                    <VendorCandyCard candy={fakeCandy} />
                  </Skeleton>
                ))}
            {!isLoading &&
              data?.candies.map((candy) => (
                <GridItem key={candy._id}>
                  <VendorCandyCard candy={candy} />
                </GridItem>
              ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

VendorDashboard.getLayout = (page) => {
  return <VendorLayout>{page}</VendorLayout>;
};

export default VendorDashboard;
