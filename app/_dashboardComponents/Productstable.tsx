"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "next-view-transitions";
import { useGetAllProductsQuery } from "@/providers/toolkit/features/GetAllProductsSlice";
import { Suspense } from "react";
import TableSkeletons from "../temp/TableSkeletons";

const Productstable = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <TableSkeletons />
      </div>
    );
  if (error) return <div>An error occurred: </div>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={"/dashboard/products/add"}
          className="flex w-full items-center justify-end"
        >
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </Link>

        <Suspense fallback={<TableSkeletons />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" w-[70px] md:w-[100px] table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">Colors</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data?.map((product: any) => (
                  <TableRow key={product?.id}>
                    <TableCell className="table-cell">
                      <Image
                        alt={product?.name || "Product image"}
                        className="aspect-square rounded-md object-cover"
                        height={64}
                        src={product?.mainImage}
                        width={64}
                      />
                    </TableCell>
                    <TableCell className="text-xs md:text-sm md:font-medium">
                      {product?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product?.categories.map((category: any) => (
                          <span key={category.id}>{category.name}</span>
                        ))}
                      </Badge>
                    </TableCell>
                    <TableCell className="table-cell text-xs md:text-sm md:font-medium">
                      <span className="font-medium">₹</span>
                      {product?.price}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.sizes && product.sizes.length > 0
                        ? product?.sizes.map((size: any, i: number) => (
                            <span key={i}>
                              {size}
                              {i !== product.sizes.length - 1 && ", "}
                            </span>
                          ))
                        : "No sizes available"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {product.colors && product.colors.length > 0
                        ? product.colors.map((color: any, index: number) => (
                            <span key={index}>
                              {color}
                              {index !== product.colors.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "No colors available"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Productstable;
