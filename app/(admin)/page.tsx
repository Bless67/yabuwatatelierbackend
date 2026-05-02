import { Suspense } from "react";
import AdminDashboard from "./AdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboardLoading() {
  return (
    <div className="flex w-full">
      <div className="w-64 bg-linear-to-b from-[#0f3d31] to-[#1a4d3e] h-screen"></div>
      <div className="flex-1 bg-[#f5f1e8] p-8">
        <Skeleton className="h-10 mb-8 w-1/3" />
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminDashboard />
    </Suspense>
  );
}
