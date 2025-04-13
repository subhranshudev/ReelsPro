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
      <h1>chaicode</h1>
      {videos.map((video) => (
        // <div
        //   className="card bg-base-100 w-96 shadow-sm m-2 border-amber-300 rounded-lg"
        //   style={{ aspectRatio: "9/16" }}
        //   key={video._id?.toString()}
        // >
        //   <div className="overflow-hidden rounded-xl">
        //     <Video
        //       src={video.videoUrl}
        //       controls
        //       width={500}
        //       height={500}
        //       // transformation={[{ width: 1080, height: 1920 }]}
        //       transformation={[{ height: "1920", width: "1080" }]}
        //       className="w-full h-full object-cover overflow-hidden"
        //     />
        //   </div>
        //   <div className="card-body">
        //     <h2 className="card-title">{video.title}</h2>
        //     <p>{video.description}</p>
        //     {/* <div className="card-actions justify-end">
        //       <button className="btn btn-primary">Buy Now</button>
        //     </div> */}
        //   </div>
        // </div>

        // *************************

        <div className="card w-96 bg-base-100 card-sm shadow-sm overflow-hidden rounded-xl" key={video._id?.toString()}>
          <div className="card-body">
            <Video
              src={video.videoUrl}
              controls
              width={500}
              height={500}

              transformation={[{ height: "1920", width: "1080" }]}
              className="w-full h-full object-cover overflow-hidden"
            />
            <h2 className="card-title">{video.title}</h2>
            <p>{video.description} </p>
            
          </div>
        </div>
      ))}
    </>
  );
}
