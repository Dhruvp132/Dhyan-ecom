import React from "react";
import CreateProduct from "@/app/_dashboardComponents/CreateProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "dashboard add product",
  description: "dashboard add product page",
};

const AddProduct = () => {
  return (
    <div>
      <CreateProduct />
    </div>
  );
};

export default AddProduct;
