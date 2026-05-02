import type { Metadata } from "next";
import {Toaster} from "../../components/ui/sonner";
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
    <div className="flex min-h-screen bg-[#f5f1e8] flex-col md:flex-row">
      <div className="w-full md:pt-0">
        {children}
      </div>
      <Toaster />

    </div>
  );
}
