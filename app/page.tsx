"use client";

import ItemForm from "@/components/forms/ItemForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function handleItemAdded() {
    router.push("/all-tasks");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ItemForm onItemAdded={handleItemAdded} />
      </div>
    </div>
  );
}
