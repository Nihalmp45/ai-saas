"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VideoCard from "@/components/VideoCard";
import { Video } from "@/types";
function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(" Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a"); // Create an anchor tag dynamically
    link.href = url; // Set the URL of the file to be downloaded
    link.setAttribute("download", `${title}.mp4`); // Suggest a file name to the browser
    document.body.appendChild(link); // Add the link to the DOM temporarily
    link.click(); // Trigger a click event programmatically
    document.body.removeChild(link); // Remove the link from the DOM
  }, []);

  const handleDelete = useCallback(async (videoId: string) => {
    setDeletingVideoId(videoId); // Set the video ID being deleted
    try {
      const response = await axios.delete(`/api/videos/${videoId}`);
      if (response.status === 200) {
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.id !== videoId)
        );
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeletingVideoId(null); // Reset deleting state after the operation
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              onDelete={handleDelete}
              isDeleting={deletingVideoId === video.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
