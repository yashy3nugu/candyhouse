import { useLoggedInUserQuery } from "@/api/user";
import { Role } from "@/utils/types/user";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import { FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import { LuLayoutDashboard, LuPlus } from "react-icons/lu";
import NavLink from "../nav-link";
import { useAppSelector } from "@/store/hooks";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}


const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {

  const { data: loginData, isLoading } = useLoggedInUserQuery();
  const cartValue = useAppSelector((state) => state.cart.value);
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody justifyItems="start">
            <VStack>
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
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default MobileDrawer;
