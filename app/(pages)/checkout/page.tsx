import CheckOutForm from "@/app/components/CheckOutForm";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "CheckOut",
  description: "This is the checkout page",
};
const CheckOut = () => {
  return (
    <div className="min-h-screen bg-white">
      <CheckOutForm />
    </div>
  );
};

export default CheckOut;
