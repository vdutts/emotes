import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString()
  })
}

export async function POST() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Webhook POST is accessible",
    timestamp: new Date().toISOString()
  })
}
