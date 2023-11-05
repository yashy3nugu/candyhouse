import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Badge,
  Flex,
  Box,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
// import Image from "@/components/shared/image";
import Image from "next/image";
import NextLink from "next/link";
import { Candy } from "@/api/candy/types";

interface CandyCardProps {
  candy: Candy;
}

const VendorCandyCard: React.FC<CandyCardProps> = ({ candy }) => {

  return (
    <LinkBox>
      <Card height="full">
        <Box
          position="relative"
          w={{ base: "150px", lg: "200px" }}
          h={{ base: "150px", lg: "200px" }}
          minH={{ base: "150px", lg: "200px" }}
          mx="auto"
        >
          <Image src={candy.photo.url} alt={candy.name} fill />
        </Box>

        {/* <Image width={360} height={360} src={candy.photo.url} alt={candy.name} /> */}
        <CardHeader pb={0} px={2}>
          <Text textColor="gray.400" fontSize={"sm"}>
            {(candy.vendor as any).name}
          </Text>
          <LinkOverlay as={NextLink} href={`/candy/${candy._id}`}>
            <Text mt={0} as="h3" fontWeight="medium" fontSize="xl">
              {candy.name}
              <Badge ml={2} colorScheme="purple">
                New
              </Badge>
            </Text>
          </LinkOverlay>
        </CardHeader>
        <CardBody pt={0} px={2}>
          <Flex direction="column" justifyContent="space-between" h="full">
            <Box>
              <Text fontSize="sm" fontWeight="normal">
                {candy.description}
              </Text>
              <Flex></Flex>
            </Box>
            <Box>
              <Text mb={2} mt={4} fontWeight={"medium"}>
                ₹ {candy.price}
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    </LinkBox>
  );
};

export default VendorCandyCard;
