"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItemList from "@/components/itemList";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";

export default function AllTasksPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleBackClick = () => {
    toast.success("Redirecting to form...");
    setTimeout(() => router.push("/"), 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center  bg-gradient-to-b from-slate-50 to-slate-100 justify-start px-4 py-8">
      <div className="w-full max-w-2xl">
        <Button onClick={handleBackClick} className="mb-6">
          <ArrowBigLeft />
        </Button>

        <h1 className="text-3xl text-center font-bold mb-4">--All Tasks--</h1>
        <ItemList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
