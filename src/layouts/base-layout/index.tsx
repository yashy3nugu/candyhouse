import React from "react";
import Footer from "@/layouts/shared/footer";
import Navbar from "@/layouts/shared/navbar";

const BaseLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default BaseLayout;
