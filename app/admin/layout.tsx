import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Atelier",
  description: "Manage products, orders, and inventory",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#f5f1e8] flex-col md:flex-row">
      {children}
    </div>
  );
}
