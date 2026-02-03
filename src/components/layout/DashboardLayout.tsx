"use client";

import { Sidebar, MobileSidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileSidebar />
        {userData?.hesapDurumu === "askida" && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Hesabınız askıya alınmıştır. Ödeme bilgileri için:{" "}
              <strong>kgmdanismanlik@gmail.com</strong> | <strong>+90 554 379 16 32</strong>.
              Ödemeniz onaylandıktan sonra hesabınız aktif edilecektir.
            </p>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
