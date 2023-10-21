import { useAppDispatch } from "@/store/hooks";
import React from "react";
import { initCart } from "@/store/modules/cart";

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(initCart());
  }, [dispatch]);

  return <>{children}</>;
};

export default AppProvider;
