import { Response, webhookSchema } from "@/server/utils"
import { prisma } from "@/server/db"
import { replicate } from "@/server/replicate"
import { uploadToCloudinary } from "@/lib/cloudinary"

export async function POST(req: Request) {
  console.log("WEBHOOK CALLED")
  try {
    const searchParams = new URL(req.url).searchParams
    const parsedParams = webhookSchema.safeParse(Object.fromEntries(searchParams))
    if (!parsedParams.success) {
      console.error("VALIDATION FAILED:", JSON.stringify(parsedParams.error))
      return Response.invalidRequest(parsedParams.error)
    }
    const { id } = parsedParams.data

    // get output from Replicate
    const body = await req.json()
    console.log("BODY:", body.status)
    const { output, error } = body

    if (typeof error === "string") {
      console.error("Replicate error:", error)
      await prisma.emoji.update({ where: { id }, data: { isFlagged: true, error } })
      return Response.success()
    }

    if (!output) {
      console.error("No output in webhook body")
      return Response.badRequest("Missing output")
    }

    console.log("Fetching image from:", output[0])
    // convert output to a buffer
    const file = await fetch(output[0]).then((res) => res.arrayBuffer())
    console.log("Image fetched, size:", file.byteLength)

    // upload & store image
    console.log("Uploading to Cloudinary...")
    const url = await uploadToCloudinary(Buffer.from(file), `${id}-original`)
    console.log("Cloudinary URL:", url)

    // update emoji
    console.log("Updating database...")
    await prisma.emoji.update({ where: { id }, data: { originalUrl: url } })
    console.log("Database updated")

    console.log("Starting background removal...")
    const res = await replicate.removeBackground({ id, image: output[0] })
    console.log("Background removal started:", res)

    console.log("=== WEBHOOK SUCCESS ===")
    return Response.success()
  } catch (error) {
    console.error("=== WEBHOOK ERROR ===")
    console.error("Error type:", typeof error)
    console.error("Error:", error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    console.error("Error JSON:", JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return Response.internalServerError()
  }
}
