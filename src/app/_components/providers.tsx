"use client"

import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "react-hot-toast"

export function Providers() {
  return (
    <>
      <Analytics />
      <Toaster position="top-right" />
    </>
  )
}
