import Productstable from "@/app/_dashboardComponents/Productstable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "dashboard Products Page",
  description: "This is the dashboard products page",
};
const DashboardProducts = () => {
  return (
    <div>
      <Productstable />
    </div>
  );
};

export default DashboardProducts;
