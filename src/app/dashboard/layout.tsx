"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { firebaseUser, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        router.push("/giris");
      } else if (userData?.hesapDurumu === "iptal") {
        router.push("/giris");
      }
    }
  }, [firebaseUser, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!firebaseUser) return null;

  return <DashboardLayout>{children}</DashboardLayout>;
}
