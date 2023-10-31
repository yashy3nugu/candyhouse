import React from "react";

import Link from "next/link";
import Logo from "@/components/shared/logo";
import {
  Box,
  Button,
  Flex,
  HStack,
  Hide,
  IconButton,
  Show,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import MobileDrawer from "@/layouts/shared/mobile-drawer";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import { FiUserPlus, FiLogIn, FiLogOut } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
import NavLink from "@/layouts/shared/nav-link";

import { LuLayoutDashboard } from "react-icons/lu"
import {MdOutlineInventory2} from "react-icons/md"
import { useLoggedInUserQuery } from "@/api/user";

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: user, isLoading } = useLoggedInUserQuery();

  const cartValue = useAppSelector((state) => state.cart.value);
  return (
    <>
      <Box as="header" position="sticky" top={0} left={0} zIndex={15}>
        <Flex
          align="center"
          justify="space-between"
          py={8}
          px={{ base: 6, md: 16 }}
        >
          <Link href="/" passHref>
            <Logo />
          </Link>

          <MobileDrawer isOpen={isOpen} onClose={onClose} />
          <Hide below="lg">
            <Box as="nav">
              <HStack>
                {/* <Skeleton>
                  <Button leftIcon={<AiOutlineHome />}>****</Button>
                </Skeleton> */}

                <NavLink
                  isLoaded={!isLoading}
                  icon={LuLayoutDashboard}
                  href="/vendor/dashboard"
                  label="Dashboard"
                />

                <NavLink
                  isLoaded={!isLoading}
                  icon={MdOutlineInventory2}
                  href="/vendor/inventory"
                  label="Store"
                />
                

                
                {user && (
                  <NavLink
                    icon={FiLogOut}
                    isLoaded={!isLoading}
                    label="Logout"
                    href="/auth/logout"
                  />
                )}
              </HStack>
            </Box>
          </Hide>

          <Show below="lg">
            <IconButton
              aria-label="Hamburger Menu"
              variant="ghost"
              cursor="pointer"
              _focus={{
                outline: "none",
              }}
              onClick={onOpen}
              icon={<GiHamburgerMenu />}
            />
          </Show>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
