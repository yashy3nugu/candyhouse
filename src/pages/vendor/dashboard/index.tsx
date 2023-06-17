import VendorProvider from "@/components/provider/VendorProvider";
import { NextPageWithLayout } from "@/pages/_app";

const VendorDashboard: NextPageWithLayout = () => {
  return <>at dashboard</>;
};

VendorDashboard.getLayout = (page) => {
  return <VendorProvider>{page}</VendorProvider>;
};

export default VendorDashboard;
