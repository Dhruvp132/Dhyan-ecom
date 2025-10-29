"use client";
import React, { FC } from "react";
import { UploadButton } from "@/utils/uploadthing";

interface ImageUploadProps {
  url: (urls: string[]) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({ url }) => {
  // Function to handle successful uploads
  const handleUploadSuccess = (res: any) => {
    // Extract all uploaded URLs and pass them as an array
    const uploadedUrls = res.map((file: any) => file.url);
    console.log("Uploaded Files: ", uploadedUrls);
    url(uploadedUrls);
    alert("Upload Completed");
  };

  // Function to handle upload errors
  const handleUploadError = (error: Error) => {
    alert(`ERROR ${error.message}`);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-3">
        <div className="p-8 max-w-lg w-full bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Image Uploader
          </h2>
          <div className="mb-4 text-center">
            <p className="text-gray-600">Please select an image to upload.</p>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
