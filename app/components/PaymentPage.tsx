"use client";

import * as React from "react";
import Script from "next/script";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const AMOUNT = 100;
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: AMOUNT }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "COLT & CO.",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
            duration: 5000,
            style: {
              backgroundColor: "#228B22",
              color: "#fff",
            },
          });
        },
        prefill: {
          name: "DHRUV PATEL",
          email: "dhruv@example.com",
          contact: "9589482345",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
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

  return (
    <main className="flex min-h-dvh flex-col">
      <section className="mx-auto w-full max-w-5xl px-4 py-8 space-y-6">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
          <div className="p-8 bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-2xl border-2 border-purple-200 max-w-md w-full">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
              Payment Portal
            </h1>
            <div className="text-center mb-6">
              <p className="text-purple-600 mb-2 text-lg">Amount to Pay</p>
              <p className="text-4xl font-bold text-purple-800">₹{AMOUNT}</p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:hover:translate-y-0"
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;