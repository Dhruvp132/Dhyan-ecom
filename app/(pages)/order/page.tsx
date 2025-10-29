import AllOrders from "@/app/components/AllOrders";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Orders - Dhyan Ecom",
  description: "View and track your orders",
};
const OrderList = () => {
  return <AllOrders />;
};

export default OrderList;
