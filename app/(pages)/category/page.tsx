import { Metadata } from "next";
import Categories from "./cate";

export const metadata: Metadata = {
  title: "Explore Fashion Categories",
  description:
    "Discover the latest trends in men's, women's, and children's fashion",
};
const Category = () => {
  return <Categories />;
};

export default Category;
