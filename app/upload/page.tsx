"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a video");

    if (!file.type.startsWith("video/")) {
      return alert("Only video allowed");
    }

    if (file.size > 50 * 1024 * 1024) {
      return alert("Max size 50MB");
    }

    setLoading(true);

    try {
      const authRes = await fetch("/api/imagekit");
      const authData = await authRes.json();

      const { authenticationParameters, publicKey } = authData;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", authenticationParameters.signature);
      formData.append("expire", authenticationParameters.expire.toString());
      formData.append("token", authenticationParameters.token);

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.message);

      const saveRes = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: file.name,
          description: "Uploaded video",
          videoUrl: uploadData.url,
          thumbnailUrl:
            thumbnail ||
            uploadData.thumbnailUrl ||
            "https://via.placeholder.com/300x500",
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok) throw new Error(saveData.error);

      alert("Uploaded");

      setFile(null);
      setThumbnail("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        padding: "40px",
      }}
    >
      {/* NAV */}
      <Link href="/" style={{ color: "#22c55e" }}>
        ← Back
      </Link>

      {/* CARD */}
      <div
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          background: "#181818",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Upload Video</h2>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && (
          <p style={{ fontSize: "12px", marginTop: "5px" }}>
            {file.name}
          </p>
        )}

        <input
          type="text"
          placeholder="Thumbnail URL (optional)"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
          }}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#22c55e",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}