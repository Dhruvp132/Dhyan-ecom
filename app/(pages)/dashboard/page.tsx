"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    userChart: [],
    orderChart: [],
    productChart: [],
  });

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      // Replace this with actual API call
      const response = {
        userCount: 1000,
        orderCount: 500,
        productCount: 200,
        userChart: [
          { name: "Jan", value: 400 },
          { name: "Feb", value: 600 },
          { name: "Mar", value: 800 },
          { name: "Apr", value: 1000 },
        ],
        orderChart: [
          { name: "Jan", value: 200 },
          { name: "Feb", value: 300 },
          { name: "Mar", value: 400 },
          { name: "Apr", value: 500 },
        ],
        productChart: [
          { name: "Electronics", value: 50 },
          { name: "Clothing", value: 80 },
          { name: "Books", value: 40 },
          { name: "Home", value: 30 },
        ],
      };
      setData(response as any);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 text-white p-6  shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gray-800 p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-4xl font-bold">{data.userCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gray-800 p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-4xl font-bold">{data.orderCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gray-800 p-4 rounded-lg"
        >
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-4xl font-bold">{data.productCount}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.orderChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.productChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
