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

    const videoId = params.id;

    // Check if the video exists
 
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    

    if (!video) {
      console.error("Video not found in database");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Delete video from Cloudinary
  
    const cloudinaryResponse = await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });
  

    // Delete video from the database
    
    const deletedVideo = await prisma.video.delete({ where: { id: videoId } });


    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error:any) {
    console.error("Error deleting video:", error.stack);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

