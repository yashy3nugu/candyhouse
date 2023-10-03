import { Button, Text, Box } from "@chakra-ui/react";

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
        <Button
          size="sm"
          isDisabled={page === 1 || prevDisabled}
          onClick={() => {
            if (page !== 1 || !prevDisabled) {
              handlePrevPage();
            }
          }}
        >
          Prev Page
        </Button>
        <Text as="span">{page}</Text>
        <Button
          isDisabled={!hasMore || nextDisabled}
          size="sm"
          onClick={() => {
            if (hasMore || !nextDisabled) {
              handleNextPage();
            }
          }}
        >
          Next Page
        </Button>
      </Box>
    </>
  );
};

export default Pagination;
