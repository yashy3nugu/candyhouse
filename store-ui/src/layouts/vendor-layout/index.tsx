import React from "react";
import Footer from "@/layouts/shared/footer";
import Navbar from "@/layouts/vendor-layout/navbar";
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
