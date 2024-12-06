import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Video ID received in params:", params.id);
    const videoId = params.id;

    // Check if the video exists
    console.log("Checking video in database...");
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    console.log("Video retrieved:", video);

    if (!video) {
      console.error("Video not found in database");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete video from Cloudinary
    console.log("Deleting video from Cloudinary...");
    const cloudinaryResponse = await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });
    console.log("Cloudinary deletion response:", cloudinaryResponse);

    // Delete video from the database
    console.log("Deleting video from database...");
    const deletedVideo = await prisma.video.delete({ where: { id: videoId } });
    console.log("Deleted video:", deletedVideo);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting video:", error.stack);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

