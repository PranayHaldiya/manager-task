import { db } from "@/db";
import { taskAssignments, tasks, users } from "@/db/schema/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const assignmentSchema = z.object({
  userId: z.string().uuid(),
});

export async function GET(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assignments = await db
      .select({
        id: taskAssignments.id,
        taskId: taskAssignments.taskId,
        userId: taskAssignments.userId,
        assignedById: taskAssignments.assignedById,
        createdAt: taskAssignments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(taskAssignments)
      .leftJoin(users, eq(users.id, taskAssignments.userId))
      .where(eq(taskAssignments.taskId, params.taskId));

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify task exists
    const task = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, params.taskId))
      .limit(1);

    if (!task.length) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { userId } = assignmentSchema.parse(body);

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if assignment already exists
    const existingAssignment = await db
      .select()
      .from(taskAssignments)
      .where(
        and(
          eq(taskAssignments.taskId, params.taskId),
          eq(taskAssignments.userId, userId)
        )
      )
      .limit(1);

    if (existingAssignment.length) {
      return NextResponse.json(
        { error: "User already assigned to this task" },
        { status: 400 }
      );
    }

    const [assignment] = await db
      .insert(taskAssignments)
      .values({
        taskId: params.taskId,
        userId,
        assignedById: session.user.id,
      })
      .returning();

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    console.error("Failed to create assignment:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { taskId: string; assignmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [deletedAssignment] = await db
      .delete(taskAssignments)
      .where(
        and(
          eq(taskAssignments.id, params.assignmentId),
          eq(taskAssignments.taskId, params.taskId)
        )
      )
      .returning();

    if (!deletedAssignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete assignment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 