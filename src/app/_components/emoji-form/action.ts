"use server"

import { nanoid } from "@/lib/utils"
import { prisma } from "@/server/db"
import { replicate } from "@/server/replicate"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { jwtVerify } from "jose"
import { redirect } from "next/navigation"
import { z } from "zod"

const jwtSchema = z.object({
  ip: z.string(),
  isIOS: z.boolean(),
})

const ratelimit = {
  free: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(500, "1 d"),
  }),
  ios: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(3, "7 d"),
    prefix: "ratelimit:ios",
  }),
}

interface FormState {
  message: string
}

export async function createEmoji(prevFormState: FormState | undefined, formData: FormData): Promise<FormState | void> {
  const prompt = (formData.get("prompt") as string | null)?.trim().replaceAll(":", "")
  const token = formData.get("token") as string | null

  if (!prompt) return // no need to display an error message for blank prompts
  const id = nanoid()

  try {
    console.log("Starting emoji creation for:", prompt)
    const verified = await jwtVerify(token ?? "", new TextEncoder().encode(process.env.API_SECRET ?? ""))
    console.log("JWT verified")
    const { ip, isIOS } = jwtSchema.parse(verified.payload)
    console.log("IP:", ip, "isIOS:", isIOS)

    // Temporarily disabled due to Upstash free tier limitations
    // const { remaining } = await (isIOS ? ratelimit.ios.limit(ip) : ratelimit.free.limit(ip))
    // console.log("Rate limit remaining:", remaining)
    // if (remaining <= 0) return { message: "Free limit reached, download mobile app for unlimited access." }

    console.log("Classifying prompt with Replicate")
    const safetyRating = await replicate.classifyPrompt({ prompt })
    console.log("Safety rating:", safetyRating)
    const data = { id, prompt, safetyRating }

    if (safetyRating >= 9) {
      await prisma.emoji.create({ data: { ...data, isFlagged: true } })
      return { message: "Nice try! Your prompt is inappropriate, let's keep it PG." }
    }

    console.log("Creating emoji in DB and starting generation")
    await Promise.all([prisma.emoji.create({ data }), replicate.createEmoji(data)])
    console.log("Success!")
  } catch (error) {
    console.error("ERROR DETAILS:", error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack")
    return { message: "Connection error, please refresh the page." }
  }

  redirect(`/p/${id}`)
}
