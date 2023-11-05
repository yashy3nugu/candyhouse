import React from "react";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import VendorProvider from "@/components/provider/VendorProvider";

const VendorLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <VendorProvider>
      <Navbar />
      {children}
      <Footer />
    </VendorProvider>
  );
};

export default VendorLayout;
