"use client";

import { apiClient } from "@/lib/api-client";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    if (!title || !description) {
      throw new Error("Title and description are required");
    }

    const file = fileInput.files[0];

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    try {
      //ImageKit Upload
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      //console.log("Upload response:", uploadResponse);

      //Database upload
      const videoUploadResponse = await apiClient.createVideo({
        title,
        description,
        videoUrl: uploadResponse.url!,
      });

      if (!videoUploadResponse) {
        throw new Error("Failed to upload video");
      }

      router.push("/");
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-200 shadow-md">
        <div className="card-body flex justify-center items-center">
          <h2 className="card-title text-2xl font-bold">Upload New Reel</h2>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input
              type="text"
              className="input"
              placeholder="Type here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <input
              type="text"
              className="input"
              placeholder="Type here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Upload Video</legend>
            <input type="file" className="file-input" ref={fileInputRef} />
          </fieldset>
          <progress
            className="progress progress-success w-56"
            value={progress}
            max="100"
          >
            {progress}
          </progress>

          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
