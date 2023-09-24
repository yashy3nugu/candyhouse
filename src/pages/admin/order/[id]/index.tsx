import AdminLayout from "@/layouts/admin-layout/navbar";
import { NextPageWithLayout } from "@/pages/_app";
import { api } from "@/utils/api";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";


const Order: NextPageWithLayout = () => {
    const router = useRouter();
    
    const { isLoading: isCandyLoading, data: order } =
      api.order.oneById.useQuery({
        _id: router.query.id as string,
      });
    
    const {
        mutate: cancelOrder,
        isLoading: isCancelling,
    } = api.order.cancel.useMutation({});
    
    
    return <>
        {JSON.stringify(order)}
        <Button onClick={() => {
            cancelOrder({_id: order!._id})
        }}>Cancel order</Button>
    </>

}

Order.getLayout = (page) => {
    return <AdminLayout>{ page}</AdminLayout>
}

export default Order;