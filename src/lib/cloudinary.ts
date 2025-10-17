import { v2 as cloudinary } from "cloudinary"
import { put } from "@vercel/blob"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "ddyc1es5v",
  api_key: process.env.CLOUDINARY_API_KEY || "458158127669987",
  api_secret: process.env.CLOUDINARY_API_SECRET || "a6-YrbGmp_QdGPv3PWqZZWxiWB4",
})

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  // Try Cloudinary first, fallback to Vercel Blob if it fails
  try {
    console.log("Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING",
      api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
    })
    
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
    console.error("Cloudinary upload failed:", cloudinaryError)
    throw cloudinaryError
  }
}
