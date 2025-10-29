"use client";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeletons = () => {
  return (
    <div className="w-full  flex items-center justify-center flex-col gap-2 m-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-[50px] md:h-[80px] rounded bg-gray-300"
        />
      ))}
    </div>
  );
};

export default TableSkeletons;
