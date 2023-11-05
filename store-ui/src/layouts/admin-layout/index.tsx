import React from "react";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import SuperAdminProvider from "@/components/provider/super-admin-provider/SuperAdminProvider";

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SuperAdminProvider>
      <Navbar />
      {children}
      <Footer />
    </SuperAdminProvider>
  );
};

export default AdminLayout;
