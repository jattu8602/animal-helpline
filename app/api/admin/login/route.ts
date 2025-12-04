import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { username, password, deviceId } = await req.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials are not configured on the server.' },
        { status: 500 }
      )
    }

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Invalid admin username or password.' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({
      success: true,
      deviceId: deviceId || null,
    })

    // Simple httpOnly session cookie for admin
    res.cookies.set('admin_session', 'active', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (error) {
    console.error('Error in admin login:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

