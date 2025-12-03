import { NextResponse } from "next/server"

export async function POST() {
  try {
    const res = NextResponse.json({ success: true })

    // Clear the admin session cookie
    res.cookies.set("admin_session", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return res
  } catch (error) {
    console.error("Error in admin logout:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}


