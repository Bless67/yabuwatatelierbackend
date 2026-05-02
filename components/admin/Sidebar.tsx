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
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect } from "react";

interface SidebarProps {
  activeTab?: string;
}

export default function AdminSidebar({ activeTab }: SidebarProps) {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on window resize (prevents overlay sticking if user goes mobile -> desktop)
  useEffect(() => {
    const handleResize = () => {if (window.innerWidth >= 768) setIsOpen(false)};
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (tab: string) => {
    const currentTab = searchParams.get("tab") || "dashboard";
    return currentTab === tab;
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiBarChart, href: "/?tab=dashboard" },
    { id: "products", label: "Products", icon: FiPackage, href: "/?tab=products" },
    { id: "orders", label: "Orders", icon: FiTrendingUp, href: "/?tab=orders" },
    { id: "messages", label: "Messages", icon: FiDollarSign, href: "/?tab=messages" },
  ];

  return (
    <>
      {/* Mobile Trigger - Elegant Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#1a4d3e] text-[#E8E4D9] rounded-full shadow-lg border border-[#2d5a52] active:scale-95 transition-transform"
        >
          <FiMenu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 w-72 bg-[#1a4d3e] text-[#E8E4D9] h-screen shadow-2xl md:shadow-none transform transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header Section */}
        <div className="p-8 border-b border-[#2d5a52]/50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#E8E4D9]">ATELIER</h1>
            <div className="h-0.5 w-8 bg-[#b8a876] mt-1" />
            <p className="text-[#c5d5cf]/60 text-[10px] uppercase tracking-widest mt-2">Management</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-[#E8E4D9] hover:bg-[#2d5a52] rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 mt-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-[#b8a876] text-[#1a4d3e] shadow-md"
                    : "text-[#c5d5cf] hover:bg-[#2d5a52] hover:text-[#E8E4D9]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? "text-[#1a4d3e]" : "text-[#b8a876] group-hover:scale-110 transition-transform"} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {active && <FiChevronRight size={14} className="animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Transparent "Glass" Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isOpen 
            ? "opacity-100 pointer-events-auto bg-black/10 backdrop-blur-[2px]" 
            : "opacity-0 pointer-events-none bg-transparent"
        }`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}