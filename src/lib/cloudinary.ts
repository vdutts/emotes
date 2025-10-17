import { v2 as cloudinary } from "cloudinary"

// Use CLOUDINARY_URL format if available, otherwise individual config
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL)
} else {
  cloudinary.config({
    cloud_name: "ddyc1es5v",
    api_key: "458158127669987",
    api_secret: "a6-YrbGmp_QdGPv3PWqZZWxiWB4",
  })
}

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  try {
    console.log("Starting Cloudinary upload for:", filename)
    
    // Convert buffer to base64 data URI
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`
    
    const result = await cloudinary.uploader.upload(base64, {
      folder: "emojis",
      public_id: filename,
      resource_type: "image",
    })
    
    console.log("Cloudinary upload success:", result.secure_url)
    return result.secure_url
  } catch (cloudinaryError) {
    console.error("Cloudinary upload failed:", cloudinaryError)
    throw cloudinaryError
  }
}
