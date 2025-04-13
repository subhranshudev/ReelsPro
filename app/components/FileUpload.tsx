// "use client";

// import React, { useState } from "react";
// import { IKUpload } from "imagekitio-next";
// import { Loader2 } from "lucide-react";
// import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

// interface FileUploadProps {
//   onSuccess: (res: IKUploadResponse) => void;
//   onProgress: (progress: number) => void;
//   fileType?: "Image" | "video";
// }

// export default function FileUpload({
//   onSuccess,
//   onProgress,
//   fileType = "Image",
// }: FileUploadProps) {

//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onError = (err: { message: string }) => {
//     console.log("Error", err);
//     setError(err.message);
//     setUploading(false);
//   };

//   const handleSuccess = (response: IKUploadResponse) => {
//     console.log("Success", response);
//     setUploading(false);
//     setError(null);
//     onSuccess(response);
//   };

//   const handleProgress = (evt: ProgressEvent) => {
//     if (evt.lengthComputable && onProgress) {
//       const percentComplete = (evt.loaded / evt.total) * 100;
//       onProgress(Math.round(percentComplete));
//     }
//   };

//   const handleStartUpload = () => {
//     setUploading(true);
//     setError(null);
//   };

//   const validateFile = (file: File) => {
//     if (fileType === "video") {
//       if (!file.type.startsWith("video/")) {
//         setError("Please upload a video file");
//         return false;
//       }
//       if (file.size > 100 * 1024 * 1024) {
//         setError("Video must be less than 100mb");
//         return false;
//       }
//     } else {
//       const validTypes = ["image/jpeg", "image/png", "image/webp"];
//       if (!validTypes.includes(file.type)) {
//         setError("Please upload a valid file (JPEG, PNG, webP)");
//         return false;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError("Image must be less than 5mb");
//         return false;
//       }

//       return false;
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <IKUpload
//         fileName={fileType === "video" ? "video" : "image"}
//         onError={onError}
//         onSuccess={onSuccess}
//         onUploadStart={handleStartUpload}
//         onUploadProgress={handleProgress}
//         accept={fileType === "video" ? "video/*" : "image/*"}
//         className="file-input file-input-bordered w-full"
//         validateFile={validateFile}
//         useUniqueFileName={true}
//         folder={fileType === "video" ? "/videos" : "/images"}
//       />
//       {uploading && (
//         <div className="flex items-center gap-2 text-sm text-primary">
//           <Loader2 className="animate-spin w-4 h-4" />
//           <span>Uploading...</span>
//         </div>
//       )}
//       {error && <div className="text-error text-sm">{error}</div>}
//     </div>
//   );
// }





"use client"; 

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

const FileUpload = () => {
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
      console.log("Upload response:", uploadResponse);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <>
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
    </>
  );
};


export default FileUpload;


// AITags
// : 
// null
// audioCodec
// : 
// "aac"
// bitRate
// : 
// 3004047
// duration
// : 
// 34
// fileId
// : 
// "67fc1338432c4764166862be"
// filePath
// : 
// "/SRK-_at_23.24.08_53fe641f__QTuwDcZS.mp4"
// fileType
// : 
// "non-image"
// height
// : 
// 1280
// name
// : 
// "SRK-_at_23.24.08_53fe641f__QTuwDcZS.mp4"
// size
// : 
// 13098780
// url
// : 
// "https://ik.imagekit.io/jl3fx9fzj/SRK-_at_23.24.08_53fe641f__QTuwDcZS.mp4"
// versionInfo
// : 
// {id: '67fc1338432c4764166862be', name: 'Version 1'}
// videoCodec
// : 
// "h264"
// width
// : 
// 720
// $ResponseMetadata
// : 
// headers
// : 
// {content-length: '438', content-type: 'application/json; charset=utf-8'}
// requestId
// : 
// undefined
// statusCode
// : 
// 200
// [[Prototype]]
// : 
// Object
// [[Prototype]]
// : 
// Object

