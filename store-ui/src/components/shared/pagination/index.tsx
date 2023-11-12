import { Button, Text, Box, IconButton } from "@chakra-ui/react";
import {GrFormNext, GrFormPrevious} from "react-icons/gr"

interface PaginationProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  page: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  hasMore: boolean;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  hasMore,
  handleNextPage,
  handlePrevPage,
  className,
  prevDisabled,
  nextDisabled,
  ...props
}) => {
  return (
    <>
      <Box {...props}>
        <IconButton
          icon={<GrFormPrevious />}
          size="sm"
          isDisabled={page === 1 || prevDisabled}
          onClick={() => {
            if (page !== 1 || !prevDisabled) {
              handlePrevPage();
            }
          }}
          aria-label="Next Page"
          mr={2}
        >
          Prev Page
        </IconButton>
        <Text as="span" fontSize="sm" fontWeight="semibold">{page}</Text>
        <IconButton
          isDisabled={!hasMore || nextDisabled}
          size="sm"
          onClick={() => {
            if (hasMore || !nextDisabled) {
              handleNextPage();
            }
          }}
          aria-label="Next page"
          icon={<GrFormNext />}
          ml={2}
        >
          Next Page
        </IconButton>
      </Box>
    </>
  );
};

export default Pagination;
