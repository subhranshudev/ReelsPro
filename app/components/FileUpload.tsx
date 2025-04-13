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

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
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
      {/* File input element using React ref */}
      <input type="file" ref={fileInputRef} />
      {/* Button to trigger the upload process */}
      <button type="button" onClick={handleUpload}>
        Upload file
      </button>
      <br />
      {/* Display the current upload progress */}
      Upload progress: <progress value={progress} max={100}>{progress}</progress>
    </>
  );
};

export default FileUpload;