import Ordertable from "@/app/_dashboardComponents/Ordertable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "dashboard Orders Page",
  description: "This is the dashboard orders page",
};
const orders = () => {
  return (
    <div>
      <Ordertable />
    </div>
  );
};

export default orders;
