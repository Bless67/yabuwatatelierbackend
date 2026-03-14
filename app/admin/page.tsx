"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  FiPackage,
  FiBarChart,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import AdminSidebar from "@/components/admin/Sidebar";
import ProductList from "@/components/admin/ProductList";

interface Product {
  id: number;
  name: string;
  description: string | null;
  markupPrice: number;
  salePrice: number;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
  }>;
  createdAt: string;
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "messages"
  >("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get tab from URL
  useEffect(() => {
    const tab = (searchParams.get("tab") as
      | "dashboard"
      | "products"
      | "orders"
      | "messages"
      | null) || "dashboard";
    setActiveTab(tab);
  }, [searchParams]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab, fetchProducts]);



  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
  }) => (
    <div className={`${color} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-5xl opacity-20">{Icon}</div>
      </div>
    </div>
  );

  const cardColors = {
    products: "bg-gradient-to-br from-[#1a4d3e] to-[#2d5a52]",
    revenue: "bg-gradient-to-br from-[#b8a876] to-[#a89860]",
    orders: "bg-gradient-to-br from-[#2d5a52] to-[#3d6b62]",
    messages: "bg-gradient-to-br from-[#c5d5cf] to-[#a89860]",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#f5f1e8]">
        <div className="p-4 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
<h1 className="text-3xl font-bold text-[#1a4d3e] mb-8">
                Welcome to Admin Dashboard
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon="📦"
                  title="Total Products"
                  value={products.length}
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                  icon="💰"
                  title="Revenue"
                  value="₦0"
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                  icon="📈"
                  title="Orders"
                  value="0"
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                  icon="💬"
                  title="Messages"
                  value="0"
                  color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Recent Activity
                </h2>
                <p className="text-gray-600">
                  No recent activity to display
                </p>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductList
              products={products}
              isLoading={isLoading}
              onRefresh={fetchProducts}
            />
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <FiTrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Orders section coming soon
              </p>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <FiDollarSign size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                Messages section coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
