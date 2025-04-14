"use client";

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import { Video } from "@imagekit/next";
import Link from "next/link";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {videos.map((video) => (
          <div
            key={video._id?.toString()}
            className=" bg-black rounded-xl overflow-hidden shadow-lg"
          >
            {/* Video */}
            <Video
              src={video.videoUrl}
              controls
              // width={1080}
              // height={1920}
              transformation={[{ height: "1920", width: "1080" }]}
              // className="w-full h-auto "
            />

            {/* Title & description below */}
            <div className="p-4 text-white">
              <h2 className="text-base font-semibold truncate mb-1">
                {video.title}
              </h2>
              <p className="text-sm text-gray-300">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
