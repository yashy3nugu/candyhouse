import React from "react";

import Link from "next/link";
import Logo from "@/components/shared/logo";
import {
  Box,
  Flex,
  HStack,
  Hide,
  IconButton,
  Show,
  useDisclosure,
} from "@chakra-ui/react";
import MobileDrawer from "@/components/shared/mobile-drawer";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import { FiUserPlus, FiLogIn, FiLogOut } from "react-icons/fi";
import { useAppSelector } from "@/store/hooks";
// import { api } from "@/utils/api";

import NavLink from "../nav-link";
import { useLoggedInUserQuery } from "@/api/user";
import { Role } from "@/utils/types/user";
import { LuLayoutDashboard, LuPlus } from "react-icons/lu";

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { data: userOld, isLoading } = api.auth.user.useQuery();
  // const isLoading = false;

  const { data: loginData, isLoading } = useLoggedInUserQuery();

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
                {!isLoading && (
                  <>
                    {(!loginData || loginData.user.role === Role.User) && (
                      <>
                        <NavLink
                          isLoaded={!isLoading}
                          icon={AiOutlineHome}
                          href="/"
                          label="Home"
                        />

                        <NavLink
                          isLoaded={!isLoading}
                          icon={BiStore}
                          href="/store"
                          label="Store"
                        />
                      </>
                    )}
                    {!loginData && (
                      <>
                        <NavLink
                          isLoaded={!isLoading}
                          icon={FiLogIn}
                          href="/login"
                          label="Login"
                        />
                        <NavLink
                          isLoaded={!isLoading}
                          icon={FiUserPlus}
                          href="/register"
                          label="Register"
                        />
                      </>
                    )}
                    {(!loginData || loginData.user.role === Role.User) && (
                      <>
                        <NavLink
                          isLoaded={!isLoading}
                          icon={AiOutlineShoppingCart}
                          href="/cart"
                          label={`Cart (${cartValue})`}
                        />
                        <NavLink
                          isLoaded={!isLoading}
                          icon={AiOutlineUser}
                          href="/user/profile"
                          label={`Profile`}
                        />
                        
                      </>
                    )}

                    {loginData?.user.role == Role.Vendor && (
                      <>
                        <NavLink
                          isLoaded={!isLoading}
                          icon={LuLayoutDashboard}
                          href="/vendor/dashboard"
                          label="Dashboard"
                        />
                        <NavLink
                          isLoaded={!isLoading}
                          icon={LuPlus}
                          href="/vendor/create"
                          label="Create"
                        />
                      </>
                    )}

                    {loginData?.user.role == Role.Admin && (
                      <>
                        <NavLink
                          isLoaded={!isLoading}
                          icon={LuLayoutDashboard}
                          href="/admin/dashboard"
                          label="Dashboard"
                        />
                      </>
                    )}

                    {loginData && (
                      <NavLink
                        icon={FiLogOut}
                        isLoaded={!isLoading}
                        label="Logout"
                        href="/logout"
                      />
                    )}
                  </>
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
