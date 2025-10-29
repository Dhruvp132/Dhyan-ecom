"use client";

import { GetOrders } from "@/providers/toolkit/features/GetOrdersSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/providers/toolkit/hooks/hooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import OrderSkeletons from "../temp/OrderSkeletons";
import { Package, ChevronRight, Truck } from "lucide-react";

interface User {
  id: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  mainImage: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
  color?: string;
  size?: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  address: Address;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
}

const AllOrders = () => {
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user ? (session.user as User).id : null;
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector(
    (state: { orders: OrdersState }) => state.orders
  );
  const [selectedTab, setSelectedTab] = useState<string>("On Shipping");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  useEffect(() => {
    // Wait for session to load
    if (sessionStatus === "loading") {
      return;
    }
    
    if (userId) {
      dispatch(GetOrders(userId as string))
        .finally(() => {
          setIsInitialLoad(false);
        });
    } else {
      setIsInitialLoad(false);
    }
  }, [dispatch, userId, sessionStatus]);

  const { orders, loading } = ordersState;

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "processing":
        return "bg-orange-50 text-orange-600";
      case "shipped":
        return "bg-blue-50 text-blue-600";
      case "delivered":
        return "bg-green-50 text-green-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "On Shipping";
      case "processing":
        return "On Shipping";
      case "shipped":
        return "On Deliver";
      case "delivered":
        return "Arrived";
      case "cancelled":
        return "Canceled";
      default:
        return status;
    }
  };

  // Filter orders by status
  const filterOrdersByStatus = (orders: Order[], tabStatus: string) => {
    const statusMap: Record<string, string[]> = {
      "On Shipping": ["PENDING", "PROCESSING"],
      "Arrived": ["DELIVERED"],
      "Canceled": ["CANCELLED"],
    };

    if (tabStatus === "On Shipping") {
      return orders.filter(order => 
        statusMap["On Shipping"].includes(order.status.toUpperCase())
      );
    } else if (tabStatus === "Arrived") {
      return orders.filter(order => 
        statusMap["Arrived"].includes(order.status.toUpperCase())
      );
    } else if (tabStatus === "Canceled") {
      return orders.filter(order => 
        statusMap["Canceled"].includes(order.status.toUpperCase())
      );
    }
    return orders;
  };

  const filteredOrders = filterOrdersByStatus(orders || [], selectedTab);
  const onShippingCount = filterOrdersByStatus(orders || [], "On Shipping").length;
  const arrivedCount = filterOrdersByStatus(orders || [], "Arrived").length;

  // Show loading state only during initial load
  if (isInitialLoad) {
    return (
      <div className="w-full min-h-screen bg-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <OrderSkeletons />
        </div>
      </div>
    );
  }

  // Only show empty state after initial data has loaded
  if (orders.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white">
        {/* Header Section */}
        <div className="border-b border-gray-200 py-6 md:py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              My Orders
            </h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping now and your orders will appear here!
            </p>
            <Link href="/products">
              <button className="px-8 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white md:bg-gray-50">
      {/* Header Section - Desktop */}
      <div className="hidden md:block border-b border-gray-200 bg-white py-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Blog
          </Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            FAQs
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white pt-6 pb-4 px-5">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <button className="p-0 -ml-1 hover:opacity-70 transition-opacity">
              <ChevronRight className="w-6 h-6 rotate-180 text-gray-900" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* Mobile Tabs */}
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          <button
            onClick={() => setSelectedTab("On Shipping")}
            className={`flex-1 py-3 px-1 text-sm font-medium rounded-xl transition-all duration-300 ${
              selectedTab === "On Shipping"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>On Shipping</span>
              {onShippingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs bg-gray-900 text-white rounded-full">
                  {onShippingCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setSelectedTab("Arrived")}
            className={`flex-1 py-3 px-1 text-sm font-medium rounded-xl transition-all duration-300 ${
              selectedTab === "Arrived"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Arrived</span>
              {arrivedCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs bg-gray-300 text-gray-900 rounded-full">
                  {arrivedCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setSelectedTab("Canceled")}
            className={`flex-1 py-3 px-1 text-sm font-medium rounded-xl transition-all duration-300 ${
              selectedTab === "Canceled"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Canceled
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Desktop Tabs */}
        <div className="hidden md:block bg-white rounded-lg mb-6 shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab("On Shipping")}
              className={`flex-1 md:flex-none md:px-8 py-4 text-sm md:text-base font-semibold transition-all duration-300 relative ${
                selectedTab === "On Shipping"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              On Shipping
              {onShippingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold bg-gray-900 text-white rounded-full">
                  {onShippingCount}
                </span>
              )}
              {selectedTab === "On Shipping" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 animate-in fade-in slide-in-from-bottom-1 duration-300" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab("Arrived")}
              className={`flex-1 md:flex-none md:px-8 py-4 text-sm md:text-base font-semibold transition-all duration-300 relative ${
                selectedTab === "Arrived"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Arrived
              {arrivedCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold bg-gray-200 text-gray-900 rounded-full">
                  {arrivedCount}
                </span>
              )}
              {selectedTab === "Arrived" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 animate-in fade-in slide-in-from-bottom-1 duration-300" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab("Canceled")}
              className={`flex-1 md:flex-none md:px-8 py-4 text-sm md:text-base font-semibold transition-all duration-300 relative ${
                selectedTab === "Canceled"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Canceled
              {selectedTab === "Canceled" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 animate-in fade-in slide-in-from-bottom-1 duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">No orders in this category</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const firstItem = order.items[0];
              const remainingItemsCount = order.items.length - 1;

              return (
                <div key={order.id} className="bg-white rounded-2xl md:rounded-lg overflow-hidden shadow-sm">
                  {/* Order Header */}
                  <div className="flex items-center justify-between p-4 md:px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Package className="w-5 h-5 md:w-5 md:h-5 text-gray-900" />
                      <span className="text-base md:text-base font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                    </div>
                    <span
                      className={`text-sm md:text-sm font-medium px-3 md:px-3 py-1.5 rounded-full flex items-center gap-1.5 ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Order Content */}
                  <div className="p-5 md:p-6">
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      {/* Delivery Info */}
                      <div className="flex items-start gap-3 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{order.address.state}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        Estimated arrival: {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{order.address.city}, {order.address.state}</span>
                      </div>

                      {/* First Product */}
                      <div className="flex gap-4 mb-4">
                        <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                          <Image
                            src={firstItem.product.mainImage}
                            alt={firstItem.product.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                            {firstItem.product.name}
                          </h3>
                          <p className="text-base font-semibold text-gray-900 mb-1">
                            Rp {firstItem.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">x{firstItem.quantity}</span>
                          </p>
                          {firstItem.size && (
                            <p className="text-sm text-gray-600">
                              {firstItem.size}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Expandable Products */}
                      {order.items.length > 1 && (
                        <>
                          {!isExpanded ? (
                            <button
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="w-full text-left transition-all duration-300 hover:opacity-70 active:scale-[0.98]"
                            >
                              <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-xl">
                                <div className="flex-1">
                                  <div className="flex gap-2">
                                    {order.items.slice(1, Math.min(4, order.items.length)).map((item) => (
                                      <div key={item.id} className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                          src={item.product.mainImage}
                                          alt={item.product.name}
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ))}
                                    {remainingItemsCount > 3 && (
                                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                        <span className="text-xs font-medium text-gray-600">+{remainingItemsCount - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0" />
                              </div>
                            </button>
                          ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                              {order.items.slice(1).map((item) => (
                                <div key={item.id} className="flex gap-4 pt-4 border-t border-gray-100">
                                  <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                    <Image
                                      src={item.product.mainImage}
                                      alt={item.product.name}
                                      width={112}
                                      height={112}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                                      {item.product.name}
                                    </h3>
                                    <p className="text-base font-semibold text-gray-900 mb-1">
                                      Rp {item.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">x{item.quantity}</span>
                                    </p>
                                    {item.size && (
                                      <p className="text-sm text-gray-600">
                                        {item.size}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              
                              <button
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="w-full text-center py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 active:scale-[0.98] bg-gray-50 rounded-xl"
                              >
                                Show less
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Total - Mobile */}
                      <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Total:</span>
                        <span className="text-xl font-bold text-gray-900">
                          Rp {order.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Details Button - Mobile */}
                      <button className="w-full mt-4 py-3.5 border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 active:scale-[0.98]">
                        Details
                      </button>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Truck className="w-4 h-4" />
                          <span className="font-medium">{order.address.state}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">
                          Estimated arrival: {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">
                          {order.address.city}, {order.address.state}
                        </span>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 gap-4">
                        {/* First Product */}
                        <div className="flex gap-4">
                          <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={firstItem.product.mainImage}
                              alt={firstItem.product.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {firstItem.product.name}
                            </h3>
                            <p className="text-base font-semibold text-gray-900 mb-1">
                              Rp {firstItem.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">x{firstItem.quantity}</span>
                            </p>
                            {firstItem.size && (
                              <p className="text-sm text-gray-600">{firstItem.size}</p>
                            )}
                          </div>
                        </div>

                        {/* Expandable Section */}
                        {order.items.length > 1 && (
                          <>
                            {!isExpanded ? (
                              <button
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="w-full text-left transition-all duration-300 hover:opacity-70 active:scale-[0.99]"
                              >
                                <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex gap-3">
                                      {order.items.slice(1, Math.min(5, order.items.length)).map((item) => (
                                        <div key={item.id} className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                                          <Image
                                            src={item.product.mainImage}
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ))}
                                      {remainingItemsCount > 4 && (
                                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                                          <span className="text-sm font-medium text-gray-600">+{remainingItemsCount - 4}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0" />
                                </div>
                              </button>
                            ) : (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                {order.items.slice(1).map((item) => (
                                  <div key={item.id} className="flex gap-4 pt-4 border-t border-gray-100">
                                    <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                      <Image
                                        src={item.product.mainImage}
                                        alt={item.product.name}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {item.product.name}
                                      </h3>
                                      <p className="text-base font-semibold text-gray-900 mb-1">
                                        Rp {item.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">x{item.quantity}</span>
                                      </p>
                                      {item.size && (
                                        <p className="text-sm text-gray-600">{item.size}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}

                                <button
                                  onClick={() => toggleOrderExpansion(order.id)}
                                  className="w-full text-center py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 active:scale-[0.99] bg-gray-50 rounded-lg"
                                >
                                  Show less
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-200">
                        <div>
                          <span className="text-sm text-gray-600">Total: </span>
                          <span className="text-xl font-bold text-gray-900">Rp {order.totalAmount.toLocaleString()}</span>
                        </div>
                        <button className="px-8 py-3 border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 active:scale-[0.98]">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
