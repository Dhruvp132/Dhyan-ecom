"use client";
import { useToast } from "@/components/ui/use-toast";
import { AddToCart } from "@/providers/toolkit/features/AddToCartSlice";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SessionUser {
  id: string;
}
const ToastCartButton = ({ product }: any) => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    if (!session?.user) {
      toast({
        title: "Please login to add to cart",
        description: "You need to be logged in to add items to your cart",
        variant: "default",
        duration: 1500,
        style: {
          backgroundColor: "#191919",
          color: "#fff",
        },
      });
      setIsLoading(false);
      return push("/login");
    } else {
      const userId = (session.user as SessionUser).id;
      await dispatch(
        AddToCart({
          userId: userId,
          productId: product.id,
          quantity: 1,
          color: product.colors[0],
          size: product.sizes[0],
        })
      );
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleClick}
      className="mt-4 py-2 px-4 bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-900  sm:w-auto"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="cursor-wait" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </>
      ) : (
        <>
          <ShoppingCart className="w-6 h-6 sm:w-5 sm:h-5 md:mr-2" />
          <span className="hidden sm:block">Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default ToastCartButton;
