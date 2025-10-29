"use client";
import { useToast } from "@/components/ui/use-toast";
import { createAddress } from "@/providers/toolkit/features/CreateAddressForOrderSlice";
import { useAppDispatch } from "@/providers/toolkit/hooks/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const Checkout = ({ data, user }: { data: number; user: User }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: data }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data * 100,
        currency: "INR",
        name: "COLT & CO.",
        description: "Payment for the products purchased from COLT & CO.",
        image: "/logo.png",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          console.log("Payment successful:", response);
          console.log(user);
          
          dispatch(
            createAddress({
              userId: user.userId,
              firstName: user.first_name,
              lastName: user.last_name,
              address: user.address,
              city: user.city,
              state: user.state,
              zip: user.zip,
            })
          );
          
          toast({
            title: "Order Placed",
            description: "Your order has been placed successfully",
            duration: 5000,
            style: {
              backgroundColor: "#228B22",
              color: "#fff",
            },
          });
          
          router.push("/order");
        },
        prefill: {
          name: `${user.first_name} ${user.last_name}`,
          email: "customer@example.com",
          contact: "9000000000",
        },
        theme: {
          color: "#00008B",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        duration: 5000,
        style: {
          backgroundColor: "#dc2626",
          color: "#fff",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    handlePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Processing payment...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;