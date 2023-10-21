import { Button, Skeleton } from "@chakra-ui/react";
import Link, { LinkProps } from "next/link";

interface NavLinkProps extends LinkProps {
  icon: React.FC;
    label: string;
    isLoaded: boolean
}

const NavLink: React.FC<NavLinkProps> = ({
  icon: Icon,
    label,
  isLoaded,
  ...props
}) => {
  return (
    <Skeleton isLoaded={isLoaded}>
      <Link {...props}>
        <Button leftIcon={<Icon />} variant="ghost">
          {label}
        </Button>
      </Link>
    </Skeleton>
  );
};

export default NavLink;
