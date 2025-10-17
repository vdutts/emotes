import Together from "together-ai"
import "server-only"
import { EMOJI_SIZE, SITE_URL } from "../lib/constants"

export class ReplicateClient {
  together: Together

  constructor({ auth }: { auth: string }) {
    this.together = new Together({ apiKey: auth })
  }

  async createEmoji({ id, prompt }: { id: string; prompt: string }) {
    // Generate image with Together.ai (faster, uncensored)
    const response = await this.together.images.create({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      prompt: `A TOK emoji of a ${prompt}`,
      width: EMOJI_SIZE,
      height: EMOJI_SIZE,
      steps: 30,
      n: 1,
    })

    const imageUrl = response.data[0].url
    
    // Manually trigger webhook since Together.ai doesn't support webhooks
    const webhook = new URL(`${SITE_URL}/api/webhook/remove-background`)
    webhook.searchParams.set("id", id)
    webhook.searchParams.set("secret", process.env.API_SECRET as string)

    // Call webhook with the generated image
    await fetch(webhook.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        output: [imageUrl],
        status: "succeeded",
      }),
    })

    return { id, url: imageUrl }
  }

  async removeBackground({ id, image }: { id: string; image: string }) {
    // Use remove.bg API (faster than Replicate)
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY || "",
      },
      body: JSON.stringify({
        image_url: image,
        size: "auto",
      }),
    })

    const blob = await response.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    // Manually trigger save webhook
    const webhook = new URL(`${SITE_URL}/api/webhook/save-emoji`)
    webhook.searchParams.set("id", id)
    webhook.searchParams.set("secret", process.env.API_SECRET as string)

    await fetch(webhook.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        output: buffer.toString("base64"),
        status: "succeeded",
      }),
    })

    return { id }
  }
}

export const replicate = new ReplicateClient({
  auth: process.env.TOGETHER_API_KEY as string,
})
