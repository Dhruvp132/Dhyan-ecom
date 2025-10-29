"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  useAppDispatch,
  useAppSelector,
} from "@/providers/toolkit/hooks/hooks";
import { GetCartItems } from "@/providers/toolkit/features/GetUserAllCartitems";
import { DeleteItem } from "@/providers/toolkit/features/DeleteCartItemSlice";
import Loader from "@/components/Loader";

interface Product {
  id: string;
  product: {
    name: string;
    mainImage: string;
    price: number;
  };
  color?: string;
  size?: string;
  quantity: number;
}

interface User {
  id: string;
}

type RootState = {
  cartItems: {
    items: {
      data: Product[];
    };
  };
};

const ShoppingCart = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const userId = session?.user ? (session.user as User).id : null;
  const cartItemsFromStore = useAppSelector(
    (state: RootState) => state.cartItems.items.data
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(cartItemsFromStore);
    setIsLoading(false);
  }, [cartItemsFromStore]);

  useEffect(() => {
    if (userId) {
      dispatch(GetCartItems(userId));
      setIsLoading(true);
    }
  }, [userId, dispatch]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const handleRemoveItem = (product: any) => {
    dispatch(
      DeleteItem({
        userId: userId as string,
        product: { id: product.productId },
      })
    );
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };

  const estimatedTotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (total, product) => total + product.product.price * product.quantity,
        0
      )
    : 0;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Header Section */}
      <div
        style={{
          padding: "2rem 1rem",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            margin: "0",
            letterSpacing: "-0.02em",
          }}
        >
          Your cart
        </h1>
        <Link
          href="/"
          style={{
            textDecoration: "underline",
            color: "#000000",
            fontSize: "1rem",
            fontWeight: "400",
          }}
        >
          Continue shopping
        </Link>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {!Array.isArray(cartItems) || cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <p style={{ fontSize: "1.125rem", color: "#666666" }}>Your cart is empty</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            {/* Products Section */}
            <div>
              {/* Column Headers - Hidden on Mobile */}
              <div
                className="hidden md:grid"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "2rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #e5e5e5",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#999999", letterSpacing: "0.05em" }}>
                  PRODUCT
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#999999",
                    letterSpacing: "0.05em",
                    textAlign: "center",
                  }}
                >
                  QUANTITY
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#999999",
                    letterSpacing: "0.05em",
                    textAlign: "right",
                  }}
                >
                  TOTAL
                </div>
              </div>

              {/* Mobile Column Headers */}
              <div
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #e5e5e5",
                  marginBottom: "2rem",
                }}
                className="grid md:hidden"
              >
                <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#999999", letterSpacing: "0.05em" }}>
                  PRODUCT
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#999999",
                    letterSpacing: "0.05em",
                    textAlign: "right",
                  }}
                >
                  TOTAL
                </div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item.id} style={{ marginBottom: "2rem" }}>
                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    {/* Product Image and Details */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                      {/* Left Column - Image and Details */}
                      <div>
                        <div style={{ marginBottom: "1rem" }}>
                          <Image
                            src={item.product.mainImage || "/placeholder.svg"}
                            alt={item.product.name}
                            width={160}
                            height={200}
                            style={{ width: "100%", height: "auto", backgroundColor: "#f0f0f0", objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "1rem", fontWeight: "600", margin: "0 0 0.5rem 0" }}>{item.product.name}</h3>
                          <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0 0 0.25rem 0" }}>
                            Rs. {item.product.price.toFixed(2)}
                          </p>
                          {item.size && (
                            <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0" }}>SIZE: {item.size}</p>
                          )}
                          {item.color && (
                            <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0" }}>COLOR: {item.color}</p>
                          )}
                        </div>
                      </div>

                      {/* Right Column - Total Price */}
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                          Rs. {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector - Mobile */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #000000",
                          width: "100%",
                          maxWidth: "150px",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: "1.125rem",
                            fontWeight: "600",
                          }}
                        >
                          −
                        </button>
                        <div
                          style={{
                            flex: 1,
                            textAlign: "center",
                            padding: "0.75rem",
                            borderLeft: "1px solid #000000",
                            borderRight: "1px solid #000000",
                            fontSize: "1rem",
                            fontWeight: "500",
                          }}
                        >
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            flex: 1,
                            padding: "0.75rem",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: "1.125rem",
                            fontWeight: "600",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete Button - Mobile */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", 
                      paddingBottom: "0.5rem", 
                      // borderBottom: "1px solid #e5e5e5" 
                      }}>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={20} color="#000000" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className="hidden md:grid"
                    style={{
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "2rem",
                      alignItems: "center",
                      paddingBottom: "2rem",
                      // borderBottom: "1px solid #e5e5e5",
                    }}
                  >
                    {/* Product Info */}
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      <Image
                        src={item.product.mainImage || "/placeholder.svg"}
                        alt={item.product.name}
                        width={100}
                        height={140}
                        style={{ width: "100px", height: "140px", backgroundColor: "#f0f0f0", objectFit: "cover" }}
                      />
                      <div>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", margin: "0 0 0.5rem 0" }}>{item.product.name}</h3>
                        <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0 0 0.25rem 0" }}>
                          Rs. {item.product.price.toFixed(2)}
                        </p>
                        {item.size && (
                          <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0" }}>SIZE: {item.size}</p>
                        )}
                        {item.color && (
                          <p style={{ fontSize: "0.875rem", color: "#666666", margin: "0" }}>COLOR: {item.color}</p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector - Desktop */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid #000000",
                          width: "100%",
                          maxWidth: "120px",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                          }}
                        >
                          −
                        </button>
                        <div
                          style={{
                            flex: 1,
                            textAlign: "center",
                            padding: "0.5rem",
                            borderLeft: "1px solid #000000",
                            borderRight: "1px solid #000000",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                          }}
                        >
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={20} color="#000000" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    >
                      Rs. {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid #e5e5e5",
              }}
            >
              {/* Estimated Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>Estimated total</span>
                <span style={{ fontSize: "1.125rem", fontWeight: "600" }}>Rs. {estimatedTotal.toFixed(2)}</span>
              </div>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#666666",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                Taxes, discounts and <span style={{ textDecoration: "underline" }}>shipping</span> calculated at
                checkout.
              </p>

              {/* Checkout Button */}
              <Link
                href={
                  session?.user
                    ? `/checkout?totalAmount=${estimatedTotal}&shipping=99&Id=${userId}`
                    : "/login"
                }
              >
                <button
                  style={{
                    width: "100%",
                    padding: "1rem",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                  }}
                >
                  Check out
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
