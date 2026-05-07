"use client";

import { useRouter } from "next/navigation";
import TitleBar from "@/components/TitleBar";

export default function HomePage() {
  const router = useRouter();

  const bins = Array.from({ length: 158 }, (_, i) => ({
    id: i + 1,
    name: `Bin - ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TitleBar title="Bin Manager" />

      <div className="w-full max-w-sm px-3 py-3 mx-auto">
        <div className="flex flex-col gap-3">
          {bins.map((bin) => (
            <button
              key={bin.id}
              onClick={() => router.push(`/${bin.id}`)}
              className="w-full min-h-18 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm px-4 flex items-center active:scale-[0.98] transition"
            >
              <span className="text-lg font-semibold">{bin.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
