import { NextResponse } from "next/server"

export const runtime = "experimental-edge"

export async function GET(_req: Request) {
  const time = Date.now()
  return NextResponse.json({ time })
}