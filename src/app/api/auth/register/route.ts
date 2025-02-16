import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    // Log the database connection URL (without sensitive info)
    const dbUrl = process.env.POSTGRES_URL || '';
    console.log("Database connection:", dbUrl.replace(/:[^:@]*@/, ':***@'));

    // Parse and validate request body
    const body = await request.json();
    console.log("Received registration request:", { ...body, password: '[REDACTED]' });
    
    const { name, email, password } = registerSchema.parse(body);

    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));

      console.log("Existing user check result:", { count: existingUser.length });

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    } catch (dbError) {
      console.error("Database query error:", {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      });
      throw dbError;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create user
      const [user] = await db
        .insert(users)
        .values({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
        });

      console.log("User created successfully:", { id: user.id, email: user.email });

      return NextResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
        { status: 201 }
      );
    } catch (insertError) {
      console.error("Database insert error:", {
        error: insertError,
        message: insertError instanceof Error ? insertError.message : 'Unknown error',
        stack: insertError instanceof Error ? insertError.stack : undefined
      });
      throw insertError;
    }
  } catch (error) {
    console.error("Registration error details:", {
      error,
      type: error instanceof Error ? error.constructor.name : 'Unknown error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }

      // Check for connection errors
      if (error.message.includes('connect')) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 