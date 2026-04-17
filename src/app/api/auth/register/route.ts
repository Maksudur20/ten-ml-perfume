import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, confirmPassword } = body

    // Validate required fields
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      )
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email' },
        { status: 400 }
      )
    }

    // Validate username length
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { message: 'Username must be between 3 and 30 characters' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    })

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { message: 'Email already registered' },
          { status: 400 }
        )
      }
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json(
          { message: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create new user
    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
    })

    // Return success (don't return password)
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
