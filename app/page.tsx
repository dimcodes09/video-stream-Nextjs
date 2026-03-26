"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/video");
      const data = await res.json();
      setVideos(data);
    };

    fetchVideos();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "#0f0f0f",
          padding: "15px 30px",
          borderBottom: "1px solid #222",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <h1 style={{ fontSize: "20px" }}>StreamX</h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {session ? (
            <>
              <Link
                href="/upload"
                style={{
                  padding: "8px 14px",
                  background: "#22c55e",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                Upload
              </Link>

              <button
                onClick={() => signOut()}
                style={{
                  padding: "8px 14px",
                  background: "#ef4444",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* 🔥 GRID */}
      <div
        style={{
          padding: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {videos.map((video) => (
          <div
            key={video._id}
            onClick={() => router.push(`/video/${video._id}`)}
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#181818",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {/* THUMBNAIL */}
            <div style={{ position: "relative" }}>
              <img
                src={video.thumbnailUrl}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  background: "rgba(0,0,0,0.7)",
                  padding: "3px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                ▶
              </div>
            </div>

            {/* INFO */}
            <div style={{ padding: "10px" }}>
              <h3 style={{ fontSize: "14px", marginBottom: "4px" }}>
                {video.title}
              </h3>
              <p style={{ fontSize: "12px", color: "#aaa" }}>
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}