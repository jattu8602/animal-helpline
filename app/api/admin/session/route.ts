import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (session?.value === "active") {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error("Error checking admin session:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}



