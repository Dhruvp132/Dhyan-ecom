"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableSkeletons from "../temp/TableSkeletons";

interface Product {
  name: string;
  price: number;
  mainImage: string;
}

interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city?: string;
  state?: string;
}

interface User {
  email: string;
  name: string;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  address: Address;
  user: User;
}

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-all-orders");
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/get-all-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl font-semibold">Orders</CardTitle>
        <CardDescription>Recent orders from your store.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] px-4 py-3 sm:px-6">
                  Customer
                </TableHead>
                <TableHead className="hidden px-4 py-3 sm:table-cell sm:px-6">
                  Address
                </TableHead>
                <TableHead className="hidden px-4 py-3 lg:table-cell sm:px-6">
                  Product
                </TableHead>
                <TableHead className="hidden px-4 py-3 sm:table-cell sm:px-6">
                  Status
                </TableHead>
                <TableHead className="hidden px-4 py-3 md:table-cell sm:px-6">
                  Date
                </TableHead>
                <TableHead className="px-4 py-3 text-right sm:px-6">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <TableSkeletons />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-4 sm:px-6">
                      <div className="font-medium">{`${order.address.firstName} ${order.address.lastName}`}</div>
                      <div className="hidden text-sm text-muted-foreground md:block">
                        {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <div className="text-sm">{order.address.address}</div>
                      {order.address.city && order.address.state && (
                        <div className="text-xs text-muted-foreground">
                          {order.address.city}, {order.address.state}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 lg:table-cell sm:px-6">
                      <div className="text-sm">
                        {order.items.length === 1 
                          ? order.items[0].product.name
                          : `${order.items.length} items`}
                      </div>
                      {order.items.length > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {order.items.map(item => item.product.name).slice(0, 2).join(', ')}
                          {order.items.length > 2 && '...'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 sm:table-cell sm:px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Badge
                            className="text-xs cursor-pointer"
                            variant={
                              order.status === "PENDING"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {order.status}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "PENDING")
                            }
                          >
                            PENDING
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "COMPLETED")
                            }
                          >
                            COMPLETED
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateOrderStatus(order.id, "CANCELLED")
                            }
                          >
                            CANCELLED
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="hidden px-4 py-4 md:table-cell sm:px-6">
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        #{order.orderNumber}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-right sm:px-6">
                      <div className="font-medium">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      {order.items.length > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
