import { v2 as cloudinary } from "cloudinary"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "ddyc1es5v",
  api_key: process.env.CLOUDINARY_API_KEY || "458158127669987",
  api_secret: process.env.CLOUDINARY_API_SECRET || "a6-YrbGmp_QdGPv3PWqZZWxiWB4",
})

export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  try {
    console.log("Starting Cloudinary upload for:", filename)
    
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "emojis",
          public_id: filename,
          resource_type: "image",
          format: "png",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            console.log("Cloudinary upload success:", result!.secure_url)
            resolve(result!.secure_url)
          }
        }
      )
      uploadStream.end(buffer)
    })
  } catch (cloudinaryError) {
    console.error("Cloudinary upload failed:", cloudinaryError)
    throw cloudinaryError
  }
}
