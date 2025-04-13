"use client"

import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";
import { Video } from "@imagekit/next";

export default function Home() {

  const [videos, setVideos] = useState<IVideo[]>([])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos()
        setVideos(data)
      } catch (error) {
        console.error("Error fetching videos", error)
      }
    }

    fetchVideos()
  }, [])


  return (
    <>
      <h1>chaicode</h1>
      {videos.map((video) => (
        <div className="card bg-base-100 w-96 shadow-sm">
          <Video
            urlEndpoint={process.env.IMAGEKIT_URL_ENDPOINT}
            src={video.videoUrl}
            controls
            width={500}
            height={500}
          />
          <div className="card-body">
            <h2 className="card-title">{video.title}</h2>
            <p>
             {video.description}
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}


