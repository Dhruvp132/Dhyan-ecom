import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const OrderSkeletons = () => {
  return (
    <div className="grid p-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-[400px] rounded bg-gray-300"
        />
      ))}
    </div>
  );
};

export default OrderSkeletons;
