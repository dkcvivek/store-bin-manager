"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TitleBar from "@/components/TitleBar";

type MessageImage = {
  item_id: number;
  item_photo: string;
};

type ItemResponse = {
  bin_id: number;
  bin_number: number;
  zip_lock_id: string;
  zip_lock_number: number;
  items: MessageImage[];
};

export default function GroupChatPage() {
  const params = useParams();

  const binNo = params.binNo;
  const groupName = String(params.groupName);

  const zipId = groupName.replace("z-", "");

  const [messages, setMessages] = useState<MessageImage[]>([]);
  const [details, setDetails] = useState<ItemResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setIsUploading(true);

      const imageUrl = URL.createObjectURL(file);

      const tempId = Date.now();

      setMessages((prev) => [
        {
          item_id: tempId,
          item_photo: imageUrl,
        },
        ...prev,
      ]);

      const formData = new FormData();

      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-item/${zipId}/`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Create Item API Failed");
      }

      // REFRESH ITEMS
      const updatedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-item/${zipId}/`,
      );

      if (!updatedRes.ok) {
        throw new Error("Refresh Items Failed");
      }

      const updatedData: ItemResponse = await updatedRes.json();

      setDetails(updatedData);

      setMessages(updatedData.items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (!zipId) return;

    const fetchItems = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-item/${zipId}/`,
        );

        if (!res.ok) {
          throw new Error("List Items API Failed");
        }

        const data: ItemResponse = await res.json();

        console.log(data);

        setDetails(data);

        setMessages(data.items);
      } catch (e) {
        console.error(e);
        alert("API Failed");
      }
    };

    fetchItems();
  }, [zipId]);

  if (isUploading) {
    return <p className="text-3xl text-center">Loading</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {!showPreview && !previewImage && (
        <TitleBar
          title={
            details
              ? `BIN-${details.bin_number} / Z-${details.zip_lock_number}`
              : `${String(binNo).toUpperCase()} / ${groupName.toUpperCase()}`
          }
        />
      )}
      <div className="flex-1 w-full max-w-sm mx-auto px-3 py-4 flex flex-col gap-4 pb-28">
        {messages.map((msg) => (
          <div key={msg.item_id} className="ml-auto max-w-[80%]">
            <div className="overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl">
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${msg.item_photo}`}
                alt="scanned"
                className="w-full object-cover cursor-pointer"
                onClick={() => {
                  setPreviewImage(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${msg.item_photo}`,
                  );

                  setShowPreview(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-black/10 dark:border-white/10">
        <div className="w-full max-w-sm mx-auto px-4 py-3 flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-foreground text-background text-2xl active:scale-95 transition flex items-center justify-center shadow-lg"
          >
            {isUploading ? "..." : "📷"}
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
      </div>

      {showPreview && previewImage && (
        <div className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            ×
          </button>

          <img
            src={previewImage}
            alt="preview"
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
