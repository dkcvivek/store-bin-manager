"use client";

import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import TitleBar from "@/components/TitleBar";

export default function BinDetailsPage() {
  const params = useParams();

  const binNo = params.binNo;

  const pouchGroups = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `z - ${i + 1}`,
  }));

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState(`Z - ${pouchGroups.length + 1}`);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddGroup = () => {
    setGroupName(`Z- ${pouchGroups.length + 1}`);
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TitleBar
        title={`Bin - ${binNo}`}
        showAddButton
        onAddClick={handleAddGroup}
      />

      <div className="w-full max-w-sm px-3 py-3 mx-auto">
        <div className="flex flex-col gap-3">
          {pouchGroups.map((group) => (
            <div
              key={group.id}
              className="w-full min-h-18 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm px-4 flex items-center active:scale-[0.98] transition"
            >
              <span className="text-lg font-semibold">{group.name}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 p-5 shadow-2xl">
            <h2 className="text-xl font-bold mb-5 text-center">Add New Group</h2>

            <div className="flex justify-center mb-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">📷</span>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div className="mb-5">
              <div className="w-full border border-black/10 dark:border-white/10 bg-black/3 dark:bg-white/3 px-4 py-5 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  Bin - {binNo}
                </span>

                <span className="text-2xl font-bold mt-1">{groupName}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 border border-black/10 dark:border-white/10"
              >
                Cancel
              </button>

              <button className="flex-1 h-12 bg-foreground text-background font-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
