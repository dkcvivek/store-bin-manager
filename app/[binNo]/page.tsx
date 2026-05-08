"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TitleBar from "@/components/TitleBar";

type ZipLock = {
  zip_id: string;
  zip_lock_number: string;
};

export default function BinDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const binNo = params.binNo;

  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zips, setZips] = useState<ZipLock[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddGroup = () => {
    const nextNumber = zips.length + 1;

    setGroupName(`Z-${nextNumber}`);
    setSelectedImage(null);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);

    setSelectedFile(file);
  };

  useEffect(() => {
    if (!binNo) return;

    const fetchZips = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-zip-lock/${String(binNo).replace("bin-", "")}/`,
          {
            headers: {
              "ngrok-skip-browser-warning": "1",
            },
          },
        );

        if (!res.ok) {
          throw new Error("Zip Lock API Failed");
        }

        const data = await res.json();

        console.log(data);

        setZips(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchZips();
  }, [binNo]);

  const handleSave = async () => {
    try {
      if (!selectedFile) {
        return;
      }

      const formData = new FormData();

      formData.append("image", selectedFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-zip-lock/${String(binNo).replace("bin-", "")}/`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "1",
          },
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Create Zip Lock Failed");
      }

      const newZipId = await res.json();

      console.log(newZipId);

      setShowModal(false);

      const updatedRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/list-zip-lock/${String(binNo).replace("bin-", "")}/`,
        {
          headers: {
            "ngrok-skip-browser-warning": "1",
          },
        },
      );

      const updatedData = await updatedRes.json();

      setZips(updatedData);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TitleBar
        title={`${String(binNo).toUpperCase()}`}
        showAddButton
        onAddClick={handleAddGroup}
      />

      <div className="w-full max-w-sm px-3 py-3 mx-auto">
        <div className="flex flex-col gap-3">
          {zips.map((zip) => (
            <button
              key={zip.zip_id}
              className="w-full min-h-18 border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm px-4 flex items-center active:scale-[0.98] transition"
              onClick={() => router.push(`/${binNo}/z-${zip.zip_id}`)}
            >
              <span className="text-lg font-semibold">
                {zip.zip_lock_number}
              </span>
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 p-5 shadow-2xl">
            <h2 className="text-xl font-bold mb-5 text-center">
              Add New Group
            </h2>

            <div className="flex justify-center mb-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-full border-2 border-dashed border-black/20 dark:border-white/20 overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5"
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
                <span className="text-2xl font-bold">{`${String(binNo).toUpperCase()}`}</span>

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

              <button
                className="flex-1 h-12 bg-foreground text-background font-semibold"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
