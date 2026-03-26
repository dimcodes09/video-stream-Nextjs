"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch("/api/video");
      const data = await res.json();

      const found = data.find((v: any) => v._id === id);
      setVideo(found);
    };

    fetchVideo();
  }, [id]);

  if (!video) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        padding: "20px",
      }}
    >
      {/* 🔙 BACK */}
      <Link href="/" style={{ color: "#22c55e" }}>
        ← Back to Feed
      </Link>

      {/* 🔥 MAIN LAYOUT */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* 🎥 VIDEO PLAYER */}
        <div style={{ flex: "2" }}>
          <video
            src={video.videoUrl}
            controls
            autoPlay
            style={{
              width: "100%",
              borderRadius: "12px",
              background: "black",
            }}
          />

          {/* 📄 DETAILS */}
          <div style={{ marginTop: "15px" }}>
            <h2 style={{ fontSize: "20px" }}>{video.title}</h2>
            <p style={{ color: "#aaa", marginTop: "5px" }}>
              {video.description}
            </p>
          </div>
        </div>

        {/* 📺 SIDE PANEL (RELATED VIDEOS PLACEHOLDER) */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h3 style={{ marginBottom: "10px" }}>More Videos</h3>

          <p style={{ color: "#888" }}>
            Coming next: related videos
          </p>
        </div>
      </div>
    </div>
  );
}