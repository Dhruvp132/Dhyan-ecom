import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SingleProductSkeleton = () => {
  return (
    <div className="md:flex w-full items-center justify-center md:p-3 h-full">
      <div className="w-full md:w-1/2 flex flex-col gap-4 p-2">
        <Skeleton className="w-full h-[500px] rounded bg-gray-300" />
        <div className="flex w-full items-center justify-center gap-3">
          <Skeleton className="w-full h-[100px] rounded bg-gray-300" />
          <Skeleton className="w-full h-[100px] rounded bg-gray-300" />
          <Skeleton className="w-full h-[100px] rounded bg-gray-300" />
          <Skeleton className="w-full h-[100px] rounded bg-gray-300" />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-start justify-start gap-4 p-2 h-full">
        <Skeleton className="w-11/12 h-6 rounded bg-gray-300" />
        <Skeleton className="w-10/12 h-20 rounded bg-gray-300" />
        <Skeleton className="w-1/3 h-16 rounded bg-gray-300" />
        <Skeleton className="w-1/3 h-16 rounded bg-gray-300" />
        <Skeleton className="w-2/3 h-16 rounded bg-gray-300" />
      </div>
    </div>
  );
};

export default SingleProductSkeleton;
