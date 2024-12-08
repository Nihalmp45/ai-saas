import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// DELETE API route handler
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { 
    const { id: videoId } = params; // Accessing video ID from params

    // Check if the video exists in the database
    const video = await prisma.video.findUnique({ where: { id: videoId } });

    if (!video) {
      console.error("Video not found in database");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete the video from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    if (cloudinaryResponse.result !== "ok") {
      console.error("Failed to delete video from Cloudinary:", cloudinaryResponse);
      return NextResponse.json({ error: "Failed to delete video from Cloudinary" }, { status: 500 });
    }

    // Delete the video from the database
    await prisma.video.delete({ where: { id: videoId } });

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error: unknown) {
    // Handling unknown errors safely
    if (error instanceof Error) {
      console.error("Error deleting video:", error.stack);
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  } finally {
    // Disconnecting Prisma client after operation
    await prisma.$disconnect();
  }
}
