"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiPackage,
  FiBarChart,
  FiTrendingUp,
  FiDollarSign,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";

interface SidebarProps {
  activeTab: "dashboard" | "products" | "orders" | "messages";
}

export default function AdminSidebar({ activeTab }: SidebarProps) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (tab: string) => {
    const currentTab = searchParams.get("tab") || "dashboard";
    return currentTab === tab;
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FiBarChart,
      href: "/admin?tab=dashboard",
    },
    {
      id: "products",
      label: "Products",
      icon: FiPackage,
      href: "/admin?tab=products",
    },
    {
      id: "orders",
      label: "Orders",
      icon: FiTrendingUp,
      href: "/admin?tab=orders",
    },
    {
      id: "messages",
      label: "Messages",
      icon: FiDollarSign,
      href: "/admin?tab=messages",
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#1a4d3e] text-[#E8E4D9] rounded-lg"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 bg-[#1a4d3e] text-[#E8E4D9] p-6 h-screen overflow-y-auto transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="mb-8 mt-12 md:mt-0">
          <h1 className="text-2xl font-bold">Atelier Admin</h1>
          <p className="text-[#c5d5cf] text-sm">Management Dashboard</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.id)
                    ? "bg-[#b8a876] text-[#1a4d3e]"
                    : "text-[#c5d5cf] hover:bg-[#2d5a52]"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
