import React from "react";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

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
