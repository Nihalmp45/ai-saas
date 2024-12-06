// import { NextRequest, NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';
// import { auth } from '@clerk/nextjs/server';

// // Configuration
// cloudinary.config({
//     cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
// });

// interface CloudinaryUploadResult {
//     public_id: string;
//     [key: string]: any
// }

// export async function POST(request: NextRequest) {
//     const {userId}:any = auth()

//     if (!userId) {
//         return NextResponse.json({error: "Unauthorized"}, {status: 401})
//     }

//     try {
//         const formData = await request.formData();
//         const file = formData.get("file") as File | null;

//         if(!file){
//             return NextResponse.json({error: "File not found"}, {status: 400})
//         }

//         const bytes = await file.arrayBuffer()
//         const buffer = Buffer.from(bytes)

        // const result = await new Promise<CloudinaryUploadResult>(
        //     (resolve, reject) => {
        //         const uploadStream = cloudinary.uploader.upload_stream(
        //             {folder: "next-cloudinary-uploads"},
        //             (error, result) => {
        //                 if(error) reject(error);
        //                 else resolve(result as CloudinaryUploadResult);
        //             }
        //         )
        //         uploadStream.end(buffer)
        //     }
        // )
//         return NextResponse.json(
//             {
//                 publicId: result.public_id
//             },
//             {
//                 status: 200
//             }
//         )

//     } catch (error) {
//         console.log("Upload image failed", error)
//         return NextResponse.json({error: "Upload image failed"}, {status: 500})
//     }

// }

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { userId }:any = await auth();
    console.log("line no 81",userId)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!buffer) {
      throw new Error('Buffer creation failed');
    }

    const result = await new Promise<CloudinaryUploadResult>(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder: "next-cloudinary-uploads"},
                (error, result) => {
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer)
        }
    )

   

    return NextResponse.json({ publicId: result.public_id }, { status: 200 });
  } catch (error:any) {
    console.error('Upload image failed:', error);
    return NextResponse.json(
      { error: 'Upload image failed', details: error.message },
      { status: 500 }
    );
  }
}