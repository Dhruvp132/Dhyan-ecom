import AllProduct from "@/app/components/AllProducts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "This is the all products page",
};
const AllProducts = () => {
  return <AllProduct />;
};

export default AllProducts;
