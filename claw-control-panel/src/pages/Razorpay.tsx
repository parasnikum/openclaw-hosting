import React from "react";
import { useNavigate } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Button } from "@/components/ui/button";

export function RazorpayCheckout({
  amount,
  projectName,
  orderId,
}: {
  amount: number; // in paise
  projectName: string;
  orderId: string;
}) {
  const navigate = useNavigate();
  const { Razorpay, isLoading, error } = useRazorpay();

  const handlePayment = () => {
    const options: RazorpayOrderOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // ✅ keep key in env
      amount,
      currency: "INR",
      name: "Your Company",
      description: `Deployment for ${projectName}`,
      order_id: orderId, // generated from backend
      handler: (response) => {

        navigate(
          `/checkout/success?name=${encodeURIComponent(projectName)}`
        );
      },
      modal: {
        ondismiss: () => {
          navigate("/checkout/pending");
        },
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#22c55e",
      },
    };

    const razorpay = new Razorpay(options);

    razorpay.on("payment.failed", () => {
      navigate("/checkout/failed");
    });

    razorpay.open();
  };

  return (
    <>
      {error && <p className="text-red-500">Razorpay failed to load</p>}

      <Button
        className="w-full h-14 rounded-2xl font-bold text-lg"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Pay Now"}
      </Button>
    </>
  );
}
