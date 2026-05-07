"use client";

import { useRouter } from "next/navigation";
import TitleBar from "@/components/TitleBar";
import { useEffect, useState } from "react";

type Bin = {
  bin_id: string;
  bin_number: string;
};
export default function BinScreen() {
  const router = useRouter();
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-bin`,
        );

        if (!res.ok) {
          throw new Error("List Bins Api Failed");
        }

        const data = await res.json();
        console.log(data);
        setBins(data);
      } catch (e: any) {
        console.error(e);
      }
    };

    fetchBins();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TitleBar title="Bin Manager" />

      <div className="w-full max-w-sm px-3 py-3 mx-auto">
        <div className="flex flex-col gap-3">
          {bins.map((bin) => (
            <button
              key={bin.bin_id}
              onClick={() => router.push(`/bin-${bin.bin_id}`)}
              className="w-full min-h-18 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm px-4 flex items-center active:scale-[0.98] transition"
            >
              <span className="text-lg font-semibold">Bin - {bin.bin_number}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
