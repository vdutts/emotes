import Replicate from "replicate"
import "server-only"
import { EMOJI_SIZE, SITE_URL } from "../lib/constants"

export class ReplicateClient {
  replicate: Replicate

  constructor({ auth }: { auth: string }) {
    this.replicate = new Replicate({ auth })
    
    // Fix for Replicate caching issue
    this.replicate.fetch = (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, cache: "no-store" })
  }

  async createEmoji({ id, prompt }: { id: string; prompt: string }) {
    const webhook = new URL(`${SITE_URL}/api/webhook/remove-background`)
    webhook.searchParams.set("id", id)
    webhook.searchParams.set("secret", process.env.API_SECRET as string)

    return this.replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        prompt: `A TOK emoji of a ${prompt}`,
        width: EMOJI_SIZE,
        height: EMOJI_SIZE,
        num_inference_steps: 30,
        negative_prompt: "racist, xenophobic, antisemitic, islamophobic, bigoted",
      },
      webhook: webhook.toString(),
      webhook_events_filter: ["completed"],
    })
  }

  async removeBackground({ id, image }: { id: string; image: string }) {
    const webhook = new URL(`${SITE_URL}/api/webhook/save-emoji`)
    webhook.searchParams.set("id", id)
    webhook.searchParams.set("secret", process.env.API_SECRET as string)

    return this.replicate.predictions.create({
      version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      input: {
        image,
      },
      webhook: webhook.toString(),
      webhook_events_filter: ["completed"],
    })
  }
}

export const replicate = new ReplicateClient({
  auth: process.env.REPLICATE_API_TOKEN as string,
})
