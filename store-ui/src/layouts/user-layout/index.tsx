import React from "react";
import Footer from "@/layouts/shared/footer";
import Navbar from "@/components/shared/navbar";

import UserProvider from "@/components/provider/user-provider";

const UserLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <UserProvider>
      <Navbar />
      {children}
      <Footer />
    </UserProvider>
  );
};

export default UserLayout;
