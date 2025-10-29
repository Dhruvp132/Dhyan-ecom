import { Skeleton } from "@/components/ui/skeleton";

const ProductsSkeletons = () => {
  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Skeleton className="w-full aspect-[4/5] rounded bg-gray-300" />
              <Skeleton className="h-4 w-3/4 rounded bg-gray-300" />
              <Skeleton className="h-4 w-1/2 rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSkeletons;
