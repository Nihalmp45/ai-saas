"use client"

import React, {useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';

const socialFormats = {
  // Instagram
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Landscape (1.91:1)": { width: 1080, height: 608, aspectRatio: "1.91:1" },
  "Instagram DP": { width: 320, height: 320, aspectRatio: "1:1" },
  "Instagram Story/reel": { width: 1080, height: 1920, aspectRatio: "9:16" },

  // Twitter
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Profile Picture (DP)": { width: 400, height: 400, aspectRatio: "1:1" },
 

  // Facebook
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Profile Picture": { width: 360, height: 360, aspectRatio: "1:1" },
  "Facebook Post (Square)": { width: 1080, height: 1080, aspectRatio: "1:1" },

  // LinkedIn
  "LinkedIn Profile Picture": { width: 400, height: 400, aspectRatio: "1:1" },
  "LinkedIn Cover Image": { width: 1584, height: 396, aspectRatio: "4:1" },

  // YouTube
  "YouTube Channel Art": { width: 2560, height: 1440, safeZone: "1546x423", aspectRatio: "16:9" },
  "YouTube Thumbnail": { width: 1280, height: 720, aspectRatio: "16:9" },

  // TikTok
  "TikTok Video": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "TikTok Profile Picture": { width: 200, height: 200, aspectRatio: "1:1" },

  // Pinterest
  "Pinterest Pin (Standard)": { width: 1000, height: 1500, aspectRatio: "2:3" },


  // Snapchat
  "Snapchat Story/Ad": { width: 1080, height: 1920, aspectRatio: "9:16" },
};


  type SocialFormat = keyof typeof socialFormats;

  export default function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        if(uploadedImage){
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
    
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
    
      try {
        const response = await fetch('/api/image-upload', {
          method: 'POST',
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error(`Failed to upload image: ${response.statusText}`);
        }
    
        const data = await response.json();
        setUploadedImage(data.publicId);
      } catch (error) {
        console.error(error);
        alert('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };
    

    const handleDownload = () => {
        if(!imageRef.current) return;

        fetch(imageRef.current.src)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
    }


    return (
        <div className="container mx-auto p-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Social Media Image Creator
          </h1>

          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Upload an Image</h2>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Choose an image file</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              {isUploading && (
                <div className="mt-4">
                  <progress className="progress progress-primary w-full"></progress>
                </div>
              )}

              {uploadedImage && (
                <div className="mt-6">
                  <h2 className="card-title mb-4">Select Social Media Format</h2>
                  <div className="form-control">
                    <select
                      className="select select-bordered w-full"
                      value={selectedFormat}
                      onChange={(e) =>
                        setSelectedFormat(e.target.value as SocialFormat)
                      }
                    >
                      {Object.keys(socialFormats).map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-6 relative">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="flex justify-center">
                      {isTransforming && (
                        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                          <span className="loading loading-spinner loading-lg"></span>
                        </div>
                      )}
                      <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity='auto'
                        ref={imageRef}
                        onLoad={() => setIsTransforming(false)}
                        />
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={handleDownload}>
                      Download for {selectedFormat}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}