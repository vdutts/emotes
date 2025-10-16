import { v2 as cloudinary } from "cloudinary"
import { put } from "@vercel/blob"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  // Try Cloudinary first, fallback to Vercel Blob if it fails
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary not configured, using Vercel Blob")
    }

    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "emojis",
          public_id: filename,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result!.secure_url)
        }
      )
      uploadStream.end(buffer)
    })
  } catch (cloudinaryError) {
    console.warn("Cloudinary upload failed, falling back to Vercel Blob:", cloudinaryError)
    
    // Fallback to Vercel Blob
    const blob = await put(`emojis/${filename}.png`, buffer, {
      access: "public",
      contentType: "image/png",
    })
    
    return blob.url
  }
}
